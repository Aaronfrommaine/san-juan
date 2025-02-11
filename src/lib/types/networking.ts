export interface SeminarGroup {
  id: string;
  startDate: string;
  endDate: string;
  location: string;
  memberCount: number;
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
}