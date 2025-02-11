import { useState, useEffect } from 'react';
import { supabase, withRetry } from '../supabase';
import { Hotel, RoomType, Room } from '../types/hotels';

export function useHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      // Fetch hotels
      const { data: hotelsData, error: hotelsError } = await withRetry(() =>
        supabase
          .from('hotels')
          .select('*')
          .order('name')
      );

      if (hotelsError) throw hotelsError;

      // Fetch room types
      const { data: roomTypesData, error: roomTypesError } = await withRetry(() =>
        supabase
          .from('room_types')
          .select('*')
          .order('package_level', { ascending: false })
      );

      if (roomTypesError) throw roomTypesError;

      // Fetch rooms
      const { data: roomsData, error: roomsError } = await withRetry(() =>
        supabase
          .from('rooms')
          .select('*')
          .order('room_number')
      );

      if (roomsError) throw roomsError;

      setHotels(hotelsData || []);
      setRoomTypes(roomTypesData || []);
      setRooms(roomsData || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching hotel data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch hotel data'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe to changes
    const subscription = supabase
      .channel('hotel_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hotels' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_types' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, fetchData)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    hotels,
    roomTypes,
    rooms,
    isLoading,
    error,
    refetch: fetchData
  };
}