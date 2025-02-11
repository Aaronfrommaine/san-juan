import { useState } from 'react';
import { supabase } from '../supabase';
import { Database } from '../database.types';

type Seminar = Database['public']['Tables']['seminars']['Row'];

export function useSeminarManagement() {
  const [isLoading, setIsLoading] = useState(false);

  const updateSeminar = async (id: string, updates: Partial<Seminar>) => {
    setIsLoading(true);
    try {
      // Validate spots remaining doesn't exceed total spots
      if (updates.spots_remaining && updates.total_spots && 
          updates.spots_remaining > updates.total_spots) {
        throw new Error('Spots remaining cannot exceed total spots');
      }

      // Format dates
      const formattedUpdates = {
        ...updates,
        start_date: updates.start_date ? new Date(updates.start_date).toISOString().split('T')[0] : undefined,
        end_date: updates.end_date ? new Date(updates.end_date).toISOString().split('T')[0] : undefined,
        // Remove status from updates as it's handled by the database trigger
        status: undefined
      };

      const { error } = await supabase
        .from('seminars')
        .update(formattedUpdates)
        .eq('id', id);

      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSeminar = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('seminars')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateSeminar,
    deleteSeminar,
    isLoading
  };
}