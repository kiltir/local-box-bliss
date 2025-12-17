-- Add second message column for rotating banners
ALTER TABLE public.box_banners 
ADD COLUMN message_2 text DEFAULT ''::text NOT NULL;