import { Package } from '../../components/booking/types';

export const plans: Package[] = [
  {
    name: 'Standard Package',
    price: 3500,
    spousePrice: 1500,
    features: [
      'Access to all sessions and workshops',
      '3-day intensive program',
      'Networking opportunities',
      'Welcome cocktail reception',
      'Property tours',
      'Expert panel discussions'
    ],
    spouseFeatures: [
      'Access to all sessions and workshops',
      'Shared networking opportunities',
      'Welcome cocktail reception',
      'Property tours'
    ]
  },
  {
    name: 'VIP Package',
    price: 5000,
    spousePrice: 1000,
    features: [
      'Everything in Standard Package',
      'Private property tours',
      'One-on-one expert sessions',
      'Exclusive networking dinner',
      'Extended 4th day mastermind',
      'Priority access to future events'
    ],
    spouseFeatures: [
      'Everything in Standard Package',
      'Shared private property tours',
      'Exclusive networking dinner',
      'Extended 4th day mastermind'
    ],
    highlighted: true
  },
  {
    name: 'Elite Package',
    price: 7500,
    spouseIncluded: true,
    features: [
      'Everything in VIP Package',
      'Luxury accommodation upgrade',
      'Private helicopter property tours',
      'Personal concierge service',
      'Direct introductions to top investors',
      'Lifetime mastermind membership',
      'Spouse/Partner included at no extra cost'
    ],
    elite: true
  }
];