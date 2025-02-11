-- Add host role to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_host boolean DEFAULT false;

-- Create host assignments table
CREATE TABLE IF NOT EXISTS host_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seminar_id uuid REFERENCES seminars(id) ON DELETE CASCADE,
  host_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(seminar_id, host_id)
);

-- Enable RLS
ALTER TABLE host_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view host assignments"
  ON host_assignments FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage host assignments"
  ON host_assignments FOR ALL
  USING (auth.email() IN ('aaron@abodekport.com'))
  WITH CHECK (auth.email() IN ('aaron@abodekport.com'));

-- Update admin profile as host
UPDATE profiles 
SET is_host = true 
WHERE id IN (
  SELECT id 
  FROM auth.users 
  WHERE email = 'aaron@abodekport.com'
);