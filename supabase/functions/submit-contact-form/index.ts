import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { name, email, subject, message } = await req.json() as ContactFormData;

    // Validate input lengths (defense in depth)
    if (!name || name.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Nom invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!email || email.length > 255 || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Email invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!subject || subject.length > 200) {
      return new Response(
        JSON.stringify({ error: 'Sujet invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!message || message.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Message invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get client info for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    // Check rate limit (max 5 submissions per hour per IP)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { data: rateLimit } = await supabase
      .from('contact_rate_limits')
      .select('*')
      .eq('identifier', clientIP)
      .single();

    if (rateLimit) {
      const windowStart = new Date(rateLimit.window_start);
      const now = new Date();
      const hoursSinceWindowStart = (now.getTime() - windowStart.getTime()) / (1000 * 60 * 60);

      if (hoursSinceWindowStart < 1 && rateLimit.submission_count >= 5) {
        console.log(`Rate limit exceeded for ${clientIP}`);
        return new Response(
          JSON.stringify({ error: 'Trop de soumissions. Veuillez réessayer plus tard.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Reset window if more than 1 hour has passed
      if (hoursSinceWindowStart >= 1) {
        await supabase
          .from('contact_rate_limits')
          .update({
            submission_count: 1,
            window_start: now.toISOString(),
            last_submission: now.toISOString()
          })
          .eq('identifier', clientIP);
      } else {
        await supabase
          .from('contact_rate_limits')
          .update({
            submission_count: rateLimit.submission_count + 1,
            last_submission: now.toISOString()
          })
          .eq('identifier', clientIP);
      }
    } else {
      // Create new rate limit entry
      await supabase
        .from('contact_rate_limits')
        .insert({
          identifier: clientIP,
          submission_count: 1
        });
    }

    // Insert contact submission
    const { error: insertError } = await supabase
      .from('contact_submissions')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        ip_address: clientIP,
        user_agent: userAgent
      });

    if (insertError) {
      console.error('Error inserting contact submission:', insertError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de l\'envoi du message' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Contact form submitted successfully from ${email}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Message envoyé avec succès' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in submit-contact-form function:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});