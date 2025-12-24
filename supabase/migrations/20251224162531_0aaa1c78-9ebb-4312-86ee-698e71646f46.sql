-- Create supplier_applications table
CREATE TABLE public.supplier_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  raison_sociale text NOT NULL,
  siret text NOT NULL,
  adresse text NOT NULL,
  code_postal text NOT NULL,
  ville text NOT NULL,
  email text NOT NULL,
  telephone text NOT NULL,
  activite text NOT NULL,
  motivation text NOT NULL,
  produits text NOT NULL,
  source text,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.supplier_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an application (public insert)
CREATE POLICY "Anyone can submit supplier application"
ON public.supplier_applications
FOR INSERT
WITH CHECK (true);

-- Only admins can view applications
CREATE POLICY "Only admins can view supplier applications"
ON public.supplier_applications
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update applications
CREATE POLICY "Only admins can update supplier applications"
ON public.supplier_applications
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete applications
CREATE POLICY "Only admins can delete supplier applications"
ON public.supplier_applications
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_supplier_applications_updated_at
BEFORE UPDATE ON public.supplier_applications
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for supplier photos
INSERT INTO storage.buckets (id, name, public) VALUES ('supplier-photos', 'supplier-photos', true);

-- Storage policies for supplier photos
CREATE POLICY "Anyone can upload supplier photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'supplier-photos');

CREATE POLICY "Anyone can view supplier photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'supplier-photos');

CREATE POLICY "Only admins can delete supplier photos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'supplier-photos' AND has_role(auth.uid(), 'admin'::app_role));

-- Create table to link photos to applications
CREATE TABLE public.supplier_application_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.supplier_applications(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on photos table
ALTER TABLE public.supplier_application_photos ENABLE ROW LEVEL SECURITY;

-- Anyone can insert photos (needed for form submission)
CREATE POLICY "Anyone can insert supplier application photos"
ON public.supplier_application_photos
FOR INSERT
WITH CHECK (true);

-- Only admins can view photos
CREATE POLICY "Only admins can view supplier application photos"
ON public.supplier_application_photos
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete photos
CREATE POLICY "Only admins can delete supplier application photos"
ON public.supplier_application_photos
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));