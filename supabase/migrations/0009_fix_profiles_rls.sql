-- Drop the recursive policy
DROP POLICY IF EXISTS "National admins can view all profiles" ON public.profiles;

-- Create a non-recursive policy using the security definer function
CREATE POLICY "National admins can view all profiles"
  ON public.profiles 
  FOR SELECT 
  USING (
    public.current_user_role() = 'national_admin'
  );
