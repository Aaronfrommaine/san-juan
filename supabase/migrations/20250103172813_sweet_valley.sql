/*
  # Create user profiles and badges system

  1. New Tables
    - `profiles`
      - Basic user information
      - Investment preferences
      - Avatar type from questionnaire
    - `badges`
      - Achievement tracking
      - Visual representation
    - `user_badges`
      - Junction table for user-badge relationships
  
  2. Security
    - Enable RLS on all tables
    - Add policies for secure access
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  avatar_type text CHECK (avatar_type IN ('portfolio_powerhouse', 'heritage_builder', 'changemaker', 'market_strategist', 'paradise_planner')),
  company text,
  title text,
  bio text,
  location text,
  investment_focus text[],
  linkedin_url text,
  website_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  icon_url text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_badges junction table
CREATE TABLE IF NOT EXISTS user_badges (
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, badge_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (true);

-- Insert default badges
INSERT INTO badges (name, description, icon_url, category) VALUES
  ('Investor Avatar', 'Completed the investor questionnaire', '/badges/avatar.svg', 'onboarding'),
  ('Seminar Graduate', 'Completed the on-island investment seminar', '/badges/graduate.svg', 'education'),
  ('First Investment', 'Made first property investment in Puerto Rico', '/badges/investment.svg', 'achievement'),
  ('Network Builder', 'Connected with 10+ fellow investors', '/badges/network.svg', 'community'),
  ('Local Expert', 'Contributed valuable insights to the community', '/badges/expert.svg', 'contribution');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();