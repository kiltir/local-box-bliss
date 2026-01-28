
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://dmtxlyxgpmszsqfuyzkc.lovableproject.com',
  'https://kiltirbox.re',
  'https://www.kiltirbox.re',
  'http://localhost:5173',
  'http://localhost:3000',
];

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = origin && ALLOWED_ORIGINS.some(allowed => 
    origin === allowed || origin.endsWith('.lovableproject.com')
  ) ? origin : ALLOWED_ORIGINS[0];
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYMENT] ${step}${detailsStr}`);
};

// Utility function to normalize URLs
const toAbsoluteUrl = (url: string, origin: string): string | null => {
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const absoluteUrl = new URL(url, origin).href;
    return absoluteUrl;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("Failed to normalize URL", { url, origin, error: msg });
    return null;
  }
};

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

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

    const requestOrigin = origin || "http://localhost:3000";
    logStep("Origin detected", { origin: requestOrigin });

    const { items, currency = 'eur', travelInfo } = await req.json();
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("No items provided in cart");
    }
    
    // Determine if this is a subscription order
    const hasSubscription = items.some((item: any) => item.subscriptionType);
    const isOneTimeOnly = items.every((item: any) => !item.subscriptionType);
    
    logStep("Order type detected", { hasSubscription, isOneTimeOnly, itemCount: items.length });
    
    // For mixed carts (subscription + one-time), we need to split them
    // For now, we'll only allow pure subscription or pure one-time orders
    if (hasSubscription && !items.every((item: any) => item.subscriptionType)) {
      throw new Error("Impossible de mélanger abonnements et achats uniques dans le même panier");
    }
    
    // Calculate shipping cost based on delivery preference
    let shippingCostBase = 2500; // Default: 25€ for métropole (in cents)
    let shippingLabel = 'Livraison métropole';
    
    if (travelInfo?.delivery_preference) {
      switch (travelInfo.delivery_preference) {
        case 'airport_pickup_arrival':
        case 'airport_pickup_departure':
          shippingCostBase = 1500;
          shippingLabel = 'Récupération aéroport';
          break;
        case 'reunion_delivery':
          shippingCostBase = 1200;
          shippingLabel = 'Livraison Réunion';
          break;
        default:
          shippingCostBase = 2500;
          shippingLabel = 'Livraison métropole';
      }
    }
    
    logStep("Items received", { itemCount: items.length, currency, hasTravelInfo: !!travelInfo, shippingCostBase, shippingLabel });

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch all box prices from database for validation
    const { data: dbPrices, error: pricesError } = await supabaseClient
      .from('box_prices')
      .select('box_id, theme, unit_price, subscription_6_months_price, subscription_12_months_price');
    
    if (pricesError) {
      logStep("Failed to fetch prices from database", { error: pricesError.message });
      throw new Error("Impossible de valider les prix. Veuillez réessayer.");
    }

    logStep("Database prices fetched", { count: dbPrices?.length || 0 });

    const priceMap = new Map<string, { unit: number; sub6: number; sub12: number }>();
    if (dbPrices) {
      for (const price of dbPrices) {
        const key = `${price.box_id}-${price.theme}`;
        priceMap.set(key, {
          unit: Number(price.unit_price),
          sub6: Number(price.subscription_6_months_price),
          sub12: Number(price.subscription_12_months_price),
        });
      }
    }

    // Validate each item's price against database
    for (const item of items) {
      const boxId = item.box?.id;
      const theme = item.box?.theme;
      const clientPrice = item.box?.price;
      const subscriptionType = item.subscriptionType;

      if (!boxId || !theme) {
        logStep("Invalid item - missing boxId or theme", { item });
        throw new Error("Article invalide dans le panier");
      }

      const key = `${boxId}-${theme}`;
      const dbPrice = priceMap.get(key);

      if (!dbPrice) {
        logStep("Price not found in database", { boxId, theme });
        throw new Error(`Prix introuvable pour l'article: ${item.box?.baseTitle || 'Inconnu'}`);
      }

      let expectedPrice: number;
      if (subscriptionType === '6months' || subscriptionType === '6_months') {
        expectedPrice = dbPrice.sub6;
      } else if (subscriptionType === '1year' || subscriptionType === '12_months') {
        expectedPrice = dbPrice.sub12;
      } else {
        expectedPrice = dbPrice.unit;
      }

      const priceDifference = Math.abs(clientPrice - expectedPrice);
      if (priceDifference > 0.01) {
        logStep("PRICE MANIPULATION DETECTED", { 
          boxId, theme, clientPrice, expectedPrice, subscriptionType, difference: priceDifference 
        });
        throw new Error("Les prix ont été modifiés. Veuillez rafraîchir votre panier.");
      }

      logStep("Price validated", { boxId, theme, price: expectedPrice, subscriptionType });
    }

    logStep("All prices validated successfully");

    // Check for authenticated user
    const supabaseAnonClient = createClient(
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
        const { data } = await supabaseAnonClient.auth.getUser(token);
        user = data.user;
        if (user?.email) {
          customerEmail = user.email;
          logStep("Authenticated user found", { userId: user.id });
          
          const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('full_name, billing_address_street, billing_address_city, billing_address_postal_code, billing_address_country')
            .eq('id', user.id)
            .single();
          
          if (profile && !profileError) {
            userProfile = profile;
            logStep("User profile found", { hasAddress: !!(profile.billing_address_street && profile.billing_address_city) });
          }
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        logStep("Auth header present but invalid", { error: msg });
      }
    }

    // For subscriptions, user must be authenticated
    if (hasSubscription && !user) {
      throw new Error("Vous devez être connecté pour souscrire à un abonnement");
    }

    // Upsert Stripe customer
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
        try {
          await stripe.customers.update(customerId, {
            ...(nameData ? { name: nameData } : {}),
            ...(addressData ? { address: addressData } : {}),
          });
          logStep("Stripe customer updated", { customerId });
        } catch (e) {
          logStep("Stripe customer update failed", { customerId, error: (e as Error).message });
        }
      } else {
        const created = await stripe.customers.create({
          email: customerEmail,
          ...(nameData ? { name: nameData } : {}),
          ...(addressData ? { address: addressData } : {}),
        });
        customerId = created.id;
        logStep("Stripe customer created", { customerId });
      }
    }

    // SUBSCRIPTION FLOW
    if (hasSubscription) {
      logStep("Processing subscription order");
      
      // For subscriptions, we create Stripe Subscriptions with monthly billing
      const subscriptionItems: any[] = [];
      
      for (const item of items) {
        const key = `${item.box.id}-${item.box.theme}`;
        const dbPrice = priceMap.get(key)!;
        
        const isYearly = item.subscriptionType === '1year' || item.subscriptionType === '12_months';
        const months = isYearly ? 12 : 6;
        const monthlyPrice = isYearly ? dbPrice.sub12 : dbPrice.sub6;
        const monthlyPriceCents = Math.round(monthlyPrice * 100);
        
        // Create or get Stripe product
        const productName = `${item.box.baseTitle} - Abonnement ${months} mois`;
        
        // Search for existing product
        const existingProducts = await stripe.products.search({
          query: `name:'${productName.replace(/'/g, "\\'")}' active:'true'`,
        });
        
        let productId: string;
        if (existingProducts.data.length > 0) {
          productId = existingProducts.data[0].id;
          logStep("Found existing product", { productId, productName });
        } else {
          const newProduct = await stripe.products.create({
            name: productName,
            description: `Abonnement mensuel ${item.box.theme} - Engagement ${months} mois`,
            metadata: {
              box_id: item.box.id.toString(),
              theme: item.box.theme,
              duration_months: months.toString(),
            },
          });
          productId = newProduct.id;
          logStep("Created new product", { productId, productName });
        }
        
        // Create recurring price for monthly billing
        const priceData = await stripe.prices.create({
          product: productId,
          unit_amount: monthlyPriceCents + shippingCostBase, // Include shipping in monthly price
          currency: currency,
          recurring: {
            interval: 'month',
            interval_count: 1,
          },
          metadata: {
            box_id: item.box.id.toString(),
            theme: item.box.theme,
            monthly_box_price: monthlyPriceCents.toString(),
            monthly_shipping: shippingCostBase.toString(),
          },
        });
        
        logStep("Created recurring price", { 
          priceId: priceData.id, 
          monthlyAmount: monthlyPriceCents + shippingCostBase,
          boxPrice: monthlyPriceCents,
          shipping: shippingCostBase
        });
        
        subscriptionItems.push({
          price: priceData.id,
          quantity: item.quantity,
          metadata: {
            box_id: item.box.id.toString(),
            theme: item.box.theme,
            duration_months: months.toString(),
          },
        });
      }
      
      // Create simplified metadata for the subscription
      const simplifiedItems = items.map((item: any) => ({
        id: item.box.id,
        title: item.box.baseTitle,
        theme: item.box.theme,
        price: item.box.price,
        quantity: item.quantity,
        subscriptionType: item.subscriptionType,
        durationMonths: (item.subscriptionType === '1year' || item.subscriptionType === '12_months') ? 12 : 6,
      }));
      
      // Create Stripe Checkout Session for subscription
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        line_items: subscriptionItems.map(item => ({
          price: item.price,
          quantity: item.quantity,
        })),
        success_url: `${requestOrigin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${requestOrigin}/payment-canceled`,
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: ['FR', 'RE', 'BE', 'CH', 'DE', 'ES', 'IT', 'NL', 'LU'],
        },
        subscription_data: {
          metadata: {
            user_id: user!.id,
            items: JSON.stringify(simplifiedItems),
            ...(travelInfo && { travel_info: JSON.stringify(travelInfo) }),
          },
          // Set billing cycle anchor to now
          // Subscription will automatically cancel after the specified period
        },
        payment_method_collection: 'always',
        metadata: {
          user_id: user!.id,
          is_subscription: 'true',
          items: JSON.stringify(simplifiedItems),
        },
      });
      
      logStep("Subscription checkout session created", { 
        sessionId: session.id, 
        url: session.url?.substring(0, 50) + "..." 
      });

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // ONE-TIME PAYMENT FLOW (existing logic)
    logStep("Processing one-time payment order");
    
    const lineItems = items.map((item: any) => {
      const key = `${item.box.id}-${item.box.theme}`;
      const dbPrice = priceMap.get(key)!;
      const validatedPrice = dbPrice.unit;
      const unitAmount = Math.round(validatedPrice * 100);
      
      const originalImage = item.box.image;
      const normalizedImage = toAbsoluteUrl(originalImage, requestOrigin);
      
      logStep("Processing item with validated price", { 
        title: item.box.baseTitle, 
        validatedPrice,
        quantity: item.quantity,
        unitAmount,
      });
      
      const productData: any = {
        name: item.box.baseTitle,
        description: item.box.description || `Box ${item.box.theme}`,
      };

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

    logStep("Line items created with validated prices", { count: lineItems.length });

    const simplifiedItems = items.map((item: any) => ({
      id: item.box.id,
      title: item.box.baseTitle,
      price: item.box.price,
      quantity: item.quantity,
    }));

    const sessionConfig: any = {
      line_items: lineItems,
      mode: "payment",
      success_url: `${requestOrigin}/payment-success`,
      cancel_url: `${requestOrigin}/payment-canceled`,
      automatic_tax: { enabled: false },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['FR', 'RE', 'BE', 'CH', 'DE', 'ES', 'IT', 'NL', 'LU'],
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
              amount: shippingCostBase,
              currency: 'eur',
            },
            display_name: shippingLabel,
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 7 },
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
