-- Create professionals table
CREATE TABLE IF NOT EXISTS professionals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  type text NOT NULL CHECK (type IN ('attorney', 'accountant', 'bookkeeper', 'developer', 'realtor', 'contractor')),
  description text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  website text,
  image text NOT NULL,
  specialties text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view professionals"
  ON professionals FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage professionals"
  ON professionals FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Insert initial professionals
INSERT INTO professionals (name, title, company, type, description, email, phone, website, image, specialties)
VALUES
  (
    'Maria Rodriguez',
    'Real Estate Attorney',
    'Rodriguez Legal Group',
    'attorney',
    'Specializing in Act 60 compliance and real estate transactions in Puerto Rico.',
    'maria@example.com',
    '+1 (787) 555-0101',
    'https://example.com',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80',
    ARRAY['Act 60 Compliance', 'Real Estate Transactions', 'Property Law']
  ),
  (
    'Carlos Mendez',
    'CPA',
    'Island Tax Advisors',
    'accountant',
    'Expert in Puerto Rico tax incentives and business structuring.',
    'carlos@example.com',
    '+1 (787) 555-0102',
    NULL,
    'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80',
    ARRAY['Tax Planning', 'Business Structure', 'Compliance']
  ),
  (
    'Ana Vazquez',
    'Real Estate Agent',
    'Luxury Island Properties',
    'realtor',
    'Specialized in luxury properties and investment opportunities.',
    'ana@example.com',
    '+1 (787) 555-0103',
    'https://example.com',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80',
    ARRAY['Luxury Properties', 'Investment Properties', 'Beachfront Homes']
  ),
  (
    'Roberto Santos',
    'General Contractor',
    'Island Builders',
    'contractor',
    'Expert in luxury renovations and new construction projects.',
    'roberto@example.com',
    '+1 (787) 555-0104',
    NULL,
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80',
    ARRAY['Luxury Renovations', 'New Construction', 'Project Management']
  );

-- Create indexes for better performance
CREATE INDEX idx_professionals_type ON professionals(type);
CREATE INDEX idx_professionals_specialties ON professionals USING gin(specialties);