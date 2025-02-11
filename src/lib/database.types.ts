export interface Database {
  public: {
    Tables: {
      seminars: {
        Row: {
          id: string;
          start_date: string;
          end_date: string;
          location: string;
          total_spots: number;
          spots_remaining: number;
          status: 'upcoming' | 'in-progress' | 'completed';
          created_at: string;
        };
        Insert: {
          id?: string;
          start_date: string;
          end_date: string;
          location: string;
          total_spots: number;
          spots_remaining?: number;
          status?: 'upcoming' | 'in-progress' | 'completed';
          created_at?: string;
        };
        Update: {
          id?: string;
          start_date?: string;
          end_date?: string;
          location?: string;
          total_spots?: number;
          spots_remaining?: number;
          status?: 'upcoming' | 'in-progress' | 'completed';
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          seminar_id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          company: string | null;
          investment_goals: string;
          package_name: string;
          status: 'pending' | 'confirmed' | 'cancelled';
          created_at: string;
        };
        Insert: {
          id?: string;
          seminar_id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          company?: string | null;
          investment_goals: string;
          package_name: string;
          status?: 'pending' | 'confirmed' | 'cancelled';
          created_at?: string;
        };
        Update: {
          id?: string;
          seminar_id?: string;
          user_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          company?: string | null;
          investment_goals?: string;
          package_name?: string;
          status?: 'pending' | 'confirmed' | 'cancelled';
          created_at?: string;
        };
      };
    };
  };
}