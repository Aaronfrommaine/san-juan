import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { Database } from '../database.types';

type Seminar = Database['public']['Tables']['seminars']['Row'];

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 5000; // 5 seconds

export function useNextSeminar() {
  const [nextSeminar, setNextSeminar] = useState<Seminar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchNextSeminar = useCallback(async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error: supabaseError } = await supabase
        .from('seminars')
        .select('*')
        .eq('status', 'upcoming')
        .gte('start_date', today.toISOString())
        .order('start_date', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (supabaseError) throw supabaseError;
      
      setNextSeminar(data);
      setError(null);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('Error fetching next seminar:', err);
      
      // If we haven't exceeded max retries, schedule another attempt
      if (retryCount < MAX_RETRIES) {
        const delay = Math.min(
          INITIAL_RETRY_DELAY * Math.pow(2, retryCount),
          MAX_RETRY_DELAY
        );
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchNextSeminar();
        }, delay);
      } else {
        setError(err instanceof Error ? err : new Error('Failed to fetch next seminar'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;

    const initFetch = async () => {
      if (!mounted) return;
      await fetchNextSeminar();
    };

    initFetch();

    // Subscribe to changes
    const subscription = supabase
      .channel('seminars')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'seminars'
      }, () => {
        if (mounted) {
          fetchNextSeminar();
        }
      })
      .subscribe();

    return () => {
      mounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      subscription.unsubscribe();
    };
  }, [fetchNextSeminar]);

  const retry = useCallback(() => {
    setIsLoading(true);
    setRetryCount(0);
    setError(null);
    fetchNextSeminar();
  }, [fetchNextSeminar]);

  return { 
    nextSeminar, 
    isLoading, 
    error,
    retry
  };
}