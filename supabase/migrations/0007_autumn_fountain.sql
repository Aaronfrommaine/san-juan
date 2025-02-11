/*
  # Add package type to itinerary items

  1. Changes
    - Add package_type column to itinerary_items table
    - Add check constraint to ensure valid package types
    - Set default package type to 'standard'
    - Update existing rows to have standard package type
*/

-- Add package_type column with check constraint
ALTER TABLE itinerary_items 
  ADD COLUMN package_type text NOT NULL DEFAULT 'standard'
  CHECK (package_type IN ('standard', 'vip', 'elite'));

-- Update existing rows to have standard package type
UPDATE itinerary_items SET package_type = 'standard' WHERE package_type IS NULL;