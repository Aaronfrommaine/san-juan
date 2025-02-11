import { useState } from 'react';
import { supabase } from '../supabase';
import { RoomAssignment } from '../types/hotels';

interface AssignRoomParams {
  bookingId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
}

export function useRoomAssignments() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getRoomAssignment = async (bookingId: string) => {
    try {
      const { data, error } = await supabase
        .from('room_assignments')
        .select(`
          *,
          rooms (
            room_number,
            floor,
            room_types (
              name,
              description,
              package_level,
              amenities
            )
          )
        `)
        .eq('booking_id', bookingId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (err) {
      console.error('Error fetching room assignment:', err);
      return null;
    }
  };

  const assignRoom = async ({ bookingId, roomId, checkInDate, checkOutDate }: AssignRoomParams) => {
    setIsLoading(true);
    setError(null);

    try {
      // First check if room is available for these dates
      const { data: existingAssignments } = await supabase
        .from('room_assignments')
        .select('*')
        .eq('room_id', roomId)
        .or(`check_in_date,lte,${checkOutDate},check_out_date,gte,${checkInDate}`);

      if (existingAssignments?.length) {
        throw new Error('Room is not available for these dates');
      }

      // Create room assignment
      const { data, error } = await supabase
        .from('room_assignments')
        .insert({
          room_id: roomId,
          booking_id: bookingId,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          status: 'confirmed'
        })
        .select()
        .single();

      if (error) throw error;

      // Update room status
      await supabase
        .from('rooms')
        .update({ status: 'occupied' })
        .eq('id', roomId);

      return data;
    } catch (err) {
      console.error('Error assigning room:', err);
      setError(err instanceof Error ? err : new Error('Failed to assign room'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getRoomAssignment,
    assignRoom,
    isLoading,
    error
  };
}