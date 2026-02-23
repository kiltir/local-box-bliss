
-- Table to store pending order data before Stripe checkout
-- This avoids the 500-char Stripe metadata limit
CREATE TABLE public.pending_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  items jsonb NOT NULL,
  travel_info jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pending_orders ENABLE ROW LEVEL SECURITY;

-- Users can create their own pending orders
CREATE POLICY "Users can create their own pending orders"
ON public.pending_orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own pending orders
CREATE POLICY "Users can view their own pending orders"
ON public.pending_orders FOR SELECT
USING (auth.uid() = user_id);

-- Service role (edge functions) needs access - admins too
CREATE POLICY "Admins can view all pending orders"
ON public.pending_orders FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow deletion for cleanup
CREATE POLICY "Users can delete their own pending orders"
ON public.pending_orders FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete pending orders"
ON public.pending_orders FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
