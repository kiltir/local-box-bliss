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
      logStep('Webhook signature verification failed', { error: err.message });
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
        logStep('Failed to parse items metadata', { error: err.message });
        return new Response(JSON.stringify({ error: 'Invalid items metadata' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Generate order number
      const orderNumber = `CMD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Calculate total amount from session
      const totalAmount = session.amount_total / 100; // Convert from cents

      logStep('Creating order', { userId, orderNumber, totalAmount, itemsCount: items.length });

      // Get travel info from session metadata
      const travelInfo = {
        delivery_preference: session.metadata?.delivery_preference || null,
        arrival_date_reunion: session.metadata?.arrival_date_reunion || null,
        departure_date_reunion: session.metadata?.departure_date_reunion || null,
        arrival_time_reunion: session.metadata?.arrival_time_reunion || null,
        departure_time_reunion: session.metadata?.departure_time_reunion || null,
      };

      logStep('Travel info from metadata', travelInfo);

      // Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          order_number: orderNumber,
          total_amount: totalAmount,
          status: 'confirmee',
          delivery_preference: travelInfo.delivery_preference,
          arrival_date_reunion: travelInfo.arrival_date_reunion,
          departure_date_reunion: travelInfo.departure_date_reunion,
          arrival_time_reunion: travelInfo.arrival_time_reunion,
          departure_time_reunion: travelInfo.departure_time_reunion,
          shipping_address_street: session.customer_details?.address?.line1 || null,
          shipping_address_city: session.customer_details?.address?.city || null,
          shipping_address_postal_code: session.customer_details?.address?.postal_code || null,
          shipping_address_country: session.customer_details?.address?.country || 'France',
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
    logStep('Webhook handler error', { error: error.message });
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});