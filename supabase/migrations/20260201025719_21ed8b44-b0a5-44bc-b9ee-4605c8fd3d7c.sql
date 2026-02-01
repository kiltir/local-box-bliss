-- Table pour gérer le nombre de produits affiché par thématique et type d'achat
CREATE TABLE public.box_product_counts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  box_id integer NOT NULL,
  theme text NOT NULL,
  one_time_count integer NOT NULL DEFAULT 5,
  subscription_count integer NOT NULL DEFAULT 5,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (box_id, theme)
);

-- Enable RLS
ALTER TABLE public.box_product_counts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view product counts"
ON public.box_product_counts FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert product counts"
ON public.box_product_counts FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update product counts"
ON public.box_product_counts FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete product counts"
ON public.box_product_counts FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default values for each theme
INSERT INTO public.box_product_counts (box_id, theme, one_time_count, subscription_count)
VALUES 
  (1, 'Découverte', 5, 5),
  (2, 'Bourbon', 5, 5),
  (3, 'Racine', 5, 5),
  (4, 'Saison', 5, 5);

-- Trigger for updated_at
CREATE TRIGGER update_box_product_counts_updated_at
BEFORE UPDATE ON public.box_product_counts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();