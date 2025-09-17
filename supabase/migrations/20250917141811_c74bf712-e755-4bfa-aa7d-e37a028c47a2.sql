-- Add arrival and departure date/time columns to orders table
ALTER TABLE public.orders 
ADD COLUMN arrival_date_reunion date,
ADD COLUMN departure_date_reunion date,
ADD COLUMN arrival_time_reunion time,
ADD COLUMN departure_time_reunion time;

-- Add comments to describe the columns
COMMENT ON COLUMN public.orders.arrival_date_reunion IS 'Arrival date in Reunion chosen at the time of order';
COMMENT ON COLUMN public.orders.departure_date_reunion IS 'Departure date from Reunion chosen at the time of order';
COMMENT ON COLUMN public.orders.arrival_time_reunion IS 'Arrival time in Reunion chosen at the time of order';
COMMENT ON COLUMN public.orders.departure_time_reunion IS 'Departure time from Reunion chosen at the time of order';