/*
  # Seminar Status Management Function
  
  1. New Function
    - `update_seminar_status()`: Automatically updates seminar status based on dates
    
  2. Changes
    - Adds trigger to automatically update seminar status
    - Updates status to:
      - 'completed' for past seminars
      - 'in-progress' for current seminars
      - 'upcoming' for future seminars
*/

-- Create function to update seminar status
CREATE OR REPLACE FUNCTION update_seminar_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update status based on dates
  NEW.status := 
    CASE
      WHEN NEW.end_date < CURRENT_DATE THEN 'completed'
      WHEN NEW.start_date <= CURRENT_DATE AND NEW.end_date >= CURRENT_DATE THEN 'in-progress'
      ELSE 'upcoming'
    END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update status
DROP TRIGGER IF EXISTS update_seminar_status_trigger ON seminars;
CREATE TRIGGER update_seminar_status_trigger
  BEFORE INSERT OR UPDATE ON seminars
  FOR EACH ROW
  EXECUTE FUNCTION update_seminar_status();

-- Update existing seminars
UPDATE seminars SET start_date = start_date WHERE true;