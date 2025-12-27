-- Add is_featured column to box_reviews table
ALTER TABLE public.box_reviews 
ADD COLUMN is_featured boolean NOT NULL DEFAULT false;

-- Create index for faster queries on featured reviews
CREATE INDEX idx_box_reviews_is_featured ON public.box_reviews(is_featured) WHERE is_featured = true;