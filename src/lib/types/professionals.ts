export interface Professional {
  id: string;
  name: string;
  title: string;
  company: string;
  type: 'attorney' | 'accountant' | 'bookkeeper' | 'developer' | 'realtor' | 'contractor';
  description: string;
  email: string;
  phone: string;
  website?: string;
  image: string;
  specialties: string[];
}