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
  items: Array<{
    title: string;
    quantity: number;
    unitPrice: number;
    subscriptionLabel?: string;
    durationMonths?: number | null;
  }>;
  amountPaidNow: number;
  shippingUnitCost: number;
  shippingAddress: {
    name?: string | null;
    street?: string | null;
    city?: string | null;
    postal_code?: string | null;
    country?: string | null;
  };
  billingAddress: {
    name?: string | null;
    street?: string | null;
    city?: string | null;
    postal_code?: string | null;
    country?: string | null;
  };
  travelInfo?: any;
  deliveryPreference?: string;
  isRecurring?: boolean;
  paymentSectionTitle?: string;
  emailSubject?: string;
  headerSubtitle?: string;
  introText?: string;
}) {
  const lovableKey = Deno.env.get('LOVABLE_API_KEY');
  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (!lovableKey || !resendKey) {
    logStep('Email skipped: missing API keys');
    return;
  }

  // Palette harmonisée avec le site KiltirBox : bleu KiltirBox, brun terre, jaune doux, crème.
  const brandBlue = '#35a1de';        // bleu KiltirBox (en-tête)
  const brandBlueDark = '#1E7AA8';    // bleu foncé pour titres / bordures
  const brandBrown = '#8B4513';       // earth-brown (principal)
  const brandBrownDark = '#5C2E0C';   // pour titres
  const brandYellow = '#FFD700';      // accent doré
  const brandYellowSoft = '#FFF8DC';  // fond doux (cornsilk)
  const brandCream = '#FAF6EE';       // fond page
  const textPrimary = '#2C1810';
  const textMuted = '#6B5D54';
  const borderSoft = '#EADFCF';
  const headingFont = "Georgia, 'Times New Roman', serif";
  const bodyFont = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
  const fmtEur = (n: number) => `${n.toFixed(2).replace('.', ',')} €`;

  // Compute engagement totals (full contract) and shipping figures
  let itemsEngagement = 0;
  let subsShippingEngagement = 0;
  let oneTimeShippingEngagement = 0;
  for (const it of params.items) {
    itemsEngagement += it.unitPrice * it.quantity;
    const months = it.durationMonths && it.durationMonths > 0 ? it.durationMonths : 1;
    const shippingPart = params.shippingUnitCost * it.quantity * months;
    if (it.durationMonths && it.durationMonths > 0) subsShippingEngagement += shippingPart;
    else oneTimeShippingEngagement += shippingPart;
  }
  const totalEngagement = itemsEngagement + subsShippingEngagement + oneTimeShippingEngagement;

  const itemsRows = params.items.map((it) => `
    <tr>
      <td style="padding:14px 12px;border-bottom:1px solid ${borderSoft};color:${textPrimary};font-size:15px;">
        <strong style="color:${brandBrownDark};">${it.title}</strong>${it.subscriptionLabel ? `<br/><span style="color:${textMuted};font-size:13px;">${it.subscriptionLabel}</span>` : ''}
      </td>
      <td style="padding:14px 12px;border-bottom:1px solid ${borderSoft};text-align:center;color:${textPrimary};font-size:15px;">${it.quantity}</td>
      <td style="padding:14px 12px;border-bottom:1px solid ${borderSoft};text-align:right;color:${textPrimary};font-size:15px;">${fmtEur(it.unitPrice * it.quantity)}</td>
    </tr>
  `).join('');

  // First-month/one-time payment rows: same layout as engagement table.
  // For subscription items, unitPrice is already the monthly price.
  const firstPaymentItemsRows = params.items.map((it) => {
    const monthlyUnit = it.durationMonths && it.durationMonths > 0
      ? it.unitPrice / it.durationMonths
      : it.unitPrice;
    const label = it.durationMonths && it.durationMonths > 0
      ? `Mensualité 1/${it.durationMonths}`
      : (it.subscriptionLabel || 'Achat unique');
    return `
    <tr>
      <td style="padding:14px 12px;border-bottom:1px solid ${borderSoft};color:${textPrimary};font-size:15px;">
        <strong style="color:${brandBrownDark};">${it.title}</strong><br/><span style="color:${textMuted};font-size:13px;">${label}</span>
      </td>
      <td style="padding:14px 12px;border-bottom:1px solid ${borderSoft};text-align:center;color:${textPrimary};font-size:15px;">${it.quantity}</td>
      <td style="padding:14px 12px;border-bottom:1px solid ${borderSoft};text-align:right;color:${textPrimary};font-size:15px;">${fmtEur(monthlyUnit * it.quantity)}</td>
    </tr>`;
  }).join('');

  const firstPaymentItemsTotal = params.items.reduce((s, it) => {
    const monthlyUnit = it.durationMonths && it.durationMonths > 0
      ? it.unitPrice / it.durationMonths
      : it.unitPrice;
    return s + monthlyUnit * it.quantity;
  }, 0);
  const firstPaymentShipping = Math.max(0, params.amountPaidNow - firstPaymentItemsTotal);
  const totalShippingEngagement = subsShippingEngagement + oneTimeShippingEngagement;

  const renderAddress = (a: {
    name?: string | null;
    street?: string | null;
    city?: string | null;
    postal_code?: string | null;
    country?: string | null;
  }) => `
    <div style="color:${textPrimary};font-size:14px;line-height:1.7;">
      ${a.name ? `<strong style="color:${brandBrownDark};">${a.name}</strong><br/>` : ''}
      ${a.street || ''}<br/>
      ${a.postal_code || ''} ${a.city || ''}<br/>
      ${a.country || ''}
    </div>
  `;

  const normalizeAddr = (a: any) => [a?.name, a?.street, a?.city, a?.postal_code, a?.country]
    .map((v) => (v || '').toString().trim().toLowerCase())
    .join('|');
  const billingSameAsShipping =
    normalizeAddr({ ...params.billingAddress, name: params.shippingAddress?.name }) ===
    normalizeAddr(params.shippingAddress);

  let travelBlock = '';
  if (params.travelInfo && (params.travelInfo.arrival_date_reunion || params.travelInfo.departure_date_reunion)) {
    travelBlock = `
      <div style="margin-top:16px;padding:16px 18px;background:${brandYellowSoft};border-left:3px solid ${brandBrown};border-radius:4px;">
        <h3 style="margin:0 0 10px;color:${brandBrownDark};font-size:15px;font-family:${headingFont};font-weight:normal;letter-spacing:0.3px;">Informations voyage</h3>
        ${params.travelInfo.arrival_date_reunion ? `<p style="margin:4px 0;font-size:14px;color:${textPrimary};">Arrivée à La Réunion : <strong>${params.travelInfo.arrival_date_reunion}</strong>${params.travelInfo.arrival_time_reunion ? ` à ${params.travelInfo.arrival_time_reunion}` : ''}</p>` : ''}
        ${params.travelInfo.departure_date_reunion ? `<p style="margin:4px 0;font-size:14px;color:${textPrimary};">Départ de La Réunion : <strong>${params.travelInfo.departure_date_reunion}</strong>${params.travelInfo.departure_time_reunion ? ` à ${params.travelInfo.departure_time_reunion}` : ''}</p>` : ''}
      </div>
    `;
  }

  const hasSubscription = params.items.some((i) => i.durationMonths && i.durationMonths > 0);
  const firstPaymentTitle = params.paymentSectionTitle || (hasSubscription ? '1ère mensualité' : 'Paiement');
  const headerSubtitle = params.headerSubtitle || 'Merci pour votre commande';
  const introText = params.introText || `Nous avons bien reçu votre commande <strong style="color:${brandBrownDark};">${params.orderNumber}</strong> et vous en remercions chaleureusement.
        Toute l'équipe KiltirBox met un point d'honneur à vous faire découvrir les meilleurs produits de La Réunion.`;

  const logoUrl = 'https://kiltirbox.com/kiltirbox-logo.png';

  const sectionTitle = (label: string) => `
    <div style="margin:42px 0 18px;padding:16px 18px;background:linear-gradient(135deg, ${brandBlue} 0%, ${brandBlueDark} 100%);border-radius:8px;box-shadow:0 3px 12px rgba(53,161,222,0.22);">
      <h2 style="font-family:${headingFont};color:#FFFFFF;font-size:18px;font-weight:normal;margin:0;letter-spacing:0.5px;">${label}</h2>
    </div>
  `;

  const tableHead = `
    <thead>
      <tr>
        <th style="padding:12px;text-align:left;font-family:${headingFont};font-weight:normal;font-size:13px;color:${brandBrownDark};text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid ${brandBrown};">Produit</th>
        <th style="padding:12px;text-align:center;font-family:${headingFont};font-weight:normal;font-size:13px;color:${brandBrownDark};text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid ${brandBrown};">Qté</th>
        <th style="padding:12px;text-align:right;font-family:${headingFont};font-weight:normal;font-size:13px;color:${brandBrownDark};text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid ${brandBrown};">Total</th>
      </tr>
    </thead>
  `;

  const html = `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;font-family:${bodyFont};background:${brandCream};color:${textPrimary};">
  <div style="max-width:620px;margin:0 auto;background:#FFFFFF;border:1px solid ${borderSoft};">
    <!-- En-tête -->
    <div style="background:${brandBlue};padding:42px 24px 32px;text-align:center;border-bottom:1px solid ${brandBlueDark};">
      <img src="${logoUrl}" alt="Kiltirbox" style="width:160px;height:auto;display:block;margin:0 auto 18px;"/>
      <div style="width:40px;height:2px;background:${brandYellow};margin:12px auto;"></div>
      <p style="color:#FFFFFF;margin:10px 0 0;font-size:15px;letter-spacing:0.5px;">${headerSubtitle}</p>
    </div>

    <!-- Corps -->
    <div style="padding:36px 32px;">
      <p style="font-family:${headingFont};font-size:18px;color:${brandBrownDark};margin:0 0 12px;">Bonjour ${params.customerName || ''},</p>
      <p style="font-size:15px;line-height:1.7;color:${textPrimary};margin:0;">${introText}</p>

      ${sectionTitle('Récapitulatif de commande')}
      <table style="width:100%;border-collapse:collapse;">
        ${tableHead}
        <tbody>${itemsRows}</tbody>
      </table>
      <table style="width:100%;border-collapse:collapse;margin-top:8px;">
        <tr>
          <td style="padding:10px 12px;font-size:14px;color:${textMuted};">Frais de livraison</td>
          <td style="padding:10px 12px;text-align:right;font-size:14px;color:${textPrimary};">${fmtEur(totalShippingEngagement)}</td>
        </tr>
        <tr>
          <td style="padding:14px 12px;font-family:${headingFont};font-size:16px;color:${brandBrownDark};border-top:2px solid ${brandBrown};">Total engagement</td>
          <td style="padding:14px 12px;text-align:right;font-family:${headingFont};font-size:18px;color:${brandBrownDark};border-top:2px solid ${brandBrown};">${fmtEur(totalEngagement)}</td>
        </tr>
      </table>

      ${sectionTitle(firstPaymentTitle)}
      <table style="width:100%;border-collapse:collapse;">
        ${tableHead}
        <tbody>${firstPaymentItemsRows}</tbody>
      </table>
      <table style="width:100%;border-collapse:collapse;margin-top:8px;">
        <tr>
          <td style="padding:10px 12px;font-size:14px;color:${textMuted};">Frais de livraison</td>
          <td style="padding:10px 12px;text-align:right;font-size:14px;color:${textPrimary};">${fmtEur(firstPaymentShipping)}</td>
        </tr>
        <tr>
          <td style="padding:16px 12px;font-family:${headingFont};font-size:16px;color:${brandBrownDark};background:${brandYellowSoft};border-top:2px solid ${brandBrown};">Total payé</td>
          <td style="padding:16px 12px;text-align:right;font-family:${headingFont};font-size:20px;color:${brandBrownDark};background:${brandYellowSoft};border-top:2px solid ${brandBrown};">${fmtEur(params.amountPaidNow)}</td>
        </tr>
      </table>

      ${sectionTitle('Livraison')}
      ${renderAddress(params.shippingAddress)}
      ${travelBlock}

      ${sectionTitle('Facturation')}
      ${billingSameAsShipping
        ? `<p style="font-size:13px;color:${textMuted};font-style:italic;margin:0 0 10px;">Identique à l'adresse de livraison</p>${renderAddress(params.shippingAddress)}`
        : renderAddress(params.billingAddress)}

      <!-- Signature -->
      <div style="margin-top:40px;padding:24px;background:${brandYellowSoft};border:1px solid ${borderSoft};text-align:center;">
        <p style="font-family:${headingFont};font-size:20px;color:${brandBrownDark};margin:0 0 8px;letter-spacing:1px;">Mèrsi !</p>
        <div style="width:32px;height:1px;background:${brandBrown};margin:10px auto;"></div>
        <p style="margin:0;font-size:14px;color:${textPrimary};line-height:1.6;">
          Une question ? Écrivez-nous à<br/>
          <a href="mailto:contact@kiltirbox.com" style="color:${brandBrown};font-weight:600;text-decoration:none;border-bottom:1px solid ${brandYellow};">contact@kiltirbox.com</a>
        </p>
      </div>
    </div>

    <!-- Pied de page -->
    <div style="background:${brandBrownDark};color:${brandYellowSoft};text-align:center;padding:20px;font-size:12px;letter-spacing:0.5px;">
      © ${new Date().getFullYear()} KiltirBox — Un morceau de La Réunion chez vous
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
        subject: params.emailSubject || `Confirmation de votre commande ${params.orderNumber} - Kiltirbox`,
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

  // Send confirmation email
  const customerEmail = session.customer_details?.email || session.customer_email;
  if (customerEmail) {
    const emailItems = [
      ...subscriptionItems.map((it: any) => ({
        title: it.title || `Box ${it.theme}`,
        quantity: it.quantity || 1,
        unitPrice: it.price,
        durationMonths: it.durationMonths || (it.subscriptionType === '1year' || it.subscriptionType === '12_months' ? 12 : 6),
        subscriptionLabel: `Abonnement ${it.durationMonths || 6} mois`,
      })),
      ...oneTimeItems.map((it: any) => ({
        title: it.title || `Box ${it.theme}`,
        quantity: it.quantity || 1,
        unitPrice: it.price,
        durationMonths: null,
      })),
    ];
    const totalUnits = allItems.reduce((s: number, i: any) => s + (i.quantity || 1), 0);
    const shippingCostFirstMonth = parseFloat(session.metadata?.shipping_cost || '0');
    const shippingUnitCost = totalUnits > 0 ? shippingCostFirstMonth / totalUnits : 0;
    await sendOrderConfirmationEmail({
      customerEmail,
      customerName: session.customer_details?.name || null,
      orderNumber,
      items: emailItems,
      amountPaidNow: session.amount_total / 100,
      shippingUnitCost,
      shippingAddress: {
        name: session.shipping_details?.name,
        street: session.shipping_details?.address?.line1,
        city: session.shipping_details?.address?.city,
        postal_code: session.shipping_details?.address?.postal_code,
        country: resolveCountryName(session.shipping_details?.address?.country),
      },
      billingAddress: {
        name: session.customer_details?.name,
        street: session.customer_details?.address?.line1,
        city: session.customer_details?.address?.city,
        postal_code: session.customer_details?.address?.postal_code,
        country: resolveCountryName(session.customer_details?.address?.country),
      },
      travelInfo,
      deliveryPreference,
    });
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

  // Send confirmation email
  const customerEmail = session.customer_details?.email || session.customer_email;
  if (customerEmail) {
    const totalUnits = items.reduce((s: number, i: any) => s + (i.quantity || 1), 0);
    const shippingCostTotal = parseFloat(session.metadata?.shipping_cost || '0');
    const shippingUnitCost = totalUnits > 0 ? shippingCostTotal / totalUnits : 0;
    await sendOrderConfirmationEmail({
      customerEmail,
      customerName: session.customer_details?.name || null,
      orderNumber,
      items: items.map((it: any) => ({
        title: it.title || `Box ${it.theme || ''}`.trim(),
        quantity: it.quantity || 1,
        unitPrice: it.price,
        durationMonths: null,
      })),
      amountPaidNow: totalAmount,
      shippingUnitCost,
      shippingAddress: {
        name: session.shipping_details?.name,
        street: session.shipping_details?.address?.line1,
        city: session.shipping_details?.address?.city,
        postal_code: session.shipping_details?.address?.postal_code,
        country: resolveCountryName(session.shipping_details?.address?.country),
      },
      billingAddress: {
        name: session.customer_details?.name,
        street: session.customer_details?.address?.line1,
        city: session.customer_details?.address?.city,
        postal_code: session.customer_details?.address?.postal_code,
        country: resolveCountryName(session.customer_details?.address?.country),
      },
      travelInfo,
      deliveryPreference,
    });
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
