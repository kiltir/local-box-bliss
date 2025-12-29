-- Create a secure view for public reviews that excludes user_id
CREATE OR REPLACE VIEW public.public_box_reviews AS
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

-- Update the RLS policy on box_reviews to restrict public access
-- First drop the existing public SELECT policy
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.box_reviews;

-- Create new policy: only authenticated users can view reviews (for profile lookup)
CREATE POLICY "Authenticated users can view reviews" 
ON public.box_reviews 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Admins can still view all reviews (already covered by the authenticated policy + admin permissions)