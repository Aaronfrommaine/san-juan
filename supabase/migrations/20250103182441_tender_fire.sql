-- Add travel preparation badge
INSERT INTO badges (name, description, icon_url, category)
VALUES (
  'Travel Ready',
  'Completed all travel preparation checklist items',
  '/badges/travel.svg',
  'preparation'
) ON CONFLICT (name) DO NOTHING;

-- Add host badge if it doesn't exist
INSERT INTO badges (name, description, icon_url, category)
VALUES (
  'Seminar Host',
  'Official seminar host and local expert',
  '/badges/host.svg',
  'role'
) ON CONFLICT (name) DO NOTHING;

-- Create function to award travel badge
CREATE OR REPLACE FUNCTION award_travel_badge()
RETURNS trigger AS $$
BEGIN
  -- Award the Travel Ready badge
  INSERT INTO awarded_badges (user_id, badge_id, metadata)
  SELECT 
    NEW.user_id,
    b.id,
    jsonb_build_object(
      'awarded_for', 'Completed travel preparation checklist',
      'completed_at', now()
    )
  FROM badges b
  WHERE b.name = 'Travel Ready'
  AND NOT EXISTS (
    SELECT 1 FROM awarded_badges ab
    WHERE ab.user_id = NEW.user_id
    AND ab.badge_id = b.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to award host badge
CREATE OR REPLACE FUNCTION award_host_badge()
RETURNS trigger AS $$
BEGIN
  IF NEW.is_host = true THEN
    INSERT INTO awarded_badges (user_id, badge_id, metadata)
    SELECT 
      NEW.id,
      b.id,
      jsonb_build_object(
        'awarded_for', 'Became a seminar host',
        'awarded_at', now()
      )
    FROM badges b
    WHERE b.name = 'Seminar Host'
    AND NOT EXISTS (
      SELECT 1 FROM awarded_badges ab
      WHERE ab.user_id = NEW.id
      AND ab.badge_id = b.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for host badge
CREATE TRIGGER on_become_host
  AFTER UPDATE OF is_host ON profiles
  FOR EACH ROW
  WHEN (OLD.is_host IS DISTINCT FROM NEW.is_host AND NEW.is_host = true)
  EXECUTE FUNCTION award_host_badge();