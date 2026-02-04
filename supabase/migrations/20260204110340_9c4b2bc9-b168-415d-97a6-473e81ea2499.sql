-- Add purchase_type column to box_images table
ALTER TABLE public.box_images 
ADD COLUMN purchase_type text NOT NULL DEFAULT 'one-time';

-- Add comment for clarity
COMMENT ON COLUMN public.box_images.purchase_type IS 'Type of purchase: one-time or subscription';

-- Create index for efficient queries
CREATE INDEX idx_box_images_purchase_type ON public.box_images(box_id, purchase_type);