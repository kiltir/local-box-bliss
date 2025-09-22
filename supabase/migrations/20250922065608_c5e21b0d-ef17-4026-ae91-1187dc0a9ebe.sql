-- Add date and time preference columns to orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS date_preference date,
  ADD COLUMN IF NOT EXISTS time_preference time without time zone;