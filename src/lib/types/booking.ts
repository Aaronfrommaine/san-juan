export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  investmentGoals: string;
  seminarId: string;
  package: string;
  
  includeSpouse: boolean;
  spouse?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface Booking {
  id: string;
  seminar: {
    id: string;
    start_date: string;
    end_date: string;
    location: string;
  };
  price: number;
  includeSpouse: boolean;
  spouseDetails?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}