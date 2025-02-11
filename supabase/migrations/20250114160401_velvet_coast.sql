-- Drop existing function
DROP FUNCTION IF EXISTS get_seminar_attendees;

-- Create improved function with unambiguous column references
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
    SELECT 1 FROM bookings b
    WHERE b.seminar_id = seminar_uuid
    AND b.user_id = auth.uid()
    AND b.status = 'confirmed'
  ) AND NOT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email = 'aaron@abodekport.com'
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  WITH filtered_bookings AS (
    SELECT DISTINCT ON (b.user_id)
      b.id as booking_id,
      b.user_id,
      b.email,
      b.phone,
      b.package_name,
      b.seminar_id
    FROM bookings b
    WHERE b.seminar_id = seminar_uuid
    AND b.status = 'confirmed'
    AND b.user_id != auth.uid()
    ORDER BY b.user_id, b.created_at DESC
  )
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
    fb.email,
    fb.phone,
    fb.package_name,
    fb.seminar_id,
    fb.booking_id
  FROM filtered_bookings fb
  JOIN profiles p ON fb.user_id = p.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_seminar_attendees TO authenticated;

-- Refresh the materialized view to ensure it's up to date
REFRESH MATERIALIZED VIEW CONCURRENTLY seminar_attendees_cache;