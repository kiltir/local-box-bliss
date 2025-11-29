-- Assign admin role to Admin YG
INSERT INTO public.user_roles (user_id, role)
VALUES ('a33ac231-f2e8-4628-b019-0c69047ca08f', 'admin');

-- Create box_images table for dynamic image management
CREATE TABLE public.box_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  box_id integer NOT NULL,
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on box_images
ALTER TABLE public.box_images ENABLE ROW LEVEL SECURITY;

-- RLS policies for box_images
CREATE POLICY "Anyone can view box images"
ON public.box_images
FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert box images"
ON public.box_images
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update box images"
ON public.box_images
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete box images"
ON public.box_images
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for admins to view all orders
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all orders"
ON public.orders
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policy for admins to view all order items
CREATE POLICY "Admins can view all order items"
ON public.order_items
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for admins to manage user roles
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert user roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updating updated_at on box_images
CREATE TRIGGER update_box_images_updated_at
BEFORE UPDATE ON public.box_images
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for box images
INSERT INTO storage.buckets (id, name, public)
VALUES ('box-images', 'box-images', true);

-- Storage policies for box images
CREATE POLICY "Anyone can view box images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'box-images');

CREATE POLICY "Admins can upload box images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'box-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update box images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'box-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete box images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'box-images' AND public.has_role(auth.uid(), 'admin'));