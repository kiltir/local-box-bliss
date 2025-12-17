-- Create a table for box prices
CREATE TABLE public.box_prices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  box_id integer NOT NULL UNIQUE,
  theme text NOT NULL,
  unit_price numeric NOT NULL DEFAULT 0,
  subscription_6_months_price numeric NOT NULL DEFAULT 0,
  subscription_12_months_price numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.box_prices ENABLE ROW LEVEL SECURITY;

-- Anyone can view prices
CREATE POLICY "Anyone can view prices" 
ON public.box_prices 
FOR SELECT 
USING (true);

-- Only admins can update prices
CREATE POLICY "Only admins can update prices" 
ON public.box_prices 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can insert prices
CREATE POLICY "Only admins can insert prices" 
ON public.box_prices 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete prices
CREATE POLICY "Only admins can delete prices" 
ON public.box_prices 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_box_prices_updated_at
BEFORE UPDATE ON public.box_prices
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert default prices for all boxes
INSERT INTO public.box_prices (box_id, theme, unit_price, subscription_6_months_price, subscription_12_months_price) VALUES
(1, 'Découverte', 49.99, 284.94, 539.89),
(2, 'Bourbon', 89.99, 512.94, 971.89),
(3, 'Racine', 79.99, 455.94, 863.89),
(4, 'Saison', 69.99, 398.94, 755.89);