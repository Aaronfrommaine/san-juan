-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own awarded badges" ON awarded_badges;
DROP POLICY IF EXISTS "Users can insert their own badges" ON awarded_badges;
DROP POLICY IF EXISTS "Users can delete their own badges" ON awarded_badges;

-- Create comprehensive policies for awarded_badges
CREATE POLICY "Users can view all awarded badges"
  ON awarded_badges FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own badges"
  ON awarded_badges
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE awarded_badges ENABLE ROW LEVEL SECURITY;