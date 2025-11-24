-- Drop existing user update/delete policies
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.box_reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.box_reviews;

-- Add admin-only policies for update and delete
CREATE POLICY "Only admins can update reviews"
ON public.box_reviews
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete reviews"
ON public.box_reviews
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));