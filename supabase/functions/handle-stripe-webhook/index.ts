import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

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
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
};

const logStep = (step: string, details?: any) => {
  console.log(`[STRIPE WEBHOOK] ${step}`, details ? JSON.stringify(details, null, 2) : '');
};

// Convert ISO country codes to readable names
const countryCodeToName: Record<string, string> = {
  'FR': 'France',
  'RE': 'La Réunion',
  'GP': 'Guadeloupe',
  'MQ': 'Martinique',
  'GF': 'Guyane française',
  'YT': 'Mayotte',
  'PM': 'Saint-Pierre-et-Miquelon',
  'WF': 'Wallis-et-Futuna',
  'PF': 'Polynésie française',
  'NC': 'Nouvelle-Calédonie',
  'BL': 'Saint-Barthélemy',
  'MF': 'Saint-Martin',
  'BE': 'Belgique',
  'CH': 'Suisse',
  'LU': 'Luxembourg',
  'MC': 'Monaco',
  'DE': 'Allemagne',
  'ES': 'Espagne',
  'IT': 'Italie',
  'GB': 'Royaume-Uni',
  'US': 'États-Unis',
};

const resolveCountryName = (code: string | null | undefined, fallback = 'France'): string => {
  if (!code) return fallback;
  const upper = code.toUpperCase().trim();
  return countryCodeToName[upper] || upper;
};

