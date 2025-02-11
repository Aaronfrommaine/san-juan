-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view roles" ON user_roles;

-- Create new policies without circular dependencies
CREATE POLICY "Admins can manage all roles"
  ON user_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users au
      WHERE au.id = auth.uid()
      AND au.email = 'aaron@abodekport.com'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users au
      WHERE au.id = auth.uid()
      AND au.email = 'aaron@abodekport.com'
    )
  );

CREATE POLICY "Users can view roles"
  ON user_roles
  FOR SELECT
  USING (true);

-- Update the get_user_roles function to avoid recursion
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
  -- Only allow admin to view user roles
  IF NOT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
    AND au.email = 'aaron@abodekport.com'
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    au.id,
    au.email::text,
    COALESCE(p.first_name, '')::text,
    COALESCE(p.last_name, '')::text,
    au.created_at,
    COALESCE(array_agg(ur.role) FILTER (WHERE ur.role IS NOT NULL), ARRAY[]::text[])
  FROM auth.users au
  LEFT JOIN profiles p ON au.id = p.id
  LEFT JOIN user_roles ur ON au.id = ur.user_id
  GROUP BY au.id, au.email, p.first_name, p.last_name, au.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the manage_user_roles function to avoid recursion
CREATE OR REPLACE FUNCTION manage_user_roles(
  target_user_id uuid,
  new_roles text[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
    AND au.email = 'aaron@abodekport.com'
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Delete existing roles
  DELETE FROM user_roles WHERE user_id = target_user_id;
  
  -- Insert new roles
  IF array_length(new_roles, 1) > 0 THEN
    INSERT INTO user_roles (user_id, role)
    SELECT target_user_id, unnest(new_roles);
  END IF;
END;
$$;

-- Ensure admin user exists
DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Get admin user ID
  SELECT id INTO admin_id
  FROM auth.users
  WHERE email = 'aaron@abodekport.com';

  -- Ensure admin role exists
  IF admin_id IS NOT NULL THEN
    INSERT INTO user_roles (user_id, role)
    VALUES (admin_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;