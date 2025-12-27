-- Create function to update timestamps if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create gallery_images table for the community carousel
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Anyone can view active images
CREATE POLICY "Anyone can view active gallery images" 
ON public.gallery_images 
FOR SELECT 
USING (is_active = true);

-- Only admins can insert images
CREATE POLICY "Only admins can insert gallery images" 
ON public.gallery_images 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update images
CREATE POLICY "Only admins can update gallery images" 
ON public.gallery_images 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete images
CREATE POLICY "Only admins can delete gallery images" 
ON public.gallery_images 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_gallery_images_active_order ON public.gallery_images(is_active, display_order);

-- Create trigger for updated_at
CREATE TRIGGER update_gallery_images_updated_at
BEFORE UPDATE ON public.gallery_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();