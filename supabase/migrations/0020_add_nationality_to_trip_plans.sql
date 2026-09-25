ALTER TABLE public.trip_plans
ADD COLUMN IF NOT EXISTS traveler_nationality text;
