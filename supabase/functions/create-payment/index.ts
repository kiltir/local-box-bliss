
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// CORS headers - allow all origins for compatibility with preview/production URLs
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYMENT] ${step}${detailsStr}`);
};

// Normalize theme names for comparison (removes accents, lowercase)
const normalizeTheme = (theme: string): string => {
  return theme
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
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
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    logStep("Stripe key verified");

    const requestOrigin = req.headers.get("origin") || "http://localhost:3000";
    logStep("Origin detected", { origin: requestOrigin });

    const { items, currency = 'eur', travelInfo } = await req.json();
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("No items provided in cart");
    }
    
    // Determine order type - now supports mixed carts!
    const subscriptionItems = items.filter((item: any) => item.subscriptionType);
    const oneTimeItems = items.filter((item: any) => !item.subscriptionType);
    const hasSubscription = subscriptionItems.length > 0;
    const hasOneTime = oneTimeItems.length > 0;
    const isMixedCart = hasSubscription && hasOneTime;
    
    logStep("Order type detected", { 
      hasSubscription, 
      hasOneTime, 
      isMixedCart,
      subscriptionCount: subscriptionItems.length,
      oneTimeCount: oneTimeItems.length,
      itemCount: items.length 
    });
    
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
        // Use normalized theme for the key
        const key = `${price.box_id}-${normalizeTheme(price.theme)}`;
        priceMap.set(key, {
          unit: Number(price.unit_price),
          sub6: Number(price.subscription_6_months_price),
          sub12: Number(price.subscription_12_months_price),
          originalTheme: price.theme, // Keep original for logging
        });
      }
    }

    // Validate each item's price against database
    for (const item of items) {
      // For subscriptions, boxId contains the original box ID (1, 2, 3, 4)
      // For one-time purchases, we use id directly
      const boxId = item.box?.boxId || item.box?.id;
      const theme = item.box?.theme;
      const clientPrice = item.box?.price;
      const subscriptionType = item.subscriptionType;

      if (!boxId || !theme) {
        logStep("Invalid item - missing boxId or theme", { item });
        throw new Error("Article invalide dans le panier");
      }

      // Use normalized theme for lookup
      const key = `${boxId}-${normalizeTheme(theme)}`;
      const dbPrice = priceMap.get(key);

      if (!dbPrice) {
        logStep("Price not found in database", { boxId, theme, normalizedTheme: normalizeTheme(theme), availableKeys: Array.from(priceMap.keys()) });
        throw new Error(`Prix introuvable pour l'article: ${item.box?.baseTitle || 'Inconnu'}`);
      }

      // For subscriptions, client sends total engagement price (monthly * months)
      // For one-time, client sends unit price
      let expectedPrice: number;
      let monthlyPrice: number | null = null;
      
      if (subscriptionType === '6months' || subscriptionType === '6_months') {
        monthlyPrice = dbPrice.sub6;
        expectedPrice = monthlyPrice * 6; // Total engagement = monthly × 6
      } else if (subscriptionType === '1year' || subscriptionType === '12_months') {
        monthlyPrice = dbPrice.sub12;
        expectedPrice = monthlyPrice * 12; // Total engagement = monthly × 12
      } else {
        expectedPrice = dbPrice.unit;
      }

      const priceDifference = Math.abs(clientPrice - expectedPrice);
      if (priceDifference > 1) { // Allow 1€ tolerance for rounding
        logStep("PRICE MANIPULATION DETECTED", { 
          boxId, theme, clientPrice, expectedPrice, monthlyPrice, subscriptionType, difference: priceDifference 
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

    // SUBSCRIPTION FLOW (including mixed carts)
    if (hasSubscription) {
      logStep("Processing subscription order", { isMixedCart });
      
      // For subscriptions, we create Stripe Subscriptions with monthly billing
      const stripeSubscriptionItems: any[] = [];
      
      for (const item of subscriptionItems) {
        const boxId = item.box.boxId || item.box.id;
        const key = `${boxId}-${normalizeTheme(item.box.theme)}`;
        const dbPrice = priceMap.get(key)!
        
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
        
        stripeSubscriptionItems.push({
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
      const simplifiedSubscriptionItems = subscriptionItems.map((item: any) => ({
        id: item.box.id,
        title: item.box.baseTitle,
        theme: item.box.theme,
        price: item.box.price,
        quantity: item.quantity,
        subscriptionType: item.subscriptionType,
        durationMonths: (item.subscriptionType === '1year' || item.subscriptionType === '12_months') ? 12 : 6,
      }));
      
      // Prepare one-time items for invoice_items (for mixed carts)
      const oneTimeItemsData: any[] = [];
      if (isMixedCart) {
        for (const item of oneTimeItems) {
          const key = `${item.box.id}-${normalizeTheme(item.box.theme)}`;
          const dbPrice = priceMap.get(key)!;
          const validatedPrice = dbPrice.unit;
          const unitAmount = Math.round(validatedPrice * 100);
          
          const originalImage = item.box.image;
          const normalizedImage = toAbsoluteUrl(originalImage, requestOrigin);
          
          oneTimeItemsData.push({
            boxId: item.box.id,
            title: item.box.baseTitle,
            theme: item.box.theme,
            unitAmount: unitAmount,
            quantity: item.quantity,
            description: item.box.description || `Box ${item.box.theme}`,
            image: normalizedImage,
          });
          
          logStep("Prepared one-time item for mixed cart", { 
            title: item.box.baseTitle, 
            unitAmount,
            quantity: item.quantity
          });
        }
      }
      
      // Calculate total for one-time items (for display/logging)
      const oneTimeTotalCents = oneTimeItemsData.reduce((sum, item) => sum + (item.unitAmount * item.quantity), 0);
      // Add shipping for one-time items in mixed cart
      const oneTimeShippingCents = isMixedCart ? shippingCostBase : 0;
      
      // Build session configuration
      const sessionConfig: any = {
        customer: customerId,
        mode: 'subscription',
        line_items: stripeSubscriptionItems.map(item => ({
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
            items: JSON.stringify(simplifiedSubscriptionItems),
            is_mixed_cart: isMixedCart ? 'true' : 'false',
            ...(travelInfo && { travel_info: JSON.stringify(travelInfo) }),
          },
        },
        payment_method_collection: 'always',
        metadata: {
          user_id: user!.id,
          is_subscription: 'true',
          is_mixed_cart: isMixedCart ? 'true' : 'false',
          items: JSON.stringify(simplifiedSubscriptionItems),
          ...(isMixedCart && { one_time_items: JSON.stringify(oneTimeItemsData.map(i => ({ id: i.boxId, title: i.title, price: i.unitAmount / 100, quantity: i.quantity }))) }),
        },
      };
      
      // For mixed carts, add one-time items as invoice_items using add_invoice_items
      if (isMixedCart && oneTimeItemsData.length > 0) {
        // Create products for one-time items and add them as add_invoice_items
        const invoiceItems: any[] = [];
        
        for (const item of oneTimeItemsData) {
          // Create a one-time price for this item
          const productData: any = {
            name: `${item.title} (Achat unique)`,
            description: item.description,
          };
          if (item.image) {
            productData.images = [item.image];
          }
          
          const oneTimeProduct = await stripe.products.create(productData);
          
          const oneTimePrice = await stripe.prices.create({
            product: oneTimeProduct.id,
            unit_amount: item.unitAmount,
            currency: currency,
            metadata: {
              box_id: item.boxId.toString(),
              theme: item.theme,
              is_one_time: 'true',
            },
          });
          
          invoiceItems.push({
            price: oneTimePrice.id,
            quantity: item.quantity,
          });
          
          logStep("Created one-time invoice item", { 
            productId: oneTimeProduct.id,
            priceId: oneTimePrice.id,
            title: item.title,
            amount: item.unitAmount
          });
        }
        
        // Add shipping for one-time items
        if (oneTimeShippingCents > 0) {
          const shippingProduct = await stripe.products.create({
            name: `Frais de livraison (achats uniques)`,
            description: shippingLabel,
          });
          
          const shippingPrice = await stripe.prices.create({
            product: shippingProduct.id,
            unit_amount: oneTimeShippingCents,
            currency: currency,
            metadata: {
              is_shipping: 'true',
              is_one_time: 'true',
            },
          });
          
          invoiceItems.push({
            price: shippingPrice.id,
            quantity: 1,
          });
          
          logStep("Added one-time shipping to invoice", { amount: oneTimeShippingCents });
        }
        
        // Add invoice_items to subscription_data
        sessionConfig.subscription_data.add_invoice_items = invoiceItems;
        
        logStep("Mixed cart configured", { 
          subscriptionItemCount: stripeSubscriptionItems.length,
          oneTimeItemCount: invoiceItems.length,
          oneTimeTotalCents: oneTimeTotalCents + oneTimeShippingCents
        });
      }
      
      // Create Stripe Checkout Session for subscription (with optional one-time add-ons)
      const session = await stripe.checkout.sessions.create(sessionConfig);
      
      logStep("Subscription checkout session created", { 
        sessionId: session.id, 
        url: session.url?.substring(0, 50) + "...",
        isMixedCart
      });

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // ONE-TIME PAYMENT FLOW (existing logic)
    logStep("Processing one-time payment order");
    
    const lineItems = items.map((item: any) => {
      const key = `${item.box.id}-${normalizeTheme(item.box.theme)}`;
      const dbPrice = priceMap.get(key)!
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
