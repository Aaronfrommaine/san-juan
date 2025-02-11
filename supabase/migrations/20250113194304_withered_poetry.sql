-- Drop existing trigger
DROP TRIGGER IF EXISTS update_seminar_spots_trigger ON bookings;

-- Update the spots management function to be more robust
CREATE OR REPLACE FUNCTION update_seminar_spots()
RETURNS TRIGGER AS $$
DECLARE
  current_spots integer;
  total_spots integer;
BEGIN
  -- For new bookings
  IF TG_OP = 'INSERT' THEN
    -- Get current spots info
    SELECT spots_remaining, s.total_spots 
    INTO current_spots, total_spots
    FROM seminars s
    WHERE s.id = NEW.seminar_id
    FOR UPDATE;  -- Lock the row

    -- Check if spots are available
    IF current_spots <= 0 THEN
      RAISE EXCEPTION 'No spots remaining for this seminar';
    END IF;

    -- Decrement spots_remaining
    UPDATE seminars
    SET spots_remaining = current_spots - 1
    WHERE id = NEW.seminar_id;
  
  -- For cancelled bookings
  ELSIF TG_OP = 'UPDATE' AND OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
    -- Get current spots info
    SELECT spots_remaining, s.total_spots 
    INTO current_spots, total_spots
    FROM seminars s
    WHERE s.id = NEW.seminar_id
    FOR UPDATE;  -- Lock the row

    -- Only increment if we haven't reached total spots
    IF current_spots < total_spots THEN
      UPDATE seminars
      SET spots_remaining = current_spots + 1
      WHERE id = NEW.seminar_id;
    END IF;
  
  -- For deleted bookings
  ELSIF TG_OP = 'DELETE' AND OLD.status != 'cancelled' THEN
    -- Get current spots info
    SELECT spots_remaining, s.total_spots 
    INTO current_spots, total_spots
    FROM seminars s
    WHERE s.id = OLD.seminar_id
    FOR UPDATE;  -- Lock the row

    -- Only increment if we haven't reached total spots
    IF current_spots < total_spots THEN
      UPDATE seminars
      SET spots_remaining = current_spots + 1
      WHERE id = OLD.seminar_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER update_seminar_spots_trigger
  AFTER INSERT OR UPDATE OF status OR DELETE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_seminar_spots();

-- Add a function to check spots availability
CREATE OR REPLACE FUNCTION check_seminar_spots(seminar_uuid uuid)
RETURNS boolean AS $$
DECLARE
  spots_left integer;
BEGIN
  SELECT spots_remaining INTO spots_left
  FROM seminars
  WHERE id = seminar_uuid;

  RETURN spots_left > 0;
END;
$$ LANGUAGE plpgsql;

-- Update the AddAttendeeModal to check spots before adding