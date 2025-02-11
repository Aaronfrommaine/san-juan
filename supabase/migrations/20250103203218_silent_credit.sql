/*
  # Fix Itinerary Item Validation

  1. Changes
    - Relaxes activity-specific constraints
    - Makes details optional for all activity types
    - Maintains data validation when details are provided

  2. Security
    - Maintains data integrity
    - Ensures proper validation when details exist
*/

-- Drop existing constraint
ALTER TABLE itinerary_items 
DROP CONSTRAINT IF EXISTS valid_activity_details;

-- Add new, more flexible constraint
ALTER TABLE itinerary_items
ADD CONSTRAINT valid_activity_details CHECK (
  CASE 
    -- For tour activities
    WHEN activity_type = 'tour' THEN
      tour_details IS NULL OR (
        jsonb_typeof(tour_details) = 'object' AND
        (tour_details->>'meeting_point' IS NOT NULL) AND
        (tour_details->>'transportation' IS NOT NULL) AND
        jsonb_typeof(tour_details->'what_to_bring') = 'array' AND
        jsonb_typeof(tour_details->'included_items') = 'array'
      )
    
    -- For meal activities
    WHEN activity_type = 'meal' THEN
      meal_details IS NULL OR (
        jsonb_typeof(meal_details) = 'object' AND
        jsonb_typeof(meal_details->'menu') = 'array'
      )
    
    -- For all other activities
    ELSE true
  END
);

-- Add helper functions for creating activity details
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

CREATE OR REPLACE FUNCTION create_meal_details(
  menu text[],
  dietary_options text[] DEFAULT NULL,
  special_notes text DEFAULT NULL
) RETURNS jsonb AS $$
BEGIN
  RETURN jsonb_build_object(
    'menu', to_jsonb(menu),
    'dietary_options', CASE WHEN dietary_options IS NULL THEN NULL ELSE to_jsonb(dietary_options) END,
    'special_notes', special_notes
  );
END;
$$ LANGUAGE plpgsql;