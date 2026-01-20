-- Drop existing policies for box-product-images and recreate with admin-only access for better security consistency
DROP POLICY IF EXISTS "Authenticated users can upload box product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update box product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete box product images" ON storage.objects;

-- Create admin-only policies for box-product-images (consistent with other buckets)
CREATE POLICY "Admins can upload box product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'box-product-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update box product images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'box-product-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete box product images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'box-product-images' AND has_role(auth.uid(), 'admin'));