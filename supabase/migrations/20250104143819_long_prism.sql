-- Create function to update spots remaining
CREATE OR REPLACE FUNCTION update_seminar_spots()
RETURNS TRIGGER AS $$
BEGIN
  -- For new bookings
  IF TG_OP = 'INSERT' THEN
    -- Decrement spots_remaining
    UPDATE seminars
    SET spots_remaining = spots_remaining - 1
    WHERE id = NEW.seminar_id
    AND spots_remaining > 0;
    
    -- Check if update was successful
    IF NOT FOUND OR NOT EXISTS (
      SELECT 1 FROM seminars
      WHERE id = NEW.seminar_id
      AND spots_remaining >= 0
    ) THEN
      RAISE EXCEPTION 'No spots remaining for this seminar';
    END IF;
  
  -- For cancelled bookings
  ELSIF TG_OP = 'UPDATE' AND OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
    UPDATE seminars
    SET spots_remaining = spots_remaining + 1
    WHERE id = NEW.seminar_id
    AND spots_remaining < total_spots;
  
  -- For deleted bookings
  ELSIF TG_OP = 'DELETE' AND OLD.status != 'cancelled' THEN
    UPDATE seminars
    SET spots_remaining = spots_remaining + 1
    WHERE id = OLD.seminar_id
    AND spots_remaining < total_spots;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_seminar_spots_trigger ON bookings;
CREATE TRIGGER update_seminar_spots_trigger
  AFTER INSERT OR UPDATE OF status OR DELETE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_seminar_spots();

-- Reset spots_remaining for all seminars based on actual bookings
UPDATE seminars s
SET spots_remaining = s.total_spots - (
  SELECT COUNT(*)
  FROM bookings b
  WHERE b.seminar_id = s.id
  AND b.status != 'cancelled'
);