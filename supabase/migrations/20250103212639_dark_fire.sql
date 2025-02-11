-- Modify travel details to handle empty results better
CREATE OR REPLACE FUNCTION get_travel_details(user_uuid uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  airline text,
  flight_number text,
  arrival_time timestamptz,
  departure_time timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT td.id, td.user_id, td.airline, td.flight_number, td.arrival_time, td.departure_time
  FROM travel_details td
  WHERE td.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_travel_details TO authenticated;

-- Create view for easier access
CREATE OR REPLACE VIEW user_travel_details AS
SELECT *
FROM travel_details
WHERE user_id = auth.uid();

-- Grant access to view
GRANT SELECT ON user_travel_details TO authenticated;