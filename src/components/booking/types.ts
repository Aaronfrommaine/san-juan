export interface Package {
  name: string;
  price: number;
  features: string[];
  highlighted?: boolean;
  elite?: boolean;
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  investmentGoals: string;
  seminarId: string;
  package: string;
}