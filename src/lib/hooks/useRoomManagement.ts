import { useState } from 'react';
import { supabase, withRetry } from '../supabase';
import { Room } from '../types/hotels';

export function useRoomManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addRoom = async (data: Omit<Room, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: supabaseError } = await withRetry(() =>
        supabase
          .from('rooms')
          .insert(data)
          .select()
          .single()
      );

      if (supabaseError) throw supabaseError;
    } catch (err) {
      console.error('Error adding room:', err);
      setError(err instanceof Error ? err : new Error('Failed to add room'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRoom = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: supabaseError } = await withRetry(() =>
        supabase
          .from('rooms')
          .delete()
          .eq('id', id)
      );

      if (supabaseError) throw supabaseError;
    } catch (err) {
      console.error('Error deleting room:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete room'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addRoom,
    deleteRoom,
    isLoading,
    error
  };
}