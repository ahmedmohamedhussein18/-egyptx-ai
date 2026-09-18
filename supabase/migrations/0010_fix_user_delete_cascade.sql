-- Fix missing ON DELETE CASCADE for foreign keys referencing auth.users

-- 1. qr_checkins
ALTER TABLE public.qr_checkins
  DROP CONSTRAINT qr_checkins_user_id_fkey,
  ADD CONSTRAINT qr_checkins_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. analytics_events
ALTER TABLE public.analytics_events
  DROP CONSTRAINT analytics_events_user_id_fkey,
  ADD CONSTRAINT analytics_events_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. emergency_requests
ALTER TABLE public.emergency_requests
  DROP CONSTRAINT emergency_requests_user_id_fkey,
  ADD CONSTRAINT emergency_requests_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. ai_memories
ALTER TABLE public.ai_memories
  DROP CONSTRAINT ai_memories_user_id_fkey,
  ADD CONSTRAINT ai_memories_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 5. kids_profiles
ALTER TABLE public.kids_profiles
  DROP CONSTRAINT kids_profiles_user_id_fkey,
  ADD CONSTRAINT kids_profiles_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 6. trip_plans
ALTER TABLE public.trip_plans
  DROP CONSTRAINT trip_plans_user_id_fkey,
  ADD CONSTRAINT trip_plans_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
