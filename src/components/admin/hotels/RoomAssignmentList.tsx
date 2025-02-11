import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, Home, Package } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useSeminars } from '../../../lib/hooks/useSeminars';

interface RoomAssignmentListProps {
  hotelId: string;
}

interface ExtendedRoomAssignment {
  id: string;
  room_number: string;
  guest_name: string;
  package_name: string;
  check_in_date: string;
  check_out_date: string;
  status: string;
  room_type: string;
  seminar_id: string;
}

export default function RoomAssignmentList({ hotelId }: RoomAssignmentListProps) {
  const [assignments, setAssignments] = useState<ExtendedRoomAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { seminars } = useSeminars();
  const [selectedSeminar, setSelectedSeminar] = useState<string | null>(null);

  useEffect(() => {
    // Set the first upcoming seminar as default
    const upcomingSeminar = seminars.find(s => s.status === 'upcoming');
    if (upcomingSeminar) {
      setSelectedSeminar(upcomingSeminar.id);
    }
  }, [seminars]);

  useEffect(() => {
    async function fetchAssignments() {
      if (!selectedSeminar) return;

      try {
        const { data, error } = await supabase
          .from('room_assignments')
          .select(`
            *,
            rooms!inner (
              room_number,
              hotel_id,
              room_types (
                name,
                package_level
              )
            ),
            bookings!inner (
              first_name,
              last_name,
              package_name,
              seminar_id
            )
          `)
          .eq('rooms.hotel_id', hotelId)
          .eq('bookings.seminar_id', selectedSeminar)
          .order('check_in_date', { ascending: true });

        if (error) throw error;

        const formattedAssignments = data.map(assignment => ({
          id: assignment.id,
          room_number: assignment.rooms.room_number,
          guest_name: `${assignment.bookings.first_name} ${assignment.bookings.last_name}`,
          package_name: assignment.bookings.package_name,
          check_in_date: assignment.check_in_date,
          check_out_date: assignment.check_out_date,
          status: assignment.status,
          room_type: assignment.rooms.room_types.name,
          seminar_id: assignment.bookings.seminar_id
        }));

        setAssignments(formattedAssignments);
      } catch (error) {
        console.error('Error fetching room assignments:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAssignments();
  }, [hotelId, selectedSeminar]);

  if (isLoading) {
    return <div>Loading assignments...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Seminar selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Seminar
        </label>
        <select
          value={selectedSeminar || ''}
          onChange={(e) => setSelectedSeminar(e.target.value)}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
        >
          {seminars.map((seminar) => (
            <option key={seminar.id} value={seminar.id}>
              {new Date(seminar.start_date).toLocaleDateString()} - {seminar.location}
            </option>
          ))}
        </select>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          No room assignments found for this seminar.
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">{assignment.guest_name}</span>
                </div>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 rounded-full">
                  {assignment.package_name}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Home className="h-4 w-4" />
                  <span>Room {assignment.room_number} - {assignment.room_type}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(assignment.check_in_date).toLocaleDateString()} - 
                    {new Date(assignment.check_out_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm capitalize text-gray-600 dark:text-gray-400">
                  Status: {assignment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}