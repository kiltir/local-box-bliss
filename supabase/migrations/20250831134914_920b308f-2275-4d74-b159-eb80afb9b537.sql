-- Add travel information columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN arrival_date_reunion DATE,
ADD COLUMN departure_date_reunion DATE,
ADD COLUMN arrival_time_reunion TIME,
ADD COLUMN departure_time_reunion TIME,
ADD COLUMN delivery_preference TEXT CHECK (delivery_preference IN ('airport_pickup', 'mainland_delivery'));