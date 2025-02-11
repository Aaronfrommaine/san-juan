import { Professional } from '../types/professionals';

export const professionals: Professional[] = [
  {
    id: '1',
    name: 'Maria Rodriguez',
    title: 'Real Estate Attorney',
    company: 'Rodriguez Legal Group',
    type: 'attorney',
    description: 'Specializing in Act 60 compliance and real estate transactions in Puerto Rico.',
    email: 'maria@example.com',
    phone: '+1 (787) 555-0101',
    website: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80',
    specialties: ['Act 60 Compliance', 'Real Estate Transactions', 'Property Law']
  },
  {
    id: '2',
    name: 'Carlos Mendez',
    title: 'CPA',
    company: 'Island Tax Advisors',
    type: 'accountant',
    description: 'Expert in Puerto Rico tax incentives and business structuring.',
    email: 'carlos@example.com',
    phone: '+1 (787) 555-0102',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80',
    specialties: ['Tax Planning', 'Business Structure', 'Compliance']
  },
  {
    id: '3',
    name: 'Ana Vazquez',
    title: 'Real Estate Agent',
    company: 'Luxury Island Properties',
    type: 'realtor',
    description: 'Specialized in luxury properties and investment opportunities.',
    email: 'ana@example.com',
    phone: '+1 (787) 555-0103',
    website: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80',
    specialties: ['Luxury Properties', 'Investment Properties', 'Beachfront Homes']
  },
  {
    id: '4',
    name: 'Roberto Santos',
    title: 'General Contractor',
    company: 'Island Builders',
    type: 'contractor',
    description: 'Expert in luxury renovations and new construction projects.',
    email: 'roberto@example.com',
    phone: '+1 (787) 555-0104',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80',
    specialties: ['Luxury Renovations', 'New Construction', 'Project Management']
  }
];