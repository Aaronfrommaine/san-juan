import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Member } from '../types/networking';

export function useMembers(seminarId: string) {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            first_name,
            last_name,
            email,
            phone,
            company
          `)
          .eq('seminar_id', seminarId)
          .eq('status', 'confirmed');

        if (error) throw error;

        setMembers(data.map(booking => ({
          id: booking.id,
          firstName: booking.first_name,
          lastName: booking.last_name,
          email: booking.email,
          phone: booking.phone,
          company: booking.company || ''
        })));
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMembers();
  }, [seminarId]);

  return { members, isLoading };
}