-- Drop existing view if it exists
DROP VIEW IF EXISTS seminar_attendees;

-- Create a secure function to check seminar access
CREATE OR REPLACE FUNCTION check_seminar_access(seminar_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN (
    -- Admin access
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'aaron@abodekport.com'
    )
    OR
    -- User can see attendees in their confirmed seminars
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.seminar_id = seminar_uuid
      AND bookings.user_id = auth.uid()
      AND bookings.status = 'confirmed'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a secure function to get seminar attendees
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
  IF NOT check_seminar_access(seminar_uuid) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT DISTINCT ON (b.user_id)
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
  ORDER BY b.user_id, b.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a materialized view for better performance
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

-- Create index for better performance
CREATE UNIQUE INDEX seminar_attendees_cache_idx ON seminar_attendees_cache(id, seminar_id);

-- Create function to refresh the cache
CREATE OR REPLACE FUNCTION refresh_seminar_attendees_cache()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY seminar_attendees_cache;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh cache when bookings change
CREATE TRIGGER refresh_seminar_attendees_cache_trigger
AFTER INSERT OR UPDATE OR DELETE ON bookings
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_seminar_attendees_cache();

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_seminar_attendees TO authenticated;
GRANT EXECUTE ON FUNCTION check_seminar_access TO authenticated;