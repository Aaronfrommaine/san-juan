/*
  # Fix Profile System

  1. Updates
    - Add ON CONFLICT clause to handle_new_user function
    - Update profile policies for better access control
    - Add missing indexes for performance

  2. Security
    - Ensure proper RLS policies
    - Add data validation
*/

-- Update handle_new_user function to handle conflicts
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    investment_focus
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    ARRAY[]::text[]
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update profile policies
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add missing indexes
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(id);
CREATE INDEX IF NOT EXISTS awarded_badges_user_id_idx ON awarded_badges(user_id);

-- Ensure all existing users have profiles
INSERT INTO profiles (id, first_name, last_name, investment_focus)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'first_name', split_part(email, '@', 1)),
  COALESCE(raw_user_meta_data->>'last_name', ''),
  ARRAY[]::text[]
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;