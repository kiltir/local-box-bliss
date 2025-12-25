-- Create table for box products
CREATE TABLE public.box_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  box_id INTEGER NOT NULL,
  theme TEXT NOT NULL,
  name TEXT NOT NULL,
  quantity TEXT NOT NULL,
  producer TEXT NOT NULL,
  description TEXT,
  weight NUMERIC DEFAULT 0,
  dimension_width NUMERIC DEFAULT 0,
  dimension_height NUMERIC DEFAULT 0,
  dimension_depth NUMERIC DEFAULT 0,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.box_products ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view box products" 
ON public.box_products 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert box products" 
ON public.box_products 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update box products" 
ON public.box_products 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete box products" 
ON public.box_products 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_box_products_updated_at
BEFORE UPDATE ON public.box_products
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();