-- Create function to check admin access that doesn't rely on user_roles table
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND email = 'aaron@abodekport.com'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the AdminRoute component to use email check