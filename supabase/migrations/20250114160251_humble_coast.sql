-- Drop existing view if it exists
DROP VIEW IF EXISTS seminar_attendees;
DROP MATERIALIZED VIEW IF EXISTS seminar_attendees_cache;

-- Create function to get attendees for a seminar
CREATE OR REPLACE FUNCTION get_seminar_attendees(seminar_uuid uuid)
RETURNS TABLE (
  id uuid,
  first_name text,
  last_name text,
  avatar_url text,
  avatar_type text,
  company text,
  title text,
  bio text,
  location text,
  investment_focus text[],
  email text,
  phone text,
  package_name text,
  seminar_id uuid,
  booking_id uuid
) AS $$
BEGIN
  -- Check access
  IF NOT EXISTS (
    SELECT 1 FROM bookings
    WHERE seminar_id = seminar_uuid
    AND user_id = auth.uid()
    AND status = 'confirmed'
  ) AND NOT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email = 'aaron@abodekport.com'
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT DISTINCT ON (p.id)
    p.id,
    p.first_name,
    p.last_name,
    p.avatar_url,
    p.avatar_type,
    p.company,
    p.title,
    p.bio,
    p.location,
    p.investment_focus,
    b.email,
    b.phone,
    b.package_name,
    b.seminar_id,
    b.id as booking_id
  FROM bookings b
  JOIN profiles p ON b.user_id = p.id
  WHERE b.seminar_id = seminar_uuid
  AND b.status = 'confirmed'
  AND b.user_id != auth.uid()
  ORDER BY p.id, b.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create materialized view for caching
CREATE MATERIALIZED VIEW seminar_attendees_cache AS
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.avatar_url,
  p.avatar_type,
  p.company,
  p.title,
  p.bio,
  p.location,
  p.investment_focus,
  b.email,
  b.phone,
  b.package_name,
  b.seminar_id,
  b.id as booking_id
FROM bookings b
JOIN profiles p ON b.user_id = p.id
WHERE b.status = 'confirmed';

-- Create unique index for the materialized view
CREATE UNIQUE INDEX seminar_attendees_cache_idx ON seminar_attendees_cache(id, seminar_id);

-- Create function to refresh the cache
CREATE OR REPLACE FUNCTION refresh_attendees_cache()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY seminar_attendees_cache;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh cache
CREATE TRIGGER refresh_attendees_cache_trigger
AFTER INSERT OR UPDATE OR DELETE ON bookings
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_attendees_cache();

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_seminar_attendees TO authenticated;