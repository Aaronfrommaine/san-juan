import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../../components/auth/AuthProvider';

interface Attendee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string | null;
  title: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  avatar_type: string | null;
  package_name: string;
  booking_id: string;
}

export function useAttendees(seminarId?: string) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;

    async function fetchAttendees() {
      try {
        if (!user) throw new Error('Not authenticated');

        // If no seminarId provided, get the user's upcoming seminar
        let targetSeminarId = seminarId;
        if (!targetSeminarId) {
          const { data: bookings } = await supabase
            .from('bookings')
            .select('seminar_id')
            .eq('user_id', user.id)
            .eq('status', 'confirmed')
            .order('created_at', { ascending: false })
            .limit(1);

          if (bookings && bookings.length > 0) {
            targetSeminarId = bookings[0].seminar_id;
          }
        }

        if (!targetSeminarId) {
          setAttendees([]);
          return;
        }

        // Get attendees using the new function
        const { data, error } = await supabase
          .rpc('get_seminar_attendees', {
            seminar_uuid: targetSeminarId
          });

        if (error) throw error;
        
        if (mounted) {
          setAttendees(data || []);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching attendees:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch attendees'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    setIsLoading(true);
    fetchAttendees();

    return () => {
      mounted = false;
    };
  }, [seminarId, user]);

  const refetch = () => {
    setIsLoading(true);
    setError(null);
    if (user && seminarId) {
      supabase
        .rpc('get_seminar_attendees', {
          seminar_uuid: seminarId
        })
        .then(({ data, error }) => {
          if (error) throw error;
          setAttendees(data || []);
        })
        .catch(err => {
          console.error('Error refetching attendees:', err);
          setError(err instanceof Error ? err : new Error('Failed to refetch attendees'));
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return { attendees, isLoading, error, refetch };
}