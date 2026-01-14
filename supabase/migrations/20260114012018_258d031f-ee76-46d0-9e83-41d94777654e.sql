-- Supprimer la politique existante incomplète
DROP POLICY IF EXISTS "Only admins can update partners" ON public.partners;

-- Recréer la politique avec les deux clauses USING et WITH CHECK
CREATE POLICY "Only admins can update partners"
ON public.partners
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));