/*
  # Update package type constraints

  1. Changes
    - Add check constraint to ensure valid package types
    - Set default value for any NULL package types
    - No column creation since it already exists

  2. Security
    - No changes to RLS policies needed
*/

-- Add check constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'itinerary_items_package_type_check'
  ) THEN
    ALTER TABLE itinerary_items 
      ADD CONSTRAINT itinerary_items_package_type_check
      CHECK (package_type IN ('standard', 'vip', 'elite'));
  END IF;
END $$;

-- Set default value for any NULL package types
UPDATE itinerary_items 
SET package_type = 'standard' 
WHERE package_type IS NULL;

-- Ensure the column is NOT NULL
ALTER TABLE itinerary_items 
  ALTER COLUMN package_type SET NOT NULL,
  ALTER COLUMN package_type SET DEFAULT 'standard';