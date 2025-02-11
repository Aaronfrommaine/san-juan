/*
  # Add Avatar and Badge System

  1. Updates
    - Add avatar_result column to profiles for storing quiz results
    - Add awarded_badges table for tracking badge awards
    - Add policies for badge management

  2. Security
    - Enable RLS on all new tables
    - Add policies for proper access control
*/

-- Add avatar_result column to profiles
ALTER TABLE profiles
ADD COLUMN avatar_result jsonb;

-- Create awarded_badges table
CREATE TABLE IF NOT EXISTS awarded_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at timestamptz DEFAULT now(),
  metadata jsonb,
  UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE awarded_badges ENABLE ROW LEVEL SECURITY;

-- Create policies for awarded_badges
CREATE POLICY "Users can view their own awarded badges"
  ON awarded_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to award avatar badge
CREATE OR REPLACE FUNCTION award_avatar_badge()
RETURNS trigger AS $$
BEGIN
  -- Only proceed if avatar_result has changed
  IF OLD.avatar_result IS DISTINCT FROM NEW.avatar_result AND NEW.avatar_result IS NOT NULL THEN
    -- Award the Avatar badge if not already awarded
    INSERT INTO awarded_badges (user_id, badge_id)
    SELECT NEW.id, b.id
    FROM badges b
    WHERE b.name = 'Investor Avatar'
    AND NOT EXISTS (
      SELECT 1 FROM awarded_badges ab
      WHERE ab.user_id = NEW.id AND ab.badge_id = b.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for avatar badge
CREATE TRIGGER on_avatar_result_update
  AFTER UPDATE OF avatar_result ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION award_avatar_badge();