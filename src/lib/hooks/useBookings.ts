import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Database } from '../database.types';

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  seminar: {
    start_date: string;
    end_date: string;
    location: string;
  };
};

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchBookings() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        if (!user) throw new Error('Not authenticated');

        const { data, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            seminar:seminar_id (
              start_date,
              end_date,
              location
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (bookingsError) throw bookingsError;
        
        if (isMounted) {
          setBookings(data || []);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch bookings'));
          setBookings([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  return { bookings, isLoading, error };
}