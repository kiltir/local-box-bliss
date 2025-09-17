-- Remove delivery preference and arrival/departure date/time columns from profiles table
-- These are now stored per order in the orders table
ALTER TABLE public.profiles 
DROP COLUMN delivery_preference,
DROP COLUMN arrival_date_reunion,
DROP COLUMN departure_date_reunion,
DROP COLUMN arrival_time_reunion,
DROP COLUMN departure_time_reunion;