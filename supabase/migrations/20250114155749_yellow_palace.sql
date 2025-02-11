-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS generate_seminar_code CASCADE;
DROP FUNCTION IF EXISTS generate_attendee_code CASCADE;
DROP FUNCTION IF EXISTS handle_seminar_codes CASCADE;
DROP FUNCTION IF EXISTS handle_attendee_codes CASCADE;
DROP FUNCTION IF EXISTS get_seminar_details CASCADE;

-- Add unique seminar code column if it doesn't exist
ALTER TABLE seminars
ADD COLUMN IF NOT EXISTS seminar_code text UNIQUE,
ADD COLUMN IF NOT EXISTS attendee_count integer DEFAULT 0;

-- Create function to generate seminar code
CREATE OR REPLACE FUNCTION generate_seminar_code_v2(
  seminar_location text,
  seminar_date date
)
RETURNS text AS $$
DECLARE
  location_code text;
  year_code text;
  month_code text;
  sequence_num integer;
  final_code text;
BEGIN
  -- Get location code (first 3 letters)
  location_code := UPPER(LEFT(REGEXP_REPLACE(seminar_location, '[^a-zA-Z]', '', 'g'), 3));
  
  -- Get year and month codes
  year_code := TO_CHAR(seminar_date, 'YY');
  month_code := TO_CHAR(seminar_date, 'MM');
  
  -- Get sequence number for this location/year/month
  SELECT COALESCE(MAX(SUBSTRING(seminar_code FROM '\d+$')::integer), 0) + 1
  INTO sequence_num
  FROM seminars
  WHERE seminar_code LIKE location_code || year_code || month_code || '%';
  
  -- Combine all parts
  final_code := location_code || year_code || month_code || LPAD(sequence_num::text, 2, '0');
  
  RETURN final_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add attendee code to bookings if it doesn't exist
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS attendee_code text UNIQUE;

-- Create function to generate attendee code
CREATE OR REPLACE FUNCTION generate_attendee_code_v2(
  booking_seminar_id uuid
)
RETURNS text AS $$
DECLARE
  seminar_record record;
  new_attendee_count integer;
BEGIN
  -- Get seminar info and increment attendee count atomically
  UPDATE seminars
  SET attendee_count = attendee_count + 1
  WHERE id = booking_seminar_id
  RETURNING id, seminar_code, attendee_count INTO seminar_record;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Seminar not found';
  END IF;
  
  -- Return formatted attendee code
  RETURN seminar_record.seminar_code || '-' || LPAD(seminar_record.attendee_count::text, 3, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger functions with unique names
CREATE OR REPLACE FUNCTION handle_seminar_codes_v2()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.seminar_code IS NULL THEN
    NEW.seminar_code := generate_seminar_code_v2(NEW.location, NEW.start_date::date);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION handle_attendee_codes_v2()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND NEW.attendee_code IS NULL THEN
    NEW.attendee_code := generate_attendee_code_v2(NEW.seminar_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers with unique names
DROP TRIGGER IF EXISTS generate_seminar_code_v2 ON seminars;
CREATE TRIGGER generate_seminar_code_v2
  BEFORE INSERT ON seminars
  FOR EACH ROW
  EXECUTE FUNCTION handle_seminar_codes_v2();

DROP TRIGGER IF EXISTS generate_attendee_code_v2 ON bookings;
CREATE TRIGGER generate_attendee_code_v2
  BEFORE INSERT OR UPDATE OF status ON bookings
  FOR EACH ROW
  WHEN (NEW.status = 'confirmed' AND NEW.attendee_code IS NULL)
  EXECUTE FUNCTION handle_attendee_codes_v2();

-- Generate codes for existing records
DO $$
DECLARE
  seminar_record record;
  booking_record record;
  new_seminar_code text;
  new_attendee_code text;
  attendee_number integer;
BEGIN
  -- First generate seminar codes
  FOR seminar_record IN 
    SELECT * FROM seminars 
    WHERE seminar_code IS NULL 
    ORDER BY start_date
  LOOP
    new_seminar_code := generate_seminar_code_v2(
      seminar_record.location,
      seminar_record.start_date::date
    );
    
    UPDATE seminars
    SET seminar_code = new_seminar_code
    WHERE id = seminar_record.id;
  END LOOP;

  -- Then update attendee counts
  UPDATE seminars s
  SET attendee_count = (
    SELECT COUNT(*)
    FROM bookings b
    WHERE b.seminar_id = s.id
    AND b.status = 'confirmed'
  );

  -- Finally generate attendee codes
  FOR booking_record IN
    SELECT 
      b.id AS booking_id,
      b.seminar_id,
      s.seminar_code,
      ROW_NUMBER() OVER (
        PARTITION BY b.seminar_id 
        ORDER BY b.created_at
      ) AS attendee_num
    FROM bookings b
    JOIN seminars s ON b.seminar_id = s.id
    WHERE b.status = 'confirmed'
    AND b.attendee_code IS NULL
  LOOP
    new_attendee_code := booking_record.seminar_code || '-' || 
      LPAD(booking_record.attendee_num::text, 3, '0');
    
    UPDATE bookings
    SET attendee_code = new_attendee_code
    WHERE id = booking_record.booking_id;
  END LOOP;
END $$;

-- Create function to get seminar details with unique name
CREATE OR REPLACE FUNCTION get_seminar_details_v2(seminar_uuid uuid)
RETURNS TABLE (
  id uuid,
  seminar_code text,
  start_date timestamptz,
  end_date timestamptz,
  location text,
  total_spots integer,
  spots_remaining integer,
  status text,
  attendee_count integer,
  confirmed_attendees bigint,
  attendee_list jsonb
) AS $$
BEGIN
  RETURN QUERY
  WITH confirmed_bookings AS (
    SELECT 
      b.id,
      b.attendee_code,
      b.first_name,
      b.last_name,
      b.email,
      b.package_name
    FROM bookings b
    WHERE b.seminar_id = seminar_uuid
    AND b.status = 'confirmed'
  )
  SELECT 
    s.id,
    s.seminar_code,
    s.start_date,
    s.end_date,
    s.location,
    s.total_spots,
    s.spots_remaining,
    s.status,
    s.attendee_count,
    COUNT(cb.id)::bigint,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'attendee_code', cb.attendee_code,
          'first_name', cb.first_name,
          'last_name', cb.last_name,
          'email', cb.email,
          'package_name', cb.package_name
        )
      ) FILTER (WHERE cb.id IS NOT NULL),
      '[]'::jsonb
    ) as attendee_list
  FROM seminars s
  LEFT JOIN confirmed_bookings cb ON true
  WHERE s.id = seminar_uuid
  GROUP BY 
    s.id,
    s.seminar_code,
    s.start_date,
    s.end_date,
    s.location,
    s.total_spots,
    s.spots_remaining,
    s.status,
    s.attendee_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_seminar_status ON bookings(seminar_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_seminars_start_date ON seminars(start_date);
CREATE INDEX IF NOT EXISTS idx_seminars_seminar_code ON seminars(seminar_code);

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION generate_seminar_code_v2 TO authenticated;
GRANT EXECUTE ON FUNCTION generate_attendee_code_v2 TO authenticated;
GRANT EXECUTE ON FUNCTION get_seminar_details_v2 TO authenticated;