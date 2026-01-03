import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Allowed origins for CORS
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
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
};

interface SupplierApplicationData {
  nom: string;
  raisonSociale: string;
  siret: string;
  adresse: string;
  codePostal: string;
  ville: string;
  email: string;
  telephone: string;
  activite: string;
  motivation: string;
  produits: string;
  source?: string;
  photoCount?: number; // Number of photos to upload (0-2)
}

// Request to confirm photo uploads were successful
interface ConfirmPhotoUploadData {
  applicationId: string;
  photoPaths: string[];
}

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// Allowed MIME types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const requestBody = await req.json();
    
    // Check if this is a photo confirmation request
    if (requestBody.applicationId && requestBody.photoPaths) {
      const confirmData = requestBody as ConfirmPhotoUploadData;
      console.log('Received photo upload confirmation for application:', confirmData.applicationId);
      
      // Validate applicationId exists
      const { data: application, error: appError } = await supabase
        .from('supplier_applications')
        .select('id')
        .eq('id', confirmData.applicationId)
        .single();
      
      if (appError || !application) {
        console.error('Invalid application ID for photo confirmation:', confirmData.applicationId);
        return new Response(
          JSON.stringify({ error: 'Candidature non trouvée' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Validate and insert photo records (max 2)
      const validPaths = confirmData.photoPaths
        .filter(path => typeof path === 'string' && path.startsWith(confirmData.applicationId + '/'))
        .slice(0, 2);
      
      for (const path of validPaths) {
        const { error: photoError } = await supabase
          .from('supplier_application_photos')
          .insert({
            application_id: confirmData.applicationId,
            photo_url: path,
          });
        
        if (photoError) {
          console.error('Error inserting photo record:', photoError);
        }
      }
      
      console.log(`Photo records inserted: ${validPaths.length} for application ${confirmData.applicationId}`);
      
      return new Response(
        JSON.stringify({ success: true, photosRegistered: validPaths.length }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Otherwise, handle as new supplier application
    const data = requestBody as SupplierApplicationData;
    console.log('Received supplier application submission');

    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('cf-connecting-ip') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Rate limiting: max 3 applications per hour per IP
    const now = new Date();
    const { data: rateLimit } = await supabase
      .from('contact_rate_limits')
      .select('*')
      .eq('identifier', `supplier:${clientIP}`)
      .single();

    if (rateLimit) {
      const windowStart = new Date(rateLimit.window_start);
      const hoursSinceWindowStart = (now.getTime() - windowStart.getTime()) / (1000 * 60 * 60);

      if (hoursSinceWindowStart < 1 && rateLimit.submission_count >= 3) {
        console.log(`Rate limit exceeded for supplier application`);
        return new Response(
          JSON.stringify({ error: 'Trop de candidatures envoyées. Veuillez réessayer plus tard.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Server-side validation
    const validationErrors: string[] = [];

    // Validate nom (1-100 chars)
    if (!data.nom || typeof data.nom !== 'string') {
      validationErrors.push('Le nom est requis');
    } else if (data.nom.trim().length === 0 || data.nom.trim().length > 100) {
      validationErrors.push('Le nom doit contenir entre 1 et 100 caractères');
    }

    // Validate raisonSociale (1-200 chars)
    if (!data.raisonSociale || typeof data.raisonSociale !== 'string') {
      validationErrors.push('La raison sociale est requise');
    } else if (data.raisonSociale.trim().length === 0 || data.raisonSociale.trim().length > 200) {
      validationErrors.push('La raison sociale doit contenir entre 1 et 200 caractères');
    }

    // Validate siret (exactly 14 digits)
    if (!data.siret || typeof data.siret !== 'string') {
      validationErrors.push('Le SIRET est requis');
    } else if (!/^\d{14}$/.test(data.siret.trim())) {
      validationErrors.push('Le SIRET doit contenir exactement 14 chiffres');
    }

    // Validate adresse (1-300 chars)
    if (!data.adresse || typeof data.adresse !== 'string') {
      validationErrors.push('L\'adresse est requise');
    } else if (data.adresse.trim().length === 0 || data.adresse.trim().length > 300) {
      validationErrors.push('L\'adresse doit contenir entre 1 et 300 caractères');
    }

    // Validate codePostal (1-10 chars)
    if (!data.codePostal || typeof data.codePostal !== 'string') {
      validationErrors.push('Le code postal est requis');
    } else if (data.codePostal.trim().length === 0 || data.codePostal.trim().length > 10) {
      validationErrors.push('Le code postal doit contenir entre 1 et 10 caractères');
    }

    // Validate ville (1-100 chars)
    if (!data.ville || typeof data.ville !== 'string') {
      validationErrors.push('La ville est requise');
    } else if (data.ville.trim().length === 0 || data.ville.trim().length > 100) {
      validationErrors.push('La ville doit contenir entre 1 et 100 caractères');
    }

    // Validate email (valid format, max 255 chars)
    if (!data.email || typeof data.email !== 'string') {
      validationErrors.push('L\'email est requis');
    } else {
      const emailTrimmed = data.email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailTrimmed.length === 0 || emailTrimmed.length > 255) {
        validationErrors.push('L\'email doit contenir entre 1 et 255 caractères');
      } else if (!emailRegex.test(emailTrimmed)) {
        validationErrors.push('L\'email n\'est pas valide');
      }
    }

    // Validate telephone (1-20 chars)
    if (!data.telephone || typeof data.telephone !== 'string') {
      validationErrors.push('Le téléphone est requis');
    } else if (data.telephone.trim().length === 0 || data.telephone.trim().length > 20) {
      validationErrors.push('Le téléphone doit contenir entre 1 et 20 caractères');
    }

    // Validate activite (1-2000 chars)
    if (!data.activite || typeof data.activite !== 'string') {
      validationErrors.push('La description de l\'activité est requise');
    } else if (data.activite.trim().length === 0 || data.activite.trim().length > 2000) {
      validationErrors.push('La description de l\'activité doit contenir entre 1 et 2000 caractères');
    }

    // Validate motivation (1-2000 chars)
    if (!data.motivation || typeof data.motivation !== 'string') {
      validationErrors.push('La motivation est requise');
    } else if (data.motivation.trim().length === 0 || data.motivation.trim().length > 2000) {
      validationErrors.push('La motivation doit contenir entre 1 et 2000 caractères');
    }

    // Validate produits (1-2000 chars)
    if (!data.produits || typeof data.produits !== 'string') {
      validationErrors.push('La description des produits est requise');
    } else if (data.produits.trim().length === 0 || data.produits.trim().length > 2000) {
      validationErrors.push('La description des produits doit contenir entre 1 et 2000 caractères');
    }

    // Validate source (optional, max 200 chars)
    if (data.source && typeof data.source === 'string' && data.source.trim().length > 200) {
      validationErrors.push('La source ne peut pas dépasser 200 caractères');
    }

    // Validate photo count (0-2)
    const photoCount = data.photoCount || 0;
    if (photoCount < 0 || photoCount > 2) {
      validationErrors.push('Nombre de photos invalide (maximum 2)');
    }

    // Return validation errors if any
    if (validationErrors.length > 0) {
      console.log('Validation errors:', validationErrors);
      return new Response(
        JSON.stringify({ error: validationErrors.join(', ') }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update rate limit
    if (rateLimit) {
      const windowStart = new Date(rateLimit.window_start);
      const hoursSinceWindowStart = (now.getTime() - windowStart.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceWindowStart >= 1) {
        await supabase
          .from('contact_rate_limits')
          .update({
            submission_count: 1,
            window_start: now.toISOString(),
            last_submission: now.toISOString()
          })
          .eq('identifier', `supplier:${clientIP}`);
      } else {
        await supabase
          .from('contact_rate_limits')
          .update({
            submission_count: rateLimit.submission_count + 1,
            last_submission: now.toISOString()
          })
          .eq('identifier', `supplier:${clientIP}`);
      }
    } else {
      await supabase
        .from('contact_rate_limits')
        .insert({
          identifier: `supplier:${clientIP}`,
          submission_count: 1
        });
    }

    // Generate UUID for the application
    const applicationId = crypto.randomUUID();

    // Insert the application
    const { error: insertError } = await supabase
      .from('supplier_applications')
      .insert({
        id: applicationId,
        nom: data.nom.trim(),
        raison_sociale: data.raisonSociale.trim(),
        siret: data.siret.trim(),
        adresse: data.adresse.trim(),
        code_postal: data.codePostal.trim(),
        ville: data.ville.trim(),
        email: data.email.trim().toLowerCase(),
        telephone: data.telephone.trim(),
        activite: data.activite.trim(),
        motivation: data.motivation.trim(),
        produits: data.produits.trim(),
        source: data.source?.trim() || null,
      });

    if (insertError) {
      console.error('Error inserting supplier application:', insertError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de l\'envoi de la candidature' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate signed upload URLs for photos if requested
    const uploadUrls: { path: string; signedUrl: string }[] = [];
    
    if (photoCount > 0) {
      for (let i = 0; i < photoCount; i++) {
        const fileName = `${applicationId}/${crypto.randomUUID()}.jpg`;
        
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('supplier-photos')
          .createSignedUploadUrl(fileName);

        if (signedUrlError) {
          console.error('Error creating signed upload URL:', signedUrlError);
          continue;
        }

        if (signedUrlData) {
          uploadUrls.push({
            path: fileName,
            signedUrl: signedUrlData.signedUrl
          });
        }
      }
    }

    console.log(`Supplier application submitted successfully: ${applicationId}, upload URLs generated: ${uploadUrls.length}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Candidature envoyée avec succès',
        applicationId,
        uploadUrls
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in submit-supplier-application function:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500, headers: { ...getCorsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' } }
    );
  }
});
