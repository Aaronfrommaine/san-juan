-- Create storage bucket for profile pictures if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile_pictures', 'profile_pictures', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create storage policies for profile pictures
CREATE POLICY "Profile pictures are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile_pictures');

CREATE POLICY "Users can upload their own profile picture"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'profile_pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own profile picture"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile_pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile picture"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile_pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create function to handle profile picture updates
CREATE OR REPLACE FUNCTION update_profile_picture(user_uuid uuid, picture_url text)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET avatar_url = picture_url
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle avatar assignment based on questionnaire
CREATE OR REPLACE FUNCTION assign_avatar_type(
  user_uuid uuid,
  questionnaire_result jsonb
)
RETURNS void AS $$
DECLARE
  avatar_type text;
BEGIN
  -- Determine avatar type based on questionnaire result
  avatar_type := CASE 
    WHEN questionnaire_result->>'type' = 'hnw' THEN 'portfolio_powerhouse'
    WHEN questionnaire_result->>'type' = 'diaspora' THEN 'heritage_builder'
    WHEN questionnaire_result->>'type' = 'impact' THEN 'changemaker'
    WHEN questionnaire_result->>'type' = 'institutional' THEN 'market_strategist'
    WHEN questionnaire_result->>'type' = 'lifestyle' THEN 'paradise_planner'
    ELSE NULL
  END;

  -- Update profile with avatar type
  UPDATE profiles
  SET 
    avatar_type = avatar_type,
    avatar_result = questionnaire_result
  WHERE id = user_uuid;

  -- Award avatar badge if not already awarded
  INSERT INTO awarded_badges (user_id, badge_id)
  SELECT 
    user_uuid,
    b.id
  FROM badges b
  WHERE b.name = 'Investor Avatar'
  AND NOT EXISTS (
    SELECT 1 FROM awarded_badges ab
    WHERE ab.user_id = user_uuid
    AND ab.badge_id = b.id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle travel badge with unique name
CREATE OR REPLACE FUNCTION award_travel_badge_v2(user_uuid uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO awarded_badges (user_id, badge_id)
  SELECT 
    user_uuid,
    b.id
  FROM badges b
  WHERE b.name = 'Travel Ready'
  AND NOT EXISTS (
    SELECT 1 FROM awarded_badges ab
    WHERE ab.user_id = user_uuid
    AND ab.badge_id = b.id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION update_profile_picture TO authenticated;
GRANT EXECUTE ON FUNCTION assign_avatar_type TO authenticated;
GRANT EXECUTE ON FUNCTION award_travel_badge_v2 TO authenticated;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_awarded_badges_user_badge 
ON awarded_badges(user_id, badge_id);