-- Create table to store box banners (for seasonal messages)
CREATE TABLE public.box_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  box_id INTEGER NOT NULL UNIQUE,
  message TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.box_banners ENABLE ROW LEVEL SECURITY;

-- Anyone can view active banners
CREATE POLICY "Anyone can view banners"
ON public.box_banners
FOR SELECT
USING (true);

-- Only admins can insert banners
CREATE POLICY "Only admins can insert banners"
ON public.box_banners
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update banners
CREATE POLICY "Only admins can update banners"
ON public.box_banners
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete banners
CREATE POLICY "Only admins can delete banners"
ON public.box_banners
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_box_banners_updated_at
BEFORE UPDATE ON public.box_banners
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert default banner for Box Saison (box_id = 4)
INSERT INTO public.box_banners (box_id, message, is_active)
VALUES (4, 'Édition Été 2025 - Saveurs tropicales', true);