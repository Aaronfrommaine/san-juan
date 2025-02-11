-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view roles" ON user_roles;

-- Recreate policies with proper checks
CREATE POLICY "Admins can manage all roles"
  ON user_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
    )
  );

CREATE POLICY "Users can view roles"
  ON user_roles
  FOR SELECT
  USING (true);

-- Update the get_user_roles function to handle null roles
CREATE OR REPLACE FUNCTION get_user_roles()
RETURNS TABLE (
  id uuid,
  email text,
  first_name text,
  last_name text,
  created_at timestamptz,
  roles text[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    p.first_name,
    p.last_name,
    au.created_at,
    COALESCE(array_agg(ur.role) FILTER (WHERE ur.role IS NOT NULL), ARRAY[]::text[])
  FROM auth.users au
  LEFT JOIN profiles p ON au.id = p.id
  LEFT JOIN user_roles ur ON au.id = ur.user_id
  WHERE EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
  GROUP BY au.id, au.email, p.first_name, p.last_name, au.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure admin user has proper role
DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Get admin user ID
  SELECT id INTO admin_id
  FROM auth.users
  WHERE email = 'aaron@abodekport.com';

  -- Ensure admin role exists
  INSERT INTO user_roles (user_id, role)
  VALUES (admin_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;