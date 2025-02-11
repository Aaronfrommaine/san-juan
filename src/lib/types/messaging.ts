export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export interface Thread {
  id: string;
  participants: string[];
  created_at: string;
  updated_at: string;
  thread_messages?: Message[];
}