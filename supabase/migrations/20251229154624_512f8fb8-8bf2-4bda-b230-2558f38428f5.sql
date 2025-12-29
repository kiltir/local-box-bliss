-- Remove the public upload policy from supplier-photos bucket
-- The edge function now generates signed upload URLs for controlled access

DROP POLICY IF EXISTS "Anyone can upload supplier photos" ON storage.objects;

-- Create a more restrictive upload policy that only allows uploads via signed URLs
-- (Signed URLs bypass RLS, so we don't need an explicit policy for uploads via signed URLs)
-- This policy is kept as a fallback for authenticated users only
CREATE POLICY "Authenticated users can upload supplier photos via signed URL" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'supplier-photos' AND 
  auth.role() = 'authenticated'
);