-- Add billing address columns to orders table
ALTER TABLE public.orders 
ADD COLUMN billing_address_street text,
ADD COLUMN billing_address_city text,
ADD COLUMN billing_address_postal_code text,
ADD COLUMN billing_address_country text DEFAULT 'France';