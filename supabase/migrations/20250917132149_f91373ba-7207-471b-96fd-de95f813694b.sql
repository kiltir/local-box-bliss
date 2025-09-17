-- Add delivery_preference column to orders table
ALTER TABLE public.orders 
ADD COLUMN delivery_preference text;

-- Add a comment to describe the column
COMMENT ON COLUMN public.orders.delivery_preference IS 'Delivery preference chosen at the time of order (airport_pickup or mainland_delivery)';