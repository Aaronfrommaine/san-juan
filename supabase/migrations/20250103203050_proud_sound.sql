/*
  # Fix Itinerary Item Constraints

  1. Changes
    - Removes overly strict tour_details constraint
    - Updates validation to be activity-type specific
    - Adds proper JSON schema validation

  2. Security
    - Maintains data integrity
    - Ensures proper validation
*/

-- Drop existing constraints
ALTER TABLE itinerary_items 
DROP CONSTRAINT IF EXISTS valid_tour_details,
DROP CONSTRAINT IF EXISTS valid_meal_details;

-- Add new constraints with proper validation
ALTER TABLE itinerary_items
ADD CONSTRAINT valid_activity_details CHECK (
  CASE activity_type
    WHEN 'tour' THEN
      CASE 
        WHEN tour_details IS NULL THEN false
        WHEN jsonb_typeof(tour_details) != 'object' THEN false
        WHEN NOT (
          tour_details ? 'meeting_point' AND
          tour_details ? 'transportation' AND
          tour_details ? 'what_to_bring' AND
          tour_details ? 'included_items' AND
          jsonb_typeof(tour_details->'what_to_bring') = 'array' AND
          jsonb_typeof(tour_details->'included_items') = 'array'
        ) THEN false
        ELSE true
      END
    WHEN 'meal' THEN
      CASE
        WHEN meal_details IS NULL THEN false
        WHEN jsonb_typeof(meal_details) != 'object' THEN false
        WHEN NOT (
          meal_details ? 'menu' AND
          jsonb_typeof(meal_details->'menu') = 'array'
        ) THEN false
        ELSE true
      END
    ELSE
      tour_details IS NULL AND meal_details IS NULL
  END
);

-- Add helper function for creating tour details
CREATE OR REPLACE FUNCTION create_tour_details(
  meeting_point text,
  transportation text,
  what_to_bring text[],
  included_items text[]
) RETURNS jsonb AS $$
BEGIN
  RETURN jsonb_build_object(
    'meeting_point', meeting_point,
    'transportation', transportation,
    'what_to_bring', to_jsonb(what_to_bring),
    'included_items', to_jsonb(included_items)
  );
END;
$$ LANGUAGE plpgsql;