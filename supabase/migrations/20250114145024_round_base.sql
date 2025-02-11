-- Create diagnostic function to check attendee counts
CREATE OR REPLACE FUNCTION check_attendee_counts(seminar_uuid uuid)
RETURNS TABLE (
  total_bookings bigint,
  confirmed_bookings bigint,
  displayed_attendees bigint,
  spots_remaining integer,
  total_spots integer
) AS $$
BEGIN
  RETURN QUERY
  WITH booking_counts AS (
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed
    FROM bookings 
    WHERE seminar_id = seminar_uuid
  ),
  attendee_counts AS (
    SELECT COUNT(*) as displayed
    FROM (
      SELECT DISTINCT ON (b.user_id)
        b.user_id
      FROM bookings b
      JOIN profiles p ON b.user_id = p.id
      WHERE b.seminar_id = seminar_uuid
      AND b.status = 'confirmed'
      ORDER BY b.user_id, b.created_at DESC
    ) sub
  ),
  seminar_info AS (
    SELECT spots_remaining, total_spots
    FROM seminars
    WHERE id = seminar_uuid
  )
  SELECT 
    bc.total,
    bc.confirmed,
    ac.displayed,
    si.spots_remaining,
    si.total_spots
  FROM booking_counts bc
  CROSS JOIN attendee_counts ac
  CROSS JOIN seminar_info si;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION check_attendee_counts TO authenticated;

-- Add index to improve join performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_seminar_status 
ON bookings(user_id, seminar_id, status);

-- Refresh the materialized view to ensure it's up to date
REFRESH MATERIALIZED VIEW CONCURRENTLY seminar_attendees_cache;