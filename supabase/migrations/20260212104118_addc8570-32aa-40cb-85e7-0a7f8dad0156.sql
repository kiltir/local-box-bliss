
-- Table pour gérer les frais de livraison
CREATE TABLE public.shipping_costs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  delivery_type text NOT NULL UNIQUE,
  label text NOT NULL,
  cost numeric NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shipping_costs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view shipping costs" ON public.shipping_costs FOR SELECT USING (true);
CREATE POLICY "Only admins can insert shipping costs" ON public.shipping_costs FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update shipping costs" ON public.shipping_costs FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete shipping costs" ON public.shipping_costs FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed data with current hardcoded values
INSERT INTO public.shipping_costs (delivery_type, label, cost) VALUES
  ('metropole', 'Livraison métropole', 25),
  ('reunion', 'Livraison Réunion', 12),
  ('airport', 'Récupération à l''aéroport', 15);
