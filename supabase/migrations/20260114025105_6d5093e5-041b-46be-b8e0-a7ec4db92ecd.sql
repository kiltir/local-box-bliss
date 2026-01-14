-- Fix RLS for partners updates (allow admins to manage partners)

-- Ensure RLS is enabled
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Optional: clean up potentially conflicting old policies (only if they exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='partners' AND policyname='Admins can manage partners') THEN
    DROP POLICY "Admins can manage partners" ON public.partners;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='partners' AND policyname='Admins can select partners') THEN
    DROP POLICY "Admins can select partners" ON public.partners;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='partners' AND policyname='Admins can insert partners') THEN
    DROP POLICY "Admins can insert partners" ON public.partners;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='partners' AND policyname='Admins can update partners') THEN
    DROP POLICY "Admins can update partners" ON public.partners;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='partners' AND policyname='Admins can delete partners') THEN
    DROP POLICY "Admins can delete partners" ON public.partners;
  END IF;
END $$;

-- Public/website read: only active partners are visible
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='partners' AND policyname='Public can read active partners') THEN
    DROP POLICY "Public can read active partners" ON public.partners;
  END IF;
END $$;

CREATE POLICY "Public can read active partners"
ON public.partners
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Admin full access (uses SECURITY DEFINER function has_role)
CREATE POLICY "Admins can select partners"
ON public.partners
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert partners"
ON public.partners
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update partners"
ON public.partners
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete partners"
ON public.partners
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
