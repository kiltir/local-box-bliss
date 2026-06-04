
-- 1) Enable RLS on n8n_chat_histories and restrict to admins only (legacy table, no public access)
ALTER TABLE public.n8n_chat_histories ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.n8n_chat_histories FROM anon, authenticated;
GRANT SELECT ON public.n8n_chat_histories TO authenticated;
GRANT ALL ON public.n8n_chat_histories TO service_role;

DROP POLICY IF EXISTS "Admins can view chat histories" ON public.n8n_chat_histories;
CREATE POLICY "Admins can view chat histories"
  ON public.n8n_chat_histories
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 2) Tighten supplier-photos upload policy: only admins can upload directly;
--    edge functions use the service role which bypasses RLS.
DROP POLICY IF EXISTS "Authenticated users can upload supplier photos via signed URL" ON storage.objects;

CREATE POLICY "Only admins can upload supplier photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'supplier-photos'
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  );

-- 3) Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
