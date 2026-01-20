-- Create storage bucket for box product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('box-product-images', 'box-product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for box product images bucket
CREATE POLICY "Anyone can view box product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'box-product-images');

CREATE POLICY "Authenticated users can upload box product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'box-product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update box product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'box-product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete box product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'box-product-images' AND auth.role() = 'authenticated');