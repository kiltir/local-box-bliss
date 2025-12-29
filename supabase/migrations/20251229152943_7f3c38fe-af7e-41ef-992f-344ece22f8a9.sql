-- Fix the security definer view issue by recreating with SECURITY INVOKER
DROP VIEW IF EXISTS public.public_box_reviews;

CREATE VIEW public.public_box_reviews 
WITH (security_invoker = true) AS
SELECT 
  id,
  box_id,
  rating,
  comment,
  is_featured,
  created_at,
  updated_at
FROM public.box_reviews;

-- Grant SELECT on the view to authenticated and anon roles
GRANT SELECT ON public.public_box_reviews TO authenticated;
GRANT SELECT ON public.public_box_reviews TO anon;