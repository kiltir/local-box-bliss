-- Create table for box dimensions (weight and volume limits)
CREATE TABLE public.box_dimensions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  box_id INTEGER NOT NULL,
  theme TEXT NOT NULL UNIQUE,
  weight_limit NUMERIC NOT NULL DEFAULT 2,
  width NUMERIC NOT NULL DEFAULT 30,
  height NUMERIC NOT NULL DEFAULT 18,
  depth NUMERIC NOT NULL DEFAULT 8,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.box_dimensions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view box dimensions" 
ON public.box_dimensions 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert box dimensions" 
ON public.box_dimensions 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update box dimensions" 
ON public.box_dimensions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete box dimensions" 
ON public.box_dimensions 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_box_dimensions_updated_at
BEFORE UPDATE ON public.box_dimensions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default values for each box theme
INSERT INTO public.box_dimensions (box_id, theme, weight_limit, width, height, depth)
VALUES 
  (1, 'Découverte', 2, 30, 18, 8),
  (2, 'Racine', 2, 30, 18, 8),
  (3, 'Bourbon', 2, 30, 18, 8),
  (4, 'Saison', 2, 30, 18, 8);