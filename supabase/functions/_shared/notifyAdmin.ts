// Helper partagé : envoie un email de notification interne à contact@kiltirbox.com
export const ADMIN_EMAIL = 'contact@kiltirbox.com';

export async function notifyAdmin(params: {
  event: string;
  title: string;
  details?: Record<string, unknown>;
}) {
  const lovableKey = Deno.env.get('LOVABLE_API_KEY');
  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (!lovableKey || !resendKey) {
    console.log('[notifyAdmin] skipped: missing API keys');
    return { ok: false, reason: 'missing_keys' };
  }

  const brandBlue = '#35a1de';
  const brandBrownDark = '#5C2E0C';
  const borderSoft = '#EADFCF';
  const rows = Object.entries(params.details ?? {})
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid ${borderSoft};color:${brandBrownDark};font-weight:600;font-size:14px;white-space:nowrap;">${k}</td>
        <td style="padding:10px 12px;border-bottom:1px solid ${borderSoft};color:#2C1810;font-size:14px;">${String(v)}</td>
      </tr>`)
    .join('');

  const html = `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAF6EE;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${borderSoft};">
      <div style="background:${brandBlue};color:#ffffff;padding:20px 24px;">
        <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:.9;">Notification KiltirBox</div>
        <div style="font-size:20px;font-weight:700;margin-top:4px;">${params.title}</div>
      </div>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
      <div style="padding:16px 24px;color:#6B5D54;font-size:12px;">Événement : ${params.event} — ${new Date().toLocaleString('fr-FR', { timeZone: 'Indian/Reunion' })} (heure Réunion)</div>
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
        to: [ADMIN_EMAIL],
        subject: `[KiltirBox] ${params.title}`,
        html,
      }),
    });
    if (!response.ok) {
      console.error('[notifyAdmin] failed', response.status, await response.text());
      return { ok: false, reason: 'send_failed' };
    }
    return { ok: true };
  } catch (err) {
    console.error('[notifyAdmin] exception', err);
    return { ok: false, reason: 'exception' };
  }
}
