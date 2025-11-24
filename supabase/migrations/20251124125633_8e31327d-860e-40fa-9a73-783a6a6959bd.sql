-- Create function to handle updated_at first
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create box_reviews table
CREATE TABLE public.box_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  box_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.box_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for box_reviews
-- Everyone can view reviews
CREATE POLICY "Anyone can view reviews" 
ON public.box_reviews 
FOR SELECT 
USING (true);

-- Authenticated users can create their own reviews
CREATE POLICY "Authenticated users can create reviews" 
ON public.box_reviews 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews" 
ON public.box_reviews 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews" 
ON public.box_reviews 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_box_reviews_updated_at
BEFORE UPDATE ON public.box_reviews
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create index for faster queries
CREATE INDEX idx_box_reviews_box_id ON public.box_reviews(box_id);
CREATE INDEX idx_box_reviews_user_id ON public.box_reviews(user_id);
CREATE INDEX idx_box_reviews_created_at ON public.box_reviews(created_at DESC);