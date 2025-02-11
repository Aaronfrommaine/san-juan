-- Create function to fix spots remaining
CREATE OR REPLACE FUNCTION fix_seminar_spots()
RETURNS void AS $$
DECLARE
  seminar_record RECORD;
BEGIN
  FOR seminar_record IN 
    SELECT 
      s.id,
      s.total_spots,
      s.spots_remaining,
      COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as actual_bookings
    FROM seminars s
    LEFT JOIN bookings b ON s.id = b.seminar_id
    GROUP BY s.id, s.total_spots, s.spots_remaining
  LOOP
    -- Update spots_remaining to be correct
    UPDATE seminars
    SET spots_remaining = seminar_record.total_spots - seminar_record.actual_bookings
    WHERE id = seminar_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to clean up duplicate bookings
CREATE OR REPLACE FUNCTION clean_duplicate_bookings()
RETURNS void AS $$
BEGIN
  -- Keep only the most recent confirmed booking for each user per seminar
  WITH duplicates AS (
    SELECT DISTINCT ON (user_id, seminar_id) 
      id,
      user_id,
      seminar_id,
      created_at,
      status
    FROM bookings
    WHERE status = 'confirmed'
    ORDER BY user_id, seminar_id, created_at DESC
  )
  UPDATE bookings b
  SET status = 'cancelled'
  WHERE status = 'confirmed'
  AND NOT EXISTS (
    SELECT 1 FROM duplicates d
    WHERE d.id = b.id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to prevent duplicate confirmed bookings
CREATE OR REPLACE FUNCTION prevent_duplicate_bookings()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND EXISTS (
    SELECT 1 FROM bookings
    WHERE user_id = NEW.user_id
    AND seminar_id = NEW.seminar_id
    AND status = 'confirmed'
    AND id != NEW.id
  ) THEN
    RAISE EXCEPTION 'User already has a confirmed booking for this seminar';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS check_duplicate_bookings ON bookings;
CREATE TRIGGER check_duplicate_bookings
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION prevent_duplicate_bookings();

-- Run cleanup functions
SELECT clean_duplicate_bookings();
SELECT fix_seminar_spots();

-- Refresh materialized view
REFRESH MATERIALIZED VIEW CONCURRENTLY seminar_attendees_cache;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION fix_seminar_spots TO authenticated;
GRANT EXECUTE ON FUNCTION clean_duplicate_bookings TO authenticated;