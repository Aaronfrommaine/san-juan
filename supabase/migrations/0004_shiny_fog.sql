/*
  # Fix Seminar RLS Policies
  
  1. Changes
    - Add RLS policies for admin users to manage seminars
    - Keep existing public read access for upcoming seminars
    
  2. Security
    - Admins can perform all CRUD operations
    - Public users can only read upcoming seminars
*/

-- Allow admin users to perform all operations on seminars
CREATE POLICY "Admins can manage all seminars"
  ON seminars
  FOR ALL
  TO authenticated
  USING (auth.email() IN ('aaron@abodekport.com'))
  WITH CHECK (auth.email() IN ('aaron@abodekport.com'));

-- Update the existing public read policy to use OR with admin check
DROP POLICY IF EXISTS "Anyone can view upcoming seminars" ON seminars;
CREATE POLICY "Anyone can view upcoming seminars"
  ON seminars
  FOR SELECT
  USING (
    status = 'upcoming' OR 
    (auth.email() IN ('aaron@abodekport.com'))
  );