import { useState } from 'react';
import { supabase, withRetry } from '../supabase';
import { Hotel } from '../types/hotels';

export function useHotelManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addHotel = async (data: Omit<Hotel, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: supabaseError } = await withRetry(() =>
        supabase
          .from('hotels')
          .insert(data)
          .select()
          .single()
      );

      if (supabaseError) throw supabaseError;
    } catch (err) {
      console.error('Error adding hotel:', err);
      setError(err instanceof Error ? err : new Error('Failed to add hotel'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateHotel = async (id: string, data: Partial<Hotel>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: supabaseError } = await withRetry(() =>
        supabase
          .from('hotels')
          .update(data)
          .eq('id', id)
          .select()
          .single()
      );

      if (supabaseError) throw supabaseError;
    } catch (err) {
      console.error('Error updating hotel:', err);
      setError(err instanceof Error ? err : new Error('Failed to update hotel'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHotel = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: supabaseError } = await withRetry(() =>
        supabase
          .from('hotels')
          .delete()
          .eq('id', id)
      );

      if (supabaseError) throw supabaseError;
    } catch (err) {
      console.error('Error deleting hotel:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete hotel'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addHotel,
    updateHotel,
    deleteHotel,
    isLoading,
    error
  };
}