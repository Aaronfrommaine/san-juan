-- Create policies for user_roles
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view roles" ON user_roles;

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

-- Create function to manage user roles
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
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
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

-- Create function to get user roles
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
  -- Only allow admins to view user roles
  IF NOT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

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
  GROUP BY au.id, au.email, p.first_name, p.last_name, au.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on functions
GRANT EXECUTE ON FUNCTION manage_user_roles TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_roles TO authenticated;