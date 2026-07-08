-- Enable Row Level Security on the documents table
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Grant access to service_role only (table is not used by the app API)
GRANT ALL ON public.documents TO service_role;

-- Revoke default access from anon and authenticated to ensure the table is not publicly reachable
REVOKE ALL ON public.documents FROM anon, authenticated;

-- Policy: service_role can access all rows (used by edge functions / admin operations)
CREATE POLICY "Service role full access on documents"
ON public.documents
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);