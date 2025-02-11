import { Property, Attraction } from './types';

export const properties: Property[] = [
  {
    id: 'venue-1',
    type: 'venue',
    name: 'Córcega Beach Resort',
    description: 'Your luxury beachfront accommodation during the seminar.',
    price: 0,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80',
    coordinates: { lat: 18.3489, lng: -67.2505 },
    features: [
      'Beachfront location',
      'Private balconies',
      'Resort-style pool',
      'Full-service spa',
      'Conference facilities'
    ]
  },
  {
    id: 'property-1',
    type: 'property',
    name: 'Rincón Beachfront Villa',
    description: 'Prime investment opportunity with direct beach access.',
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80',
    coordinates: { lat: 18.3521, lng: -67.2598 },
    features: [
      '5 bedrooms, 4 bathrooms',
      'Infinity pool',
      'Smart home technology',
      'Rental license included',
      'Recently renovated'
    ]
  },
  {
    id: 'property-2',
    type: 'property',
    name: 'Marina View Development',
    description: 'Pre-construction opportunity in upcoming marina development.',
    price: 750000,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80',
    coordinates: { lat: 18.3456, lng: -67.2512 },
    features: [
      'Pre-construction pricing',
      'Marina slip included',
      'Rental program available',
      'Completion in 2025',
      'Financing options'
    ],
    featured: true
  }
];

export const attractions: Attraction[] = [
  {
    id: 'attraction-1',
    type: 'attraction',
    name: 'Rincón Lighthouse',
    description: 'Historic lighthouse with panoramic views.',
    image: 'https://images.unsplash.com/photo-1566402441483-5b3ea0955178?auto=format&fit=crop&q=80',
    coordinates: { lat: 18.3478, lng: -67.2542 },
    website: 'https://www.discoverpuertorico.com/profile/el-faro-de-rincon/8216'
  },
  {
    id: 'attraction-2',
    type: 'attraction',
    name: 'Steps Beach',
    description: 'Famous snorkeling spot with vibrant marine life.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80',
    coordinates: { lat: 18.3498, lng: -67.2632 },
    website: 'https://www.discoverpuertorico.com/profile/steps-beach/7621'
  },
  {
    id: 'attraction-3',
    type: 'attraction',
    name: 'La Copa Llena',
    description: 'Upscale oceanfront restaurant with local cuisine.',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80',
    coordinates: { lat: 18.3467, lng: -67.2489 },
    website: 'https://www.lacopallena.com'
  }
];