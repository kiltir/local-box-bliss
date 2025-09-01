-- Create newsletter_subscriptions table
CREATE TABLE public.newsletter_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to subscribe (public feature)
CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.newsletter_subscriptions 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow reading for authenticated users (admin purposes)
CREATE POLICY "Authenticated users can view subscriptions" 
ON public.newsletter_subscriptions 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create index on email for performance
CREATE INDEX idx_newsletter_subscriptions_email ON public.newsletter_subscriptions(email);

-- Create index on subscribed_at for performance
CREATE INDEX idx_newsletter_subscriptions_subscribed_at ON public.newsletter_subscriptions(subscribed_at DESC);