import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const data = await req.json() as SupplierApplicationData;
    console.log('Received supplier application submission');

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

    // Return validation errors if any
    if (validationErrors.length > 0) {
      console.log('Validation errors:', validationErrors);
      return new Response(
        JSON.stringify({ error: validationErrors.join(', ') }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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

    console.log(`Supplier application submitted successfully: ${applicationId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Candidature envoyée avec succès',
        applicationId 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in submit-supplier-application function:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
