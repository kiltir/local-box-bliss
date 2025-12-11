
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYMENT] ${step}${detailsStr}`);
};

// Utility function to normalize URLs
const toAbsoluteUrl = (url: string, origin: string): string | null => {
  try {
    // If already absolute, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Convert relative URL to absolute
    const absoluteUrl = new URL(url, origin).href;
    return absoluteUrl;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("Failed to normalize URL", { url, origin, error: msg });
    return null;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    logStep("Stripe key verified");

    // Get origin early for URL normalization
    const origin = req.headers.get("origin") || "http://localhost:3000";
    logStep("Origin detected", { origin });

    // Parse request body
    const { items, currency = 'eur', travelInfo } = await req.json();
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("No items provided in cart");
    }
    
    // Calculate shipping cost based on delivery preference
    // 15€ for Réunion/airport, 25€ for Métropole
    let shippingCost = 2500; // Default: 25€ for métropole (in cents)
    let shippingLabel = 'Livraison métropole';
    
    if (travelInfo?.delivery_preference) {
      switch (travelInfo.delivery_preference) {
        case 'airport_pickup_arrival':
        case 'airport_pickup_departure':
        case 'reunion_delivery':
          shippingCost = 1500; // 15€ in cents
          shippingLabel = travelInfo.delivery_preference.includes('airport') 
            ? 'Récupération aéroport' 
            : 'Livraison Réunion';
          break;
        default:
          shippingCost = 2500; // 25€ in cents
          shippingLabel = 'Livraison métropole';
      }
    }
    
    logStep("Items received", { itemCount: items.length, currency, hasTravelInfo: !!travelInfo, shippingCost, shippingLabel });

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Check for authenticated user (optional for guest checkout)
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    let user = null;
    let customerEmail = "guest@example.com";
    let userProfile = null;
    
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        user = data.user;
        if (user?.email) {
          customerEmail = user.email;
          logStep("Authenticated user found", { userId: user.id, email: user.email });
          
          // Fetch user profile for billing address
          const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('full_name, billing_address_street, billing_address_city, billing_address_postal_code, billing_address_country')
            .eq('id', user.id)
            .single();
          
          if (profile && !profileError) {
            userProfile = profile;
            logStep("User profile found", { hasAddress: !!(profile.billing_address_street && profile.billing_address_city) });
          } else if (profileError) {
            logStep("Profile fetch error", { error: profileError.message });
          }
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        logStep("Auth header present but invalid, proceeding as guest", { error: msg });
      }
    } else {
      logStep("No auth header, proceeding as guest checkout");
    }

    // Upsert Stripe customer (prefill Checkout via customer)
    let customerId;
    if (customerEmail !== "guest@example.com") {
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });

      const addressData = (userProfile && userProfile.billing_address_street && userProfile.billing_address_city && userProfile.billing_address_postal_code && userProfile.billing_address_country)
        ? {
            line1: userProfile.billing_address_street,
            city: userProfile.billing_address_city,
            postal_code: userProfile.billing_address_postal_code,
            country: (userProfile.billing_address_country as string).toUpperCase(),
          }
        : undefined;
      const nameData = (userProfile as any)?.full_name || undefined;

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        // Update existing customer with latest profile info if available
        try {
          await stripe.customers.update(customerId, {
            ...(nameData ? { name: nameData } : {}),
            ...(addressData ? { address: addressData } : {}),
          });
          logStep("Stripe customer updated", { customerId });
        } catch (e) {
          logStep("Stripe customer update failed", { customerId, error: (e as Error).message });
        }
        logStep("Existing Stripe customer found", { customerId });
      } else {
        // Create a new customer so Checkout can prefill
        const created = await stripe.customers.create({
          email: customerEmail,
          ...(nameData ? { name: nameData } : {}),
          ...(addressData ? { address: addressData } : {}),
        });
        customerId = created.id;
        logStep("Stripe customer created", { customerId });
      }
    }

    // Build line items from cart with normalized image URLs
    const lineItems = items.map((item: any) => {
      const unitAmount = Math.round(item.box.price * 100); // Convert to cents
      
      // Normalize image URL
      const originalImage = item.box.image;
      const normalizedImage = toAbsoluteUrl(originalImage, origin);
      
      logStep("Processing item", { 
        title: item.box.baseTitle, 
        price: item.box.price, 
        quantity: item.quantity,
        unitAmount,
        originalImage,
        normalizedImage
      });
      
      const productData: any = {
        name: item.box.baseTitle,
        description: item.box.description || `Box ${item.box.theme}`,
      };

      // Only add images if we have a valid normalized URL
      if (normalizedImage) {
        productData.images = [normalizedImage];
      }

      return {
        price_data: {
          currency: currency,
          product_data: productData,
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    logStep("Line items created", { count: lineItems.length });

    // Create simplified metadata to stay under 500 character limit
    const simplifiedItems = items.map((item: any) => ({
      id: item.box.id,
      title: item.box.baseTitle,
      price: item.box.price,
      quantity: item.quantity,
      ...(item.subscriptionType && { subscriptionType: item.subscriptionType })
    }));

    // Determine if we have complete billing address
    const hasCompleteAddress = userProfile && 
      userProfile.billing_address_street && 
      userProfile.billing_address_city && 
      userProfile.billing_address_postal_code && 
      userProfile.billing_address_country;

    // Create checkout session with metadata for webhook processing
    const sessionConfig: any = {
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/payment-success`,
      cancel_url: `${origin}/payment-canceled`,
      automatic_tax: { enabled: false },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'DE', 'ES', 'IT', 'NL', 'LU'],
      },
      custom_text: {
        shipping_address: {
          message: '(Destinataire)',
        },
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: shippingCost,
              currency: 'eur',
            },
            display_name: shippingLabel,
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ],
      metadata: {
        user_id: user?.id || 'guest',
        items: JSON.stringify(simplifiedItems),
        ...(travelInfo && { travel_info: JSON.stringify(travelInfo) }),
      },
    };

    // Customer details are prefilled via associated Stripe Customer (see upsert above)

    // Add customer info
    if (customerId) {
      sessionConfig.customer = customerId;
    } else {
      sessionConfig.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    
    logStep("Checkout session created", { 
      sessionId: session.id, 
      url: session.url?.substring(0, 50) + "..." 
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
