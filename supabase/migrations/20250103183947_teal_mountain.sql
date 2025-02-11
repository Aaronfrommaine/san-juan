-- Add delete policy for awarded_badges
CREATE POLICY "Users can delete their own badges"
  ON awarded_badges
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);