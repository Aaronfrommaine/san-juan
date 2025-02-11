-- Create a function to get package price
CREATE OR REPLACE FUNCTION get_package_price(package_name text)
RETURNS integer AS $$
BEGIN
  RETURN CASE
    WHEN package_name = 'Standard Package' THEN 3500
    WHEN package_name = 'VIP Package' THEN 5000
    WHEN package_name = 'Elite Package' THEN 7500
    ELSE 0
  END;
END;
$$ LANGUAGE plpgsql;

-- Add price column to bookings if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'price'
  ) THEN
    ALTER TABLE bookings ADD COLUMN price integer;
  END IF;
END $$;

-- Update existing bookings with correct prices
UPDATE bookings
SET price = get_package_price(package_name)
WHERE price IS NULL;

-- Add trigger to automatically set price on new bookings
CREATE OR REPLACE FUNCTION set_booking_price()
RETURNS TRIGGER AS $$
BEGIN
  NEW.price := get_package_price(NEW.package_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_price_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_price();