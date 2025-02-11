import { Badge } from '../types/profile';

export const badges: Badge[] = [
  {
    id: 'investor-avatar',
    name: 'Investor Avatar',
    description: 'Completed the investor questionnaire and discovered your investment style',
    icon_url: '/badges/avatar.svg',
    category: 'onboarding'
  },
  {
    id: 'seminar-graduate',
    name: 'Seminar Graduate',
    description: 'Successfully completed the on-island investment seminar',
    icon_url: '/badges/graduate.svg',
    category: 'education'
  },
  {
    id: 'first-investment',
    name: 'First Investment',
    description: 'Made your first property investment in Puerto Rico',
    icon_url: '/badges/investment.svg',
    category: 'achievement'
  },
  {
    id: 'network-builder',
    name: 'Network Builder',
    description: 'Connected with 10+ fellow investors',
    icon_url: '/badges/network.svg',
    category: 'community'
  },
  {
    id: 'local-expert',
    name: 'Local Expert',
    description: 'Contributed valuable insights to the community',
    icon_url: '/badges/expert.svg',
    category: 'contribution'
  }
];