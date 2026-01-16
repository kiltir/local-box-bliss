-- Ajouter une colonne pour le poids du carton d'expédition
ALTER TABLE public.box_dimensions
ADD COLUMN IF NOT EXISTS shipping_box_weight NUMERIC DEFAULT 0.3;