import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { ItineraryItem } from '../types/itinerary';

export function useItineraryItems(seminarId: string) {
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchItems() {
      try {
        const { data, error } = await supabase
          .from('itinerary_items')
          .select('*')
          .eq('seminar_id', seminarId)
          .order('day_number')
          .order('start_time');

        if (error) throw error;
        
        if (isMounted) {
          setItems(data || []);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching itinerary items:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch itinerary items'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (seminarId) {
      setIsLoading(true);
      fetchItems();
    }

    return () => {
      isMounted = false;
    };
  }, [seminarId]);

  const addItem = async (item: Omit<ItineraryItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('itinerary_items')
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      setItems(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error adding itinerary item:', err);
      throw err;
    }
  };

  const updateItem = async (id: string, updates: Partial<ItineraryItem>) => {
    try {
      const { data, error } = await supabase
        .from('itinerary_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setItems(prev => prev.map(item => item.id === id ? data : item));
      return data;
    } catch (err) {
      console.error('Error updating itinerary item:', err);
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('itinerary_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting itinerary item:', err);
      throw err;
    }
  };

  return {
    items,
    isLoading,
    error,
    addItem,
    updateItem,
    deleteItem
  };
}