-- First, clean up any duplicate badges
DELETE FROM badges a USING badges b
WHERE a.id > b.id 
AND a.name = b.name;

-- Then add a unique constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'badges_name_key'
  ) THEN
    ALTER TABLE badges 
      ADD CONSTRAINT badges_name_key 
      UNIQUE (name);
  END IF;
END $$;

-- Update existing badges with fixed UUIDs
UPDATE badges 
SET id = 'b0c24c77-9e1f-4e9d-a6c9-481d98227d93'
WHERE name = 'Travel Ready'
AND id != 'b0c24c77-9e1f-4e9d-a6c9-481d98227d93';

UPDATE badges 
SET id = 'd7a9c2b1-3e8f-4d2a-b5c8-372d98116e82'
WHERE name = 'Seminar Host'
AND id != 'd7a9c2b1-3e8f-4d2a-b5c8-372d98116e82';