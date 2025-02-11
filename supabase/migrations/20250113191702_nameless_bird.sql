-- Create user roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'host', 'attendee', 'interested', 'vendor', 'service_provider')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create admin users view
CREATE OR REPLACE VIEW admin_user_list AS
SELECT 
  au.id,
  au.email,
  au.created_at,
  p.first_name,
  p.last_name,
  array_agg(ur.role) FILTER (WHERE ur.role IS NOT NULL) as roles
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
LEFT JOIN user_roles ur ON au.id = ur.user_id
GROUP BY au.id, au.email, au.created_at, p.first_name, p.last_name;

-- Grant access to view
GRANT SELECT ON admin_user_list TO authenticated;

-- Create function to check admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create initial admin user
DO $$
BEGIN
  INSERT INTO user_roles (user_id, role)
  SELECT id, 'admin'
  FROM auth.users
  WHERE email = 'aaron@abodekport.com'
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;