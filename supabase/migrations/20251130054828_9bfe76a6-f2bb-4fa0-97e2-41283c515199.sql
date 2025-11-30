-- Create favorites table for storing user's favorite cities
CREATE TABLE public.favorite_cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  city_name TEXT NOT NULL,
  country TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lon NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, city_name, country)
);

-- Enable Row Level Security
ALTER TABLE public.favorite_cities ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own favorite cities" 
ON public.favorite_cities 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorite cities" 
ON public.favorite_cities 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite cities" 
ON public.favorite_cities 
FOR DELETE 
USING (auth.uid() = user_id);