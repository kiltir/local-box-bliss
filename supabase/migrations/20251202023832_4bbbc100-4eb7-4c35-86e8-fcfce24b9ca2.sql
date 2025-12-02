-- Create box_stock table for inventory management
CREATE TABLE public.box_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  box_id INTEGER NOT NULL UNIQUE,
  theme TEXT NOT NULL,
  available_stock INTEGER NOT NULL DEFAULT 0,
  safety_stock INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT box_stock_available_stock_check CHECK (available_stock >= 0),
  CONSTRAINT box_stock_safety_stock_check CHECK (safety_stock >= 0)
);

-- Enable RLS
ALTER TABLE public.box_stock ENABLE ROW LEVEL SECURITY;

-- Anyone can view stock levels
CREATE POLICY "Anyone can view stock"
ON public.box_stock
FOR SELECT
USING (true);

-- Only admins can modify stock
CREATE POLICY "Only admins can insert stock"
ON public.box_stock
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update stock"
ON public.box_stock
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete stock"
ON public.box_stock
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_box_stock_updated_at
BEFORE UPDATE ON public.box_stock
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert initial stock data for all box themes
INSERT INTO public.box_stock (box_id, theme, available_stock, safety_stock) VALUES
  (1, 'Découverte', 50, 10),
  (2, 'Bourbon', 50, 10),
  (3, 'Racine', 50, 10),
  (4, 'Saison', 50, 10);