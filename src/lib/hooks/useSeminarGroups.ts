import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { SeminarGroup } from '../types/networking';

export function useSeminarGroups() {
  const [groups, setGroups] = useState<SeminarGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Get user's booked seminars
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            seminar:seminar_id (
              id,
              start_date,
              end_date,
              location,
              spots_remaining,
              total_spots
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'confirmed');

        if (error) throw error;

        const seminarGroups = data.map(booking => ({
          id: booking.seminar.id,
          startDate: booking.seminar.start_date,
          endDate: booking.seminar.end_date,
          location: booking.seminar.location,
          memberCount: booking.seminar.total_spots - booking.seminar.spots_remaining
        }));

        setGroups(seminarGroups);
        setError(null);
      } catch (err) {
        console.error('Error fetching seminar groups:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch groups'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchGroups();
  }, []);

  return { groups, isLoading, error };
}