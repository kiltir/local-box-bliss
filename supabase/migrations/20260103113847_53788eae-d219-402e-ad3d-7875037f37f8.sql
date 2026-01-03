-- Add is_visible column to box_products table
ALTER TABLE public.box_products 
ADD COLUMN is_visible boolean NOT NULL DEFAULT true;