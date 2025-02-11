-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own badges" ON awarded_badges;

-- Create insert policy for awarded_badges
CREATE POLICY "Users can insert their own badges"
  ON awarded_badges
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE awarded_badges ENABLE ROW LEVEL SECURITY;