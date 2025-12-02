import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

const logStep = (step: string, details?: any) => {
  console.log(`[STRIPE WEBHOOK] ${step}`, details ? JSON.stringify(details, null, 2) : '');
};

serve(async (req) => {
  logStep('Starting webhook handler', { method: req.method });

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSignature = req.headers.get('stripe-signature');
    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!stripeSecret || !webhookSecret) {
      logStep('Missing environment variables');
      return new Response(JSON.stringify({ error: 'Missing environment variables' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!stripeSignature) {
      logStep('Missing Stripe signature');
      return new Response(JSON.stringify({ error: 'Missing Stripe signature' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.text();
    
    // Verify webhook signature
    const stripe = (await import('https://esm.sh/stripe@12.18.0')).default(stripeSecret);
    
    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, stripeSignature, webhookSecret);
      logStep('Webhook signature verified', { type: event.type });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logStep('Webhook signature verification failed', { error: msg });
      return new Response(JSON.stringify({ error: 'Webhook signature verification failed' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      logStep('Processing completed checkout session', { sessionId: session.id });

      // Initialize Supabase client
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      // Extract metadata from the session
      const userId = session.metadata?.user_id;
      const itemsData = session.metadata?.items;
      const travelInfoData = session.metadata?.travel_info;

      if (!userId || !itemsData) {
        logStep('Missing required metadata', { userId, hasItems: !!itemsData });
        return new Response(JSON.stringify({ error: 'Missing required metadata' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let items;
      try {
        items = JSON.parse(itemsData);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        logStep('Failed to parse items metadata', { error: msg });
        return new Response(JSON.stringify({ error: 'Invalid items metadata' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Parse travel info if available
      let travelInfo = null;
      if (travelInfoData) {
        try {
          travelInfo = JSON.parse(travelInfoData);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          logStep('Failed to parse travel info metadata', { error: msg });
          // Don't fail the entire request for travel info parsing errors
        }
      }

      // Generate order number
      const orderNumber = `CMD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Calculate total amount from session
      const totalAmount = session.amount_total / 100; // Convert from cents

      logStep('Creating order', { userId, orderNumber, totalAmount, itemsCount: items.length, hasTravelInfo: !!travelInfo });

      // Determine delivery preference using travel info if provided
      let deliveryPreference = travelInfo?.delivery_preference || 'ship_to_metropole';

      logStep('Travel info processed', { 
        deliveryPreference,
        arrival_date_reunion: travelInfo?.arrival_date_reunion,
        departure_date_reunion: travelInfo?.departure_date_reunion,
        arrival_time_reunion: travelInfo?.arrival_time_reunion,
        departure_time_reunion: travelInfo?.departure_time_reunion
      });

      // Calculate pickup date and time based on delivery preference
      let pickupDate = null;
      let pickupTime = null;
      
      if (deliveryPreference === 'airport_pickup_arrival') {
        pickupDate = travelInfo?.arrival_date_reunion || null;
        pickupTime = travelInfo?.arrival_time_reunion || null;
      } else if (deliveryPreference === 'airport_pickup_departure') {
        pickupDate = travelInfo?.departure_date_reunion || null;
        pickupTime = travelInfo?.departure_time_reunion || null;
      }

      logStep('Pickup preferences calculated', {
        deliveryPreference,
        pickupDate,
        pickupTime,
      });

      // Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          order_number: orderNumber,
          total_amount: totalAmount,
          status: 'confirmee',
          delivery_preference: deliveryPreference,
          arrival_date_reunion: travelInfo?.arrival_date_reunion || null,
          departure_date_reunion: travelInfo?.departure_date_reunion || null,
          arrival_time_reunion: travelInfo?.arrival_time_reunion || null,
          departure_time_reunion: travelInfo?.departure_time_reunion || null,
          date_preference: pickupDate,
          time_preference: pickupTime,
          shipping_address_street: session.shipping_details?.address?.line1 || null,
          shipping_address_city: session.shipping_details?.address?.city || null,
          shipping_address_postal_code: session.shipping_details?.address?.postal_code || null,
          shipping_address_country: session.shipping_details?.address?.country || 'France',
          // Persist billing address separately
          billing_address_street: session.customer_details?.address?.line1 || null,
          billing_address_city: session.customer_details?.address?.city || null,
          billing_address_postal_code: session.customer_details?.address?.postal_code || null,
          billing_address_country: session.customer_details?.address?.country || 'France',
        })
        .select()
        .single();

      if (orderError) {
        logStep('Failed to create order', { error: orderError });
        return new Response(JSON.stringify({ error: 'Failed to create order' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      logStep('Order created successfully', { orderId: orderData.id });

      // Create order items from simplified metadata format
      const orderItems = items
        .filter((item: any) => {
          if (!item || !item.quantity || typeof item.quantity !== 'number' || !item.price || typeof item.price !== 'number') {
            logStep('Invalid item skipped', { item });
            return false;
          }
          return true;
        })
        .map((item: any) => {
          return {
            order_id: orderData.id,
            box_type: item.title || item.id?.toString() || 'Unknown',
            quantity: item.quantity,
            unit_price: item.price,
          };
        });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        logStep('Failed to create order items', { error: itemsError });
        return new Response(JSON.stringify({ error: 'Failed to create order items' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      logStep('Order items created successfully', { itemsCount: orderItems.length });

      // Decrement stock for each theme
      for (const item of items) {
        // Extract theme from box title (e.g., "Box Découverte" -> "Découverte")
        const boxTitle = item.title || '';
        let theme = '';
        
        if (boxTitle.includes('Découverte')) {
          theme = 'Découverte';
        } else if (boxTitle.includes('Bourbon')) {
          theme = 'Bourbon';
        } else if (boxTitle.includes('Racine')) {
          theme = 'Racine';
        } else if (boxTitle.includes('Saison')) {
          theme = 'Saison';
        }

        if (theme) {
          // Calculate quantity to decrement based on subscription type
          let stockToDecrement = item.quantity || 1;
          
          // For subscriptions, multiply by the number of months
          if (item.subscriptionType) {
            const subscriptionMonths = item.subscriptionType === '6months' ? 6 : 12;
            stockToDecrement = stockToDecrement * subscriptionMonths;
            logStep('Subscription detected', { 
              subscriptionType: item.subscriptionType, 
              months: subscriptionMonths,
              totalStockToDecrement: stockToDecrement 
            });
          }

          // Get current stock
          const { data: stockData, error: stockFetchError } = await supabase
            .from('box_stock')
            .select('available_stock, id')
            .eq('theme', theme)
            .single();

          if (stockFetchError) {
            logStep('Failed to fetch stock', { theme, error: stockFetchError });
            continue;
          }

          // Decrement stock by calculated quantity
          const newStock = Math.max(0, stockData.available_stock - stockToDecrement);
          
          const { error: stockUpdateError } = await supabase
            .from('box_stock')
            .update({ available_stock: newStock })
            .eq('id', stockData.id);

          if (stockUpdateError) {
            logStep('Failed to update stock', { theme, error: stockUpdateError });
          } else {
            logStep('Stock updated', { 
              theme, 
              oldStock: stockData.available_stock, 
              newStock, 
              decrementedBy: stockToDecrement,
              isSubscription: !!item.subscriptionType,
              subscriptionType: item.subscriptionType 
            });
          }
        }
      }

      return new Response(JSON.stringify({
        success: true, 
        orderId: orderData.id,
        orderNumber: orderData.order_number 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // For other event types, just acknowledge receipt
    logStep('Event acknowledged', { type: event.type });
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const msg = (error instanceof Error) ? error.message : String(error);
    logStep('Webhook handler error', { error: msg });
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});