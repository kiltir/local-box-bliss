-- Make supplier-photos bucket private
UPDATE storage.buckets SET public = false WHERE id = 'supplier-photos';

-- Update storage policies - remove public access, require admin authentication for viewing
DROP POLICY IF EXISTS "supplier_photos_public_access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view supplier photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- Create policy for admin-only viewing
CREATE POLICY "Only admins can view supplier photos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'supplier-photos' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow anyone to upload to supplier-photos (for application submissions)
DROP POLICY IF EXISTS "Anyone can upload supplier photos" ON storage.objects;
CREATE POLICY "Anyone can upload supplier photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'supplier-photos');

-- Allow admins to delete supplier photos
DROP POLICY IF EXISTS "Admins can delete supplier photos" ON storage.objects;
CREATE POLICY "Admins can delete supplier photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'supplier-photos' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);