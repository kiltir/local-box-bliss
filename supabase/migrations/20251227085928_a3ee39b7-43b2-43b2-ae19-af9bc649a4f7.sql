-- Add image_url column to partners table
ALTER TABLE public.partners ADD COLUMN image_url text;

-- Create storage bucket for partner images
INSERT INTO storage.buckets (id, name, public) VALUES ('partner-images', 'partner-images', true);

-- Storage policies for partner images
CREATE POLICY "Anyone can view partner images"
ON storage.objects FOR SELECT
USING (bucket_id = 'partner-images');

CREATE POLICY "Only admins can upload partner images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'partner-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update partner images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'partner-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete partner images"
ON storage.objects FOR DELETE
USING (bucket_id = 'partner-images' AND has_role(auth.uid(), 'admin'::app_role));