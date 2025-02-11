import { useState } from 'react';
import { supabase, withRetry } from '../supabase';
import { RoomType } from '../types/hotels';

export function useRoomTypeManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addRoomType = async (data: Omit<RoomType, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: supabaseError } = await withRetry(() =>
        supabase
          .from('room_types')
          .insert(data)
          .select()
          .single()
      );

      if (supabaseError) throw supabaseError;
    } catch (err) {
      console.error('Error adding room type:', err);
      setError(err instanceof Error ? err : new Error('Failed to add room type'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRoomType = async (id: string, data: Partial<RoomType>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: supabaseError } = await withRetry(() =>
        supabase
          .from('room_types')
          .update(data)
          .eq('id', id)
          .select()
          .single()
      );

      if (supabaseError) throw supabaseError;
    } catch (err) {
      console.error('Error updating room type:', err);
      setError(err instanceof Error ? err : new Error('Failed to update room type'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRoomType = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: supabaseError } = await withRetry(() =>
        supabase
          .from('room_types')
          .delete()
          .eq('id', id)
      );

      if (supabaseError) throw supabaseError;
    } catch (err) {
      console.error('Error deleting room type:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete room type'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addRoomType,
    updateRoomType,
    deleteRoomType,
    isLoading,
    error
  };
}