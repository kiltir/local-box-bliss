-- Create table for box advice content (Informations, Conseils par produit, Pourquoi)
CREATE TABLE public.box_advice (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  box_id integer NOT NULL,
  theme text NOT NULL,
  -- Section "Informations"
  info_title text NOT NULL DEFAULT 'Informations',
  info_content text NOT NULL DEFAULT '',
  -- Section "Pourquoi ?"
  why_title text NOT NULL DEFAULT '',
  why_content text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(box_id, theme)
);

-- Create table for product-specific advice
CREATE TABLE public.box_product_advice (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_keyword text NOT NULL UNIQUE,
  advice_title text NOT NULL,
  advice_content text NOT NULL,
  icon_name text NOT NULL DEFAULT 'Lightbulb',
  icon_color text NOT NULL DEFAULT 'text-yellow-600',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.box_advice ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.box_product_advice ENABLE ROW LEVEL SECURITY;

-- RLS policies for box_advice
CREATE POLICY "Anyone can view box advice" ON public.box_advice FOR SELECT USING (true);
CREATE POLICY "Only admins can insert box advice" ON public.box_advice FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update box advice" ON public.box_advice FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete box advice" ON public.box_advice FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for box_product_advice
CREATE POLICY "Anyone can view product advice" ON public.box_product_advice FOR SELECT USING (true);
CREATE POLICY "Only admins can insert product advice" ON public.box_product_advice FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update product advice" ON public.box_product_advice FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete product advice" ON public.box_product_advice FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_box_advice_updated_at
  BEFORE UPDATE ON public.box_advice
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_box_product_advice_updated_at
  BEFORE UPDATE ON public.box_product_advice
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert default data for each theme
INSERT INTO public.box_advice (box_id, theme, info_title, info_content, why_title, why_content) VALUES
(1, 'Découverte', 'Informations', 'L''île regorge de richesses insoupçonnées, que ce soit sa faune, sa flore, son savoir-faire et sa créativité. Son insularité a profondément transformé sa vision et son développement dans un effort commun de préservation de la nature et de l''environnement.', 'Pourquoi "Découverte" ?', 'La Box Découverte est vouée à faire connaître de nouveaux produits et de nouvelles saveurs de l''île de la Réunion.'),
(2, 'Bourbon', 'Informations', 'Avant de s''appeler Réunion, l''île fût appelée "Ile Bourbon", c''est pour cela que beaucoup de produits réunionnais possèdent cette appellation historique et culturelle héritée de la maison royale française du même nom.', 'Pourquoi "Bourbon" ?', 'La Box Bourbon est née de l''histoire, du savoir-faire et de la qualité des produits d''un territoire d''exception.'),
(3, 'Racine', 'Informations', 'Chacune des saveurs, goûts et parfums issus de notre gastronomie sont un héritage qui raconte une histoire, celle de la Réunion.', 'Pourquoi "Racine" ?', 'La Box Racine fait appel aux souvenirs des traditions, coutumes et recettes réunionnaises héritées de notre histoire et de nos ancêtres, autrement dit "nos racines".'),
(4, 'Saison', 'Informations', 'A la Réunion, il n''y a que 2 saisons :
- l''été austral, saison chaude et humide, de novembre à avril
- l''hiver austral, saison fraîche et sèche, de mai à octobre', 'Pourquoi "Saison" ?', 'La Box Saison adapte ses produits selon la saison, c''est un gage de qualité, de fraîcheur et d''authenticité pour les produits.');

-- Insert default product advice
INSERT INTO public.box_product_advice (product_keyword, advice_title, advice_content, icon_name, icon_color) VALUES
('café', 'Conservation du café', 'Conservez votre café dans un endroit sec et frais, à l''abri de la lumière. Une fois ouvert, consommez-le dans les 2-3 semaines pour préserver tous ses arômes.', 'Coffee', 'text-amber-600'),
('thé', 'Préparation du thé', 'Infusez 2-3 minutes dans une eau à 85°C pour les thés verts, 95°C pour les thés noirs. Utilisez 1 cuillère à café par tasse.', 'Leaf', 'text-green-600'),
('vanille', 'Utilisation de la vanille', 'Fendez la gousse en deux et grattez les graines avec un couteau. Conservez la gousse dans du sucre pour l''aromatiser naturellement.', 'Sparkles', 'text-purple-600'),
('miel', 'Conservation du miel', 'Le miel se conserve indéfiniment à température ambiante. S''il cristallise, réchauffez-le doucement au bain-marie pour retrouver sa texture liquide.', 'Lightbulb', 'text-yellow-600'),
('chocolat', 'Dégustation du chocolat', 'Laissez fondre le chocolat sur votre langue pour révéler tous ses arômes. Conservez-le entre 16-18°C à l''abri de l''humidité.', 'Sparkles', 'text-amber-800'),
('bière', 'Service de la bière', 'Servez bien fraîche (6-8°C) dans un verre propre légèrement incliné. Versez lentement pour obtenir une mousse crémeuse.', 'Coffee', 'text-amber-700'),
('biscuit', 'Conservation des biscuits', 'Conservez dans une boîte hermétique pour garder le croustillant. Parfaits avec un thé ou un café pour le goûter.', 'Lightbulb', 'text-orange-600'),
('sablé', 'Conservation des sablés', 'Conservez dans une boîte hermétique pour garder le croustillant. Parfaits avec un thé ou un café pour le goûter.', 'Lightbulb', 'text-orange-600'),
('confiture', 'Conservation de la confiture', 'Une fois ouverte, conservez au réfrigérateur et consommez dans le mois. Utilisez une cuillère propre à chaque utilisation.', 'Leaf', 'text-red-600');