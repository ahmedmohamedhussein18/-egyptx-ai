
DROP POLICY IF EXISTS "Gov admins view profiles" ON profiles;

CREATE POLICY "Gov admins view profiles" ON profiles
FOR SELECT
USING (
    public.current_user_role() IN ('governorate_admin', 'governorate_analyst')
    AND public.current_user_governorate() = profiles.governorate_id
);

-- Wait, current_user_role and current_user_governorate query profiles!
-- But they use SECURITY DEFINER. Does SECURITY DEFINER bypass RLS? 
-- YES! Because it runs as the owner (postgres). But wait! 
-- Is row level security enabled on profiles? Yes.
-- For SECURITY DEFINER to bypass RLS, the owner (postgres) must bypass RLS.
-- PostgreSQL superusers bypass RLS. So it doesn't recurse.
