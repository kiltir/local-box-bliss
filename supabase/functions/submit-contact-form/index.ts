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

// Helper function to normalize email for rate limiting (lowercase, remove dots from gmail, etc.)
function normalizeEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const [localPart, domain] = trimmed.split('@');
  
  // For gmail, remove dots and anything after + sign
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    const cleanLocal = localPart.split('+')[0].replace(/\./g, '');
    return `${cleanLocal}@gmail.com`;
  }
  
  // For other domains, just remove anything after + sign
  const cleanLocal = localPart.split('+')[0];
  return `${cleanLocal}@${domain}`;
}

// Generate a fingerprint from multiple sources for better rate limiting
function generateFingerprint(req: Request, email: string): string {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             req.headers.get('cf-connecting-ip') || 
             req.headers.get('x-real-ip') || 
             'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const normalizedEmail = normalizeEmail(email);
  
  // Create a composite identifier
  return `${ip}:${normalizedEmail}`;
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

    // Get client info for rate limiting - use multiple sources
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('cf-connecting-ip') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const normalizedEmail = normalizeEmail(email);
    const fingerprint = generateFingerprint(req, email);
    
    console.log(`Contact form submission from IP: ${clientIP}, Email: ${normalizedEmail}`);
    
    // Check rate limits for BOTH IP and email separately
    // This prevents both IP spoofing and email aliasing attacks
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    // Check IP-based rate limit
    const { data: ipRateLimit } = await supabase
      .from('contact_rate_limits')
      .select('*')
      .eq('identifier', `ip:${clientIP}`)
      .single();

    if (ipRateLimit) {
      const windowStart = new Date(ipRateLimit.window_start);
      const hoursSinceWindowStart = (now.getTime() - windowStart.getTime()) / (1000 * 60 * 60);

      if (hoursSinceWindowStart < 1 && ipRateLimit.submission_count >= 5) {
        console.log(`IP rate limit exceeded for ${clientIP}`);
        return new Response(
          JSON.stringify({ error: 'Trop de soumissions. Veuillez réessayer plus tard.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Check email-based rate limit (more strict - 3 per hour)
    const { data: emailRateLimit } = await supabase
      .from('contact_rate_limits')
      .select('*')
      .eq('identifier', `email:${normalizedEmail}`)
      .single();

    if (emailRateLimit) {
      const windowStart = new Date(emailRateLimit.window_start);
      const hoursSinceWindowStart = (now.getTime() - windowStart.getTime()) / (1000 * 60 * 60);

      if (hoursSinceWindowStart < 1 && emailRateLimit.submission_count >= 3) {
        console.log(`Email rate limit exceeded for ${normalizedEmail}`);
        return new Response(
          JSON.stringify({ error: 'Trop de soumissions depuis cette adresse email. Veuillez réessayer plus tard.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Update or create IP rate limit
    if (ipRateLimit) {
      const windowStart = new Date(ipRateLimit.window_start);
      const hoursSinceWindowStart = (now.getTime() - windowStart.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceWindowStart >= 1) {
        await supabase
          .from('contact_rate_limits')
          .update({
            submission_count: 1,
            window_start: now.toISOString(),
            last_submission: now.toISOString()
          })
          .eq('identifier', `ip:${clientIP}`);
      } else {
        await supabase
          .from('contact_rate_limits')
          .update({
            submission_count: ipRateLimit.submission_count + 1,
            last_submission: now.toISOString()
          })
          .eq('identifier', `ip:${clientIP}`);
      }
    } else {
      await supabase
        .from('contact_rate_limits')
        .insert({
          identifier: `ip:${clientIP}`,
          submission_count: 1
        });
    }

    // Update or create email rate limit
    if (emailRateLimit) {
      const windowStart = new Date(emailRateLimit.window_start);
      const hoursSinceWindowStart = (now.getTime() - windowStart.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceWindowStart >= 1) {
        await supabase
          .from('contact_rate_limits')
          .update({
            submission_count: 1,
            window_start: now.toISOString(),
            last_submission: now.toISOString()
          })
          .eq('identifier', `email:${normalizedEmail}`);
      } else {
        await supabase
          .from('contact_rate_limits')
          .update({
            submission_count: emailRateLimit.submission_count + 1,
            last_submission: now.toISOString()
          })
          .eq('identifier', `email:${normalizedEmail}`);
      }
    } else {
      await supabase
        .from('contact_rate_limits')
        .insert({
          identifier: `email:${normalizedEmail}`,
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