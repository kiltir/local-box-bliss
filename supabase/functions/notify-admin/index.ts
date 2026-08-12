import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { notifyAdmin } from '../_shared/notifyAdmin.ts';

const ALLOWED_EVENTS = new Set([
  'account_created',
  'newsletter_subscription',
  'contact_form',
  'supplier_application',
  'other',
]);

const LABELS: Record<string, string> = {
  account_created: 'Nouvelle création de compte',
  newsletter_subscription: 'Nouvelle inscription à la newsletter',
  contact_form: 'Nouveau message de contact',
  supplier_application: 'Nouvelle candidature fournisseur',
  other: 'Nouvel événement',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => null);
    const event = typeof body?.event === 'string' ? body.event : '';
    if (!ALLOWED_EVENTS.has(event)) {
      return new Response(JSON.stringify({ error: 'Événement invalide' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sanitize details: max 20 keys, string values max 500 chars
    const details: Record<string, string> = {};
    const raw = body?.details && typeof body.details === 'object' ? body.details : {};
    for (const [k, v] of Object.entries(raw).slice(0, 20)) {
      if (v === null || v === undefined) continue;
      details[String(k).slice(0, 60)] = String(v).slice(0, 500).replace(/[<>]/g, '');
    }

    const title = typeof body?.title === 'string' && body.title.trim()
      ? body.title.trim().slice(0, 120).replace(/[<>]/g, '')
      : LABELS[event];

    const result = await notifyAdmin({ event, title, details });
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (_err) {
    return new Response(JSON.stringify({ error: 'Erreur inattendue' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