// Send order confirmation email via Resend gateway (to customer + BCC contact@kiltirbox.com)
async function sendOrderConfirmationEmail(params: {
  customerEmail: string;
  customerName: string | null;
  orderNumber: string;
  items: Array<{ title: string; quantity: number; unitPrice: number; subscriptionLabel?: string }>;
  totalAmount: number;
  shippingCost: number;
  shippingAddress: {
    name?: string | null;
    street?: string | null;
    city?: string | null;
    postal_code?: string | null;
    country?: string | null;
  };
  travelInfo?: any;
  deliveryPreference?: string;
}) {
  const lovableKey = Deno.env.get('LOVABLE_API_KEY');
  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (!lovableKey || !resendKey) {
    logStep('Email skipped: missing API keys');
    return;
  }

  const brand = '#8B4513';
  const fmtEur = (n: number) => `${n.toFixed(2).replace('.', ',')} €`;

  const itemsRows = params.items.map((it) => `
    <tr>
      <td style="padding:12px 8px;border-bottom:1px solid #eee;">
        <strong>${it.title}</strong>${it.subscriptionLabel ? `<br/><span style="color:#666;font-size:13px;">${it.subscriptionLabel}</span>` : ''}
      </td>
      <td style="padding:12px 8px;border-bottom:1px solid #eee;text-align:center;">${it.quantity}</td>
      <td style="padding:12px 8px;border-bottom:1px solid #eee;text-align:right;">${fmtEur(it.unitPrice * it.quantity)}</td>
    </tr>
  `).join('');

  const addr = params.shippingAddress;
  const addressBlock = `
    ${addr.name ? `${addr.name}<br/>` : ''}
    ${addr.street || ''}<br/>
    ${addr.postal_code || ''} ${addr.city || ''}<br/>
    ${addr.country || ''}
  `;

  let travelBlock = '';
  if (params.travelInfo && (params.travelInfo.arrival_date_reunion || params.travelInfo.departure_date_reunion)) {
    travelBlock = `
      <div style="margin-top:20px;padding:16px;background:#fff8f0;border-left:4px solid ${brand};border-radius:4px;">
        <h3 style="margin:0 0 8px;color:${brand};font-size:16px;">✈️ Informations voyage</h3>
        ${params.travelInfo.arrival_date_reunion ? `<p style="margin:4px 0;">Arrivée à La Réunion : <strong>${params.travelInfo.arrival_date_reunion}</strong>${params.travelInfo.arrival_time_reunion ? ` à ${params.travelInfo.arrival_time_reunion}` : ''}</p>` : ''}
        ${params.travelInfo.departure_date_reunion ? `<p style="margin:4px 0;">Départ de La Réunion : <strong>${params.travelInfo.departure_date_reunion}</strong>${params.travelInfo.departure_time_reunion ? ` à ${params.travelInfo.departure_time_reunion}` : ''}</p>` : ''}
      </div>
    `;
  }

  const subtotal = params.totalAmount - (params.shippingCost || 0);

  const html = `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;color:#333;">
  <div style="max-width:600px;margin:0 auto;background:#fff;">
    <div style="background:${brand};padding:32px 24px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:26px;">Kiltirbox</h1>
      <p style="color:#fff;margin:8px 0 0;opacity:0.9;">Merci pour votre commande !</p>
    </div>
    <div style="padding:32px 24px;">
      <p style="font-size:16px;">Bonjour ${params.customerName || ''},</p>
      <p style="font-size:15px;line-height:1.6;">
        Nous avons bien reçu votre commande <strong>${params.orderNumber}</strong> et vous en remercions chaleureusement 🌺.
        Toute l'équipe Kiltirbox met un point d'honneur à vous faire découvrir les meilleurs produits de La Réunion.
      </p>

      <h2 style="color:${brand};font-size:18px;margin-top:28px;border-bottom:2px solid ${brand};padding-bottom:8px;">Récapitulatif</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:12px;">
        <thead>
          <tr style="background:#faf6f2;">
            <th style="padding:10px 8px;text-align:left;font-size:13px;color:#666;">Produit</th>
            <th style="padding:10px 8px;text-align:center;font-size:13px;color:#666;">Qté</th>
            <th style="padding:10px 8px;text-align:right;font-size:13px;color:#666;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsRows}</tbody>
      </table>

      <table style="width:100%;margin-top:16px;">
        <tr><td style="padding:4px 8px;color:#666;">Sous-total</td><td style="padding:4px 8px;text-align:right;">${fmtEur(subtotal)}</td></tr>
        <tr><td style="padding:4px 8px;color:#666;">Frais de livraison</td><td style="padding:4px 8px;text-align:right;">${params.shippingCost > 0 ? fmtEur(params.shippingCost) : 'Offerts'}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;font-size:16px;border-top:2px solid ${brand};">Total payé</td><td style="padding:8px;text-align:right;font-weight:bold;font-size:16px;color:${brand};border-top:2px solid ${brand};">${fmtEur(params.totalAmount)}</td></tr>
      </table>

      <h2 style="color:${brand};font-size:18px;margin-top:28px;border-bottom:2px solid ${brand};padding-bottom:8px;">Livraison</h2>
      <p style="line-height:1.6;">${addressBlock}</p>
      ${travelBlock}

      <div style="margin-top:32px;padding:20px;background:#faf6f2;border-radius:6px;text-align:center;">
        <p style="margin:0;font-style:italic;color:#555;">
          Mèrsi ! 🌴<br/>
          Une question ? Écrivez-nous à <a href="mailto:contact@kiltirbox.com" style="color:${brand};">contact@kiltirbox.com</a>
        </p>
      </div>
    </div>
    <div style="background:#2a2a2a;color:#aaa;text-align:center;padding:16px;font-size:12px;">
      © ${new Date().getFullYear()} Kiltirbox — Un morceau de La Réunion chez vous
    </div>
  </div>
</body></html>`;

  try {
    const response = await fetch('https://connector-gateway.lovable.dev/resend/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${lovableKey}`,
        'X-Connection-Api-Key': resendKey,
      },
      body: JSON.stringify({
        from: 'Kiltirbox <contact@kiltirbox.com>',
        to: [params.customerEmail],
        bcc: ['contact@kiltirbox.com'],
        subject: `Confirmation de votre commande ${params.orderNumber} - Kiltirbox`,
        html,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logStep('Resend email failed', { status: response.status, body: errorBody });
      return;
    }
    logStep('Order confirmation email sent', { to: params.customerEmail, orderNumber: params.orderNumber });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logStep('Resend email exception', { error: msg });
  }
}

// Helper: fetch items from pending_orders table
async function fetchPendingOrderItems(pendingOrderId: string, supabase: any): Promise<any[] | null> {
  const { data, error } = await supabase
    .from('pending_orders')
    .select('items, travel_info')
    .eq('id', pendingOrderId)
    .single();

  if (error || !data) {
    logStep('Failed to fetch pending order', { pendingOrderId, error: error?.message });
    return null;
  }

  logStep('Fetched pending order', { pendingOrderId, itemCount: data.items?.length });
  return data;
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        logStep('Processing completed checkout session', { sessionId: session.id, mode: session.mode });

        if (session.mode === 'subscription') {
          await handleSubscriptionCreated(session, stripe, supabase);
        } else {
          await handleOneTimePayment(session, supabase);
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;
        logStep('Invoice paid', { invoiceId: invoice.id, subscriptionId: invoice.subscription });
        
        if (invoice.subscription) {
          await handleInvoicePaid(invoice, stripe, supabase);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        logStep('Invoice payment failed', { invoiceId: invoice.id, subscriptionId: invoice.subscription });
        
        if (invoice.subscription) {
          await handlePaymentFailed(invoice, supabase);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        logStep('Subscription updated', { subscriptionId: subscription.id, status: subscription.status });
        await updateSubscriptionStatus(subscription, supabase);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        logStep('Subscription deleted/completed', { subscriptionId: subscription.id });
        await handleSubscriptionEnded(subscription, supabase);
        break;
      }

      default:
        logStep('Event acknowledged', { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const msg = (error instanceof Error) ? error.message : String(error);
    logStep('Webhook handler error', { error: msg });
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...getCorsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
    });
  }
});

// Handle new subscription creation
async function handleSubscriptionCreated(session: any, stripe: any, supabase: any) {
  const userId = session.metadata?.user_id;
  const pendingOrderId = session.metadata?.pending_order_id;
  const subscriptionId = session.subscription;
  
  if (!userId || !pendingOrderId || !subscriptionId) {
    logStep('Missing required metadata for subscription', { userId, pendingOrderId, subscriptionId });
    return;
  }

  // Fetch items from pending_orders
  const pendingData = await fetchPendingOrderItems(pendingOrderId, supabase);
  if (!pendingData || !pendingData.items) {
    logStep('No items found in pending order', { pendingOrderId });
    return;
  }

  const allItems = pendingData.items;
  const travelInfo = pendingData.travel_info;
  const subscriptionItems = allItems.filter((item: any) => item.subscriptionType);
  const oneTimeItems = allItems.filter((item: any) => !item.subscriptionType);
  const isMixedCart = subscriptionItems.length > 0 && oneTimeItems.length > 0;

  logStep('Processing subscription items from pending_orders', { 
    totalItems: allItems.length,
    subscriptionCount: subscriptionItems.length,
    oneTimeCount: oneTimeItems.length,
    isMixedCart
  });

  // Get Stripe subscription details
  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  for (const item of subscriptionItems) {
    const durationMonths = item.durationMonths || (item.subscriptionType === '1year' ? 12 : 6);
    
    const { data: subData, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: session.customer,
        box_id: item.id || item.boxId,
        theme: item.theme || item.title?.replace('Box ', ''),
        status: 'active',
        duration_months: durationMonths,
        monthly_price: item.price,
        total_paid_months: 1,
        current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
        shipping_address_street: session.shipping_details?.address?.line1 || null,
        shipping_address_city: session.shipping_details?.address?.city || null,
        shipping_address_postal_code: session.shipping_details?.address?.postal_code || null,
        shipping_address_country: resolveCountryName(session.shipping_details?.address?.country),
        delivery_preference: travelInfo?.delivery_preference || 'metropole',
      })
      .select()
      .single();

    if (subError) {
      logStep('Failed to create subscription record', { error: subError.message });
      continue;
    }

    logStep('Subscription record created', { subscriptionId: subData.id, boxId: item.id, durationMonths });
    await decrementStock(item.theme || item.title?.replace('Box ', ''), 1, supabase);
  }

  // Create initial order for the first month
  const orderNumber = `ABO-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const deliveryPreference = travelInfo?.delivery_preference || 'metropole';
  
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      order_number: orderNumber,
      total_amount: session.amount_total / 100,
      shipping_cost: parseFloat(session.metadata?.shipping_cost || '0'),
      nom_prenom: session.customer_details?.name || null,
      destinataire: session.shipping_details?.name || null,
      status: 'confirmee',
      delivery_preference: deliveryPreference,
      shipping_address_street: session.shipping_details?.address?.line1 || null,
      shipping_address_city: session.shipping_details?.address?.city || null,
      shipping_address_postal_code: session.shipping_details?.address?.postal_code || null,
      shipping_address_country: resolveCountryName(session.shipping_details?.address?.country),
      billing_address_street: session.customer_details?.address?.line1 || null,
      billing_address_city: session.customer_details?.address?.city || null,
      billing_address_postal_code: session.customer_details?.address?.postal_code || null,
      billing_address_country: resolveCountryName(session.customer_details?.address?.country),
    })
    .select()
    .single();

  if (orderError) {
    logStep('Failed to create initial order', { error: orderError.message });
    return;
  }

  // Create order items for ALL items (subscriptions + one-time)
  const orderItemsToInsert: any[] = [];

  for (const item of subscriptionItems) {
    orderItemsToInsert.push({
      order_id: orderData.id,
      box_type: `${item.title} - Abonnement (Mois 1/${item.durationMonths || 6})`,
      quantity: item.quantity || 1,
      unit_price: item.price,
    });
  }

  for (const item of oneTimeItems) {
    orderItemsToInsert.push({
      order_id: orderData.id,
      box_type: item.title || `Box ${item.theme}`,
      quantity: item.quantity || 1,
      unit_price: item.price,
    });
  }

  if (orderItemsToInsert.length > 0) {
    const { error: insertError } = await supabase.from('order_items').insert(orderItemsToInsert);
    if (insertError) {
      logStep('Failed to insert order items', { error: insertError.message });
    } else {
      logStep('Order items created', { count: orderItemsToInsert.length });
    }
  }

  logStep('Initial subscription order created', { orderId: orderData.id, orderNumber, itemCount: orderItemsToInsert.length });

  // Decrement stock for one-time items
  for (const item of oneTimeItems) {
    const theme = item.theme || '';
    if (theme) {
      await decrementStock(theme, item.quantity || 1, supabase);
    }
  }

  // Clean up pending order
  await supabase.from('pending_orders').delete().eq('id', pendingOrderId);
  logStep('Pending order cleaned up', { pendingOrderId });
}

// Handle monthly invoice paid
async function handleInvoicePaid(invoice: any, stripe: any, supabase: any) {
  const subscriptionId = invoice.subscription;
  
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (error || !subscription) {
    logStep('Subscription not found for invoice', { subscriptionId });
    return;
  }

  const newPaidMonths = subscription.total_paid_months + 1;
  
  await supabase
    .from('subscriptions')
    .update({
      total_paid_months: newPaidMonths,
      current_period_start: new Date(invoice.period_start * 1000).toISOString(),
      current_period_end: new Date(invoice.period_end * 1000).toISOString(),
    })
    .eq('id', subscription.id);

  logStep('Subscription payment recorded', { 
    subscriptionId: subscription.id, 
    month: newPaidMonths, 
    of: subscription.duration_months 
  });

  // Create monthly order
  const orderNumber = `ABO-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: subscription.user_id,
      order_number: orderNumber,
      total_amount: invoice.amount_paid / 100,
      nom_prenom: invoice.customer_name || null,
      destinataire: null,
      status: 'confirmee',
      delivery_preference: subscription.delivery_preference,
      shipping_address_street: subscription.shipping_address_street,
      shipping_address_city: subscription.shipping_address_city,
      shipping_address_postal_code: subscription.shipping_address_postal_code,
      shipping_address_country: subscription.shipping_address_country,
    })
    .select()
    .single();

  if (!orderError && orderData) {
    await supabase.from('order_items').insert({
      order_id: orderData.id,
      box_type: `Box ${subscription.theme} - Abonnement (Mois ${newPaidMonths}/${subscription.duration_months})`,
      quantity: 1,
      unit_price: subscription.monthly_price,
    });

    logStep('Monthly order created', { orderId: orderData.id, month: newPaidMonths });
  }

  await decrementStock(subscription.theme, 1, supabase);

  if (newPaidMonths >= subscription.duration_months) {
    logStep('Subscription engagement completed, canceling', { subscriptionId });
    
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    
    await supabase
      .from('subscriptions')
      .update({ status: 'completed' })
      .eq('id', subscription.id);
  }
}

