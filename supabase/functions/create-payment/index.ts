
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
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Canonical box images shown on the Stripe checkout, per purchase type
    const ONE_TIME_IMAGE = '/lovable-uploads/KB_box_achat_unique.png';
    const SUBSCRIPTION_IMAGE = '/lovable-uploads/KB_box_abonnement.png';
    const oneTimeImageUrl = toAbsoluteUrl(ONE_TIME_IMAGE, requestOrigin);
    const subscriptionImageUrl = toAbsoluteUrl(SUBSCRIPTION_IMAGE, requestOrigin);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch shipping costs from database
    const { data: shippingCostsData, error: shippingError } = await supabaseClient
      .from('shipping_costs')
      .select('delivery_type, label, cost')
      .eq('is_active', true);

    if (shippingError) {
      logStep("Failed to fetch shipping costs", { error: shippingError.message });
    }

    const shippingMap = new Map<string, { label: string; cost: number }>();
    if (shippingCostsData) {
      for (const sc of shippingCostsData) {
        shippingMap.set(sc.delivery_type, { label: sc.label, cost: Number(sc.cost) });
      }
    }

    // Determine shipping based on delivery preference
    let shippingCostBase: number;
    let shippingLabel: string;
    let isAirportMode = false;
    // Métropole fallback used for subsequent months of subscriptions when airport mode is active
    const metropoleShipping = (() => {
      const found = shippingMap.get('metropole');
      return found || { label: 'Livraison métropole', cost: 25 };
    })();
    const metropoleShippingCents = Math.round(metropoleShipping.cost * 100);

    const getShipping = (type: string) => {
      const found = shippingMap.get(type);
      return found || { label: 'Livraison métropole', cost: 25 };
    };

    if (travelInfo?.delivery_preference) {
      switch (travelInfo.delivery_preference) {
        case 'airport_pickup_arrival':
        case 'airport_pickup_departure': {
          const s = getShipping('airport');
          shippingCostBase = Math.round(s.cost * 100);
          shippingLabel = s.label;
          isAirportMode = true;
          break;
        }
        case 'reunion_delivery': {
          const s = getShipping('reunion');
          shippingCostBase = Math.round(s.cost * 100);
          shippingLabel = s.label;
          break;
        }
        default: {
          const s = getShipping('metropole');
          shippingCostBase = Math.round(s.cost * 100);
          shippingLabel = s.label;
        }
      }
    } else {
      const s = getShipping('metropole');
      shippingCostBase = Math.round(s.cost * 100);
      shippingLabel = s.label;
    }

    // Lock the shipping country on Stripe checkout based on the delivery mode
    const isReunionDestination =
      travelInfo?.delivery_preference === 'reunion_delivery' || isAirportMode;
    const allowedCountries: string[] = isReunionDestination ? ['RE'] : ['FR'];
    logStep("Allowed shipping countries resolved", { allowedCountries });

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
        const key = `${price.box_id}-${normalizeTheme(price.theme)}`;
        priceMap.set(key, {
          unit: Number(price.unit_price),
          sub6: Number(price.subscription_6_months_price),
          sub12: Number(price.subscription_12_months_price),
        });
      }
    }

    // Validate each item's price against database
    for (const item of items) {
      const boxId = item.box?.boxId || item.box?.id;
      const theme = item.box?.theme;
      const clientPrice = item.box?.price;
      const subscriptionType = item.subscriptionType;

      if (!boxId || !theme) {
        logStep("Invalid item - missing boxId or theme", { item });
        throw new Error("Article invalide dans le panier");
      }

      const key = `${boxId}-${normalizeTheme(theme)}`;
      const dbPrice = priceMap.get(key);

      if (!dbPrice) {
        logStep("Price not found in database", { boxId, theme, normalizedTheme: normalizeTheme(theme), availableKeys: Array.from(priceMap.keys()) });
        throw new Error(`Prix introuvable pour l'article: ${item.box?.baseTitle || 'Inconnu'}`);
      }

      let expectedPrice: number;
      let monthlyPrice: number | null = null;
      
      if (subscriptionType === '6months' || subscriptionType === '6_months') {
        monthlyPrice = dbPrice.sub6;
        expectedPrice = monthlyPrice * 6;
      } else if (subscriptionType === '1year' || subscriptionType === '12_months') {
        monthlyPrice = dbPrice.sub12;
        expectedPrice = monthlyPrice * 12;
      } else {
        expectedPrice = dbPrice.unit;
      }

      const priceDifference = Math.abs(clientPrice - expectedPrice);
      if (priceDifference > 1) {
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

    // ============================================================
    // Store items in pending_orders to avoid Stripe metadata limit
    // ============================================================
    const allItemsForStorage = items.map((item: any) => ({
      id: item.box?.id || item.box?.boxId,
      boxId: item.box?.boxId || item.box?.id,
      title: item.box?.baseTitle || 'Unknown',
      theme: item.box?.theme,
      price: item.box?.price,
      quantity: item.quantity,
      subscriptionType: item.subscriptionType || null,
      durationMonths: item.subscriptionType === '1year' || item.subscriptionType === '12_months' ? 12 : item.subscriptionType ? 6 : null,
    }));

    const { data: pendingOrder, error: pendingOrderError } = await supabaseClient
      .from('pending_orders')
      .insert({
        user_id: user?.id || '00000000-0000-0000-0000-000000000000',
        items: allItemsForStorage,
        travel_info: travelInfo || null,
      })
      .select()
      .single();

    if (pendingOrderError) {
      logStep("Failed to create pending order", { error: pendingOrderError.message });
      throw new Error("Erreur lors de la préparation de la commande");
    }

    const pendingOrderId = pendingOrder.id;
    logStep("Pending order created", { pendingOrderId, itemCount: allItemsForStorage.length });

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

      // We build line items by interleaving each product with its shipping line,
      // so the Stripe checkout displays the shipping row right below the
      // subscription/product it concerns.
      const allLineItems: any[] = [];
      // Airport supplement items added ONLY to the first invoice via
      // subscription_data.add_invoice_items (Stripe native mechanism).
      const firstInvoiceExtras: any[] = [];

      for (const item of subscriptionItems) {
        const boxId = item.box.boxId || item.box.id;
        const key = `${boxId}-${normalizeTheme(item.box.theme)}`;
        const dbPrice = priceMap.get(key)!
        
        const isYearly = item.subscriptionType === '1year' || item.subscriptionType === '12_months';
        const months = isYearly ? 12 : 6;
        const monthlyPrice = isYearly ? dbPrice.sub12 : dbPrice.sub6;
        const monthlyPriceCents = Math.round(monthlyPrice * 100);
        
        const productName = `${item.box.baseTitle} - Abonnement ${months} mois`;
        
        const existingProducts = await stripe.products.search({
          query: `name:'${productName.replace(/'/g, "\\'")}' active:'true'`,
        });
        
        let productId: string;
        if (existingProducts.data.length > 0) {
          productId = existingProducts.data[0].id;
          logStep("Found existing product", { productId, productName });
          if (subscriptionImageUrl) {
            try {
              await stripe.products.update(productId, { images: [subscriptionImageUrl] });
            } catch (e) {
              logStep("Failed to update subscription product image", { productId, error: (e as Error).message });
            }
          }
        } else {
          const newProduct = await stripe.products.create({
            name: productName,
            description: `Abonnement mensuel ${item.box.theme} - Engagement ${months} mois`,
            ...(subscriptionImageUrl ? { images: [subscriptionImageUrl] } : {}),
            metadata: {
              box_id: item.box.id.toString(),
              theme: item.box.theme,
              duration_months: months.toString(),
            },
          });
          productId = newProduct.id;
          logStep("Created new product", { productId, productName });
        }
        
        const priceData = await stripe.prices.create({
          product: productId,
          unit_amount: monthlyPriceCents,
          currency: currency,
          recurring: {
            interval: 'month',
            interval_count: 1,
          },
          metadata: {
            box_id: item.box.id.toString(),
            theme: item.box.theme,
            monthly_box_price: monthlyPriceCents.toString(),
          },
        });
        
        logStep("Created recurring price", { 
          priceId: priceData.id, 
          monthlyAmount: monthlyPriceCents,
          boxPrice: monthlyPriceCents,
        });

        allLineItems.push({
          price: priceData.id,
          quantity: item.quantity,
        });

        // Recurring shipping line placed right after this subscription item
        // When airport mode is active, recurring shipping stays at the
        // Métropole rate; the airport surcharge is added only to the 1st invoice.
        const recurringShippingCents = isAirportMode ? metropoleShippingCents : shippingCostBase;
        const recurringShippingLabel = isAirportMode ? metropoleShipping.label : shippingLabel;
        const recurringShippingProduct = await stripe.products.create({
          name: `${recurringShippingLabel} — ${item.box.baseTitle}`,
          description: 'Frais de livraison mensuels par box',
        });

        const recurringShippingPrice = await stripe.prices.create({
          product: recurringShippingProduct.id,
          unit_amount: recurringShippingCents,
          currency: currency,
          recurring: {
            interval: 'month',
            interval_count: 1,
          },
          metadata: {
            is_shipping: 'true',
            is_subscription: 'true',
            box_id: item.box.id.toString(),
            theme: item.box.theme,
          },
        });

        allLineItems.push({
          price: recurringShippingPrice.id,
          quantity: item.quantity,
        });

        // First-invoice-only airport surcharge (delta airport - métropole)
        if (isAirportMode) {
          const surchargeCents = shippingCostBase - metropoleShippingCents;
          if (surchargeCents > 0) {
            const surchargeProduct = await stripe.products.create({
              name: `Supplément livraison aéroport (1er mois) — ${item.box.baseTitle}`,
              description: 'Facturé uniquement sur la première facture',
            });
            const surchargePrice = await stripe.prices.create({
              product: surchargeProduct.id,
              unit_amount: surchargeCents,
              currency: currency,
              metadata: {
                is_shipping: 'true',
                is_airport_surcharge: 'true',
                box_id: item.box.id.toString(),
                theme: item.box.theme,
              },
            });
            firstInvoiceExtras.push({
              price: surchargePrice.id,
              quantity: item.quantity,
            });
          }
        }

        logStep("Added recurring shipping line right after subscription item", {
          boxId: item.box.id,
          unitAmount: recurringShippingCents,
          quantity: item.quantity,
          airportSurchargeApplied: isAirportMode,
        });
      }

      if (isMixedCart) {
        for (const item of oneTimeItems) {
          const key = `${item.box.id}-${normalizeTheme(item.box.theme)}`;
          const dbPrice = priceMap.get(key)!;
          const unitAmount = Math.round(dbPrice.unit * 100);

          const productData: any = {
            name: `${item.box.baseTitle} (Achat unique)`,
            description: item.box.description || `Box ${item.box.theme}`,
          };
          if (oneTimeImageUrl) {
            productData.images = [oneTimeImageUrl];
          }

          const oneTimeProduct = await stripe.products.create(productData);

          const oneTimePrice = await stripe.prices.create({
            product: oneTimeProduct.id,
            unit_amount: unitAmount,
            currency: currency,
            metadata: {
              box_id: item.box.id.toString(),
              theme: item.box.theme,
              is_one_time: 'true',
            },
          });

          allLineItems.push({
            price: oneTimePrice.id,
            quantity: item.quantity,
          });

          // Shipping line placed right after this one-time item
          const shippingProduct = await stripe.products.create({
            name: `${shippingLabel} — ${item.box.baseTitle}`,
            description: 'Frais de livraison par box',
          });

          const shippingPrice = await stripe.prices.create({
            product: shippingProduct.id,
            unit_amount: shippingCostBase,
            currency: currency,
            metadata: {
              is_shipping: 'true',
              is_one_time: 'true',
              box_id: item.box.id.toString(),
              theme: item.box.theme,
            },
          });

          allLineItems.push({
            price: shippingPrice.id,
            quantity: item.quantity,
          });

          logStep("Added one-time item with its shipping line", {
            boxId: item.box.id,
            unitAmount,
            shippingUnitAmount: shippingCostBase,
            quantity: item.quantity,
          });
        }
      }
      
      // Build session configuration - use pending_order_id instead of full items JSON
      const sessionConfig: any = {
        customer: customerId,
        mode: 'subscription',
        line_items: allLineItems,
        success_url: `${requestOrigin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${requestOrigin}/payment-canceled`,
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: allowedCountries,
        },
        custom_text: {
          submit: {
            message: "Payer / s'abonner",
          },
        },
        subscription_data: {
          metadata: {
            user_id: user!.id,
            pending_order_id: pendingOrderId,
          },
          ...(firstInvoiceExtras.length > 0 ? { add_invoice_items: firstInvoiceExtras } : {}),
        },
        payment_method_collection: 'always',
        metadata: {
          user_id: user!.id,
          pending_order_id: pendingOrderId,
          is_subscription: 'true',
          is_mixed_cart: isMixedCart ? 'true' : 'false',
          shipping_cost: (() => {
            const subQty = subscriptionItems.reduce((s: number, i: any) => s + i.quantity, 0);
            const otQty = isMixedCart ? oneTimeItems.reduce((s: number, i: any) => s + i.quantity, 0) : 0;
            return ((shippingCostBase / 100) * (subQty + otQty)).toString();
          })(),
        },
      };
      
      const session = await stripe.checkout.sessions.create(sessionConfig);
      
      logStep("Subscription checkout session created", { 
        sessionId: session.id, 
        url: session.url?.substring(0, 50) + "...",
        isMixedCart,
        pendingOrderId,
      });

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // ONE-TIME PAYMENT FLOW
    logStep("Processing one-time payment order");
    
    // Interleave each product with its own shipping line so Stripe checkout
    // displays the shipping row directly under the product it concerns.
    const lineItems: any[] = [];
    const totalOneTimeQuantity = items.reduce((sum: number, item: any) => sum + item.quantity, 0);

    for (const item of items) {
      const key = `${item.box.id}-${normalizeTheme(item.box.theme)}`;
      const dbPrice = priceMap.get(key)!;
      const unitAmount = Math.round(dbPrice.unit * 100);

      logStep("Processing item with validated price", {
        title: item.box.baseTitle,
        validatedPrice: dbPrice.unit,
        quantity: item.quantity,
        unitAmount,
      });

      const productData: any = {
        name: item.box.baseTitle,
        description: item.box.description || `Box ${item.box.theme}`,
      };
      if (oneTimeImageUrl) {
        productData.images = [oneTimeImageUrl];
      }

      lineItems.push({
        price_data: {
          currency: currency,
          product_data: productData,
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      });

      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${shippingLabel} — ${item.box.baseTitle}`,
            description: 'Frais de livraison par box',
          },
          unit_amount: shippingCostBase,
        },
        quantity: item.quantity,
      });
    }

    logStep("Line items created with per-item shipping", { count: lineItems.length });

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
        submit: {
          message: "Payer / s'abonner",
        },
      },
      metadata: {
        user_id: user?.id || 'guest',
        pending_order_id: pendingOrderId,
        shipping_cost: ((shippingCostBase / 100) * totalOneTimeQuantity).toString(),
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
      url: session.url?.substring(0, 50) + "...",
      pendingOrderId,
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
