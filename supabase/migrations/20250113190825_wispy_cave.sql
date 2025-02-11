-- Create user roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'host', 'attendee', 'interested', 'vendor', 'service_provider')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create function to check admin count
CREATE OR REPLACE FUNCTION check_admin_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'admin' THEN
    IF (
      SELECT COUNT(*)
      FROM user_roles
      WHERE role = 'admin'
    ) >= 3 THEN
      RAISE EXCEPTION 'Maximum of 3 admins allowed';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce admin limit
CREATE TRIGGER enforce_admin_limit
  BEFORE INSERT ON user_roles
  FOR EACH ROW
  WHEN (NEW.role = 'admin')
  EXECUTE FUNCTION check_admin_count();

-- Grant initial admin role to the first user
DO $$
BEGIN
  INSERT INTO user_roles (user_id, role)
  SELECT id, 'admin'
  FROM auth.users
  WHERE email = 'aaron@abodekport.com'
  ON CONFLICT DO NOTHING;
END $$;