// Handle payment failure
async function handlePaymentFailed(invoice: any, supabase: any) {
  const subscriptionId = invoice.subscription;
  
  await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId);

  logStep('Subscription marked as past_due', { subscriptionId });
}

// Update subscription status
async function updateSubscriptionStatus(stripeSubscription: any, supabase: any) {
  const status = stripeSubscription.status === 'active' ? 'active' : 
                 stripeSubscription.status === 'past_due' ? 'past_due' :
                 stripeSubscription.status === 'canceled' ? 'canceled' : 'active';

  await supabase
    .from('subscriptions')
    .update({
      status,
      current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
    })
    .eq('stripe_subscription_id', stripeSubscription.id);

  logStep('Subscription status updated', { subscriptionId: stripeSubscription.id, status });
}

// Handle subscription ended
async function handleSubscriptionEnded(stripeSubscription: any, supabase: any) {
  await supabase
    .from('subscriptions')
    .update({
      status: 'completed',
      canceled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', stripeSubscription.id);

  logStep('Subscription marked as completed', { subscriptionId: stripeSubscription.id });
}

// Handle one-time payment
async function handleOneTimePayment(session: any, supabase: any) {
  const userId = session.metadata?.user_id;
  const pendingOrderId = session.metadata?.pending_order_id;

  if (!userId || !pendingOrderId) {
    logStep('Missing required metadata', { userId, pendingOrderId });
    return;
  }

  // Fetch items from pending_orders
  const pendingData = await fetchPendingOrderItems(pendingOrderId, supabase);
  if (!pendingData || !pendingData.items) {
    logStep('No items found in pending order', { pendingOrderId });
    return;
  }

  const items = pendingData.items;
  const travelInfo = pendingData.travel_info;

  logStep('Processing one-time items from pending_orders', { itemCount: items.length });

  const orderNumber = `CMD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const totalAmount = session.amount_total / 100;
  const deliveryPreference = travelInfo?.delivery_preference || 'ship_to_metropole';

  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      order_number: orderNumber,
      total_amount: totalAmount,
      shipping_cost: parseFloat(session.metadata?.shipping_cost || '0'),
      nom_prenom: session.customer_details?.name || null,
      destinataire: session.shipping_details?.name || null,
      status: 'confirmee',
      delivery_preference: deliveryPreference,
      arrival_date_reunion: travelInfo?.arrival_date_reunion || null,
      departure_date_reunion: travelInfo?.departure_date_reunion || null,
      arrival_time_reunion: travelInfo?.arrival_time_reunion || null,
      departure_time_reunion: travelInfo?.departure_time_reunion || null,
      shipping_address_street: session.shipping_details?.address?.line1 || null,
      shipping_address_city: session.shipping_details?.address?.city || null,
      shipping_address_postal_code: session.shipping_details?.address?.postal_code || null,
      shipping_address_country: resolveCountryName(session.shipping_details?.address?.country),
      billing_address_street: session.customer_details?.address?.line1 || null,
      billing_address_city: session.customer_details?.address?.city || null,
      billing_address_postal_code: session.customer_details?.address?.postal_code || null,
      billing_address_country: resolveCountryName(session.customer_details?.address?.country),
    })
    .select()
    .single();

  if (orderError) {
    logStep('Failed to create order', { error: orderError.message });
    return;
  }

  logStep('Order created successfully', { orderId: orderData.id });

  const orderItems = items
    .filter((item: any) => item && item.quantity && item.price)
    .map((item: any) => ({
      order_id: orderData.id,
      box_type: item.title || item.id?.toString() || 'Unknown',
      quantity: item.quantity,
      unit_price: item.price,
    }));

  if (orderItems.length > 0) {
    const { error: insertError } = await supabase.from('order_items').insert(orderItems);
    if (insertError) {
      logStep('Failed to insert order items', { error: insertError.message });
    } else {
      logStep('Order items created', { itemsCount: orderItems.length });
    }
  }

  // Decrement stock
  for (const item of items) {
    const boxTitle = item.title || '';
    let theme = '';
    
    if (boxTitle.includes('Découverte')) theme = 'Découverte';
    else if (boxTitle.includes('Bourbon')) theme = 'Bourbon';
    else if (boxTitle.includes('Racine')) theme = 'Racine';
    else if (boxTitle.includes('Saison')) theme = 'Saison';
    else if (item.theme) theme = item.theme;

    if (theme) {
      await decrementStock(theme, item.quantity || 1, supabase);
    }
  }

  // Clean up pending order
  await supabase.from('pending_orders').delete().eq('id', pendingOrderId);
  logStep('Pending order cleaned up', { pendingOrderId });
}

// Helper function to decrement stock
async function decrementStock(theme: string, quantity: number, supabase: any) {
  const { data: stockData, error: stockFetchError } = await supabase
    .from('box_stock')
    .select('available_stock, id')
    .eq('theme', theme)
    .single();

  if (stockFetchError) {
    logStep('Failed to fetch stock', { theme, error: stockFetchError.message });
    return;
  }

  const newStock = Math.max(0, stockData.available_stock - quantity);
  
  await supabase
    .from('box_stock')
    .update({ available_stock: newStock })
    .eq('id', stockData.id);

  logStep('Stock decremented', { theme, oldStock: stockData.available_stock, newStock, quantity });
}
