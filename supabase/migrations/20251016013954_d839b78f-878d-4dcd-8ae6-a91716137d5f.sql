-- Create contact_submissions table for secure form handling
CREATE TABLE public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'spam')),
    admin_notes TEXT
);

-- Enable RLS on contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Only admins can view contact submissions
CREATE POLICY "Only admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update contact submissions (for status changes)
CREATE POLICY "Only admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add proper DELETE policy for order_items (users can delete items from their own pending orders)
CREATE POLICY "Users can delete items from their own pending orders"
ON public.order_items
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.orders
        WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
        AND orders.status = 'en_attente'
    )
);

-- Create rate limiting table for contact form
CREATE TABLE public.contact_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL, -- IP or email
    submission_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_submission TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(identifier)
);

-- Enable RLS on rate limits (only admins can view)
ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view rate limits"
ON public.contact_rate_limits
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));