-- Add spouse-related columns to bookings table
ALTER TABLE bookings
ADD COLUMN include_spouse boolean DEFAULT false,
ADD COLUMN spouse_first_name text,
ADD COLUMN spouse_last_name text,
ADD COLUMN spouse_email text,
ADD COLUMN spouse_price integer;

-- Update the get_package_price function to handle spouse pricing
CREATE OR REPLACE FUNCTION get_package_price(
  package_name text,
  include_spouse boolean DEFAULT false
)
RETURNS TABLE(base_price integer, spouse_price integer) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE
      WHEN package_name = 'Standard Package' THEN 3500
      WHEN package_name = 'VIP Package' THEN 5000
      WHEN package_name = 'Elite Package' THEN 7500
      ELSE 0
    END,
    CASE
      WHEN package_name = 'Standard Package' AND include_spouse THEN 1500
      WHEN package_name = 'VIP Package' AND include_spouse THEN 1000
      WHEN package_name = 'Elite Package' THEN 0
      ELSE 0
    END;
END;
$$ LANGUAGE plpgsql;

-- Update the booking price trigger
CREATE OR REPLACE FUNCTION set_booking_price()
RETURNS TRIGGER AS $$
DECLARE
  price_info record;
BEGIN
  -- Get base price and spouse price
  SELECT * INTO price_info
  FROM get_package_price(NEW.package_name, NEW.include_spouse);
  
  -- Set the prices
  NEW.price := price_info.base_price;
  NEW.spouse_price := price_info.spouse_price;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS set_booking_price_trigger ON bookings;
CREATE TRIGGER set_booking_price_trigger
  BEFORE INSERT OR UPDATE OF package_name, include_spouse ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_price();

-- Update existing bookings
UPDATE bookings
SET (price, spouse_price) = (
  SELECT base_price, spouse_price
  FROM get_package_price(package_name, include_spouse)
)
WHERE price IS NULL OR spouse_price IS NULL;