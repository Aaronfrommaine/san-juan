import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Database } from '../database.types';

type Seminar = Database['public']['Tables']['seminars']['Row'];

export function useSeminars() {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchSeminars() {
      try {
        const { data, error } = await supabase
          .from('seminars')
          .select('*')
          .order('start_date', { ascending: true });

        if (error) throw error;
        if (mounted) {
          setSeminars(data || []);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching seminars:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch seminars'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchSeminars();

    // Subscribe to changes
    const subscription = supabase
      .channel('seminars')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'seminars'
      }, () => {
        fetchSeminars();
      })
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { seminars, isLoading, error };
}