import React, { useState, useEffect } from 'react';
import { Clock, MapPin, ChevronDown, ChevronUp, Calendar, Home } from 'lucide-react';
import { Booking } from '../../../lib/types/booking';
import ItineraryList from './ItineraryList';
import { useItineraryItems } from '../../../lib/hooks/useItineraryItems';
import { useRoomAssignments } from '../../../lib/hooks/useRoomAssignments';

interface ScheduleCardProps {
  booking: Booking;
}

export default function ScheduleCard({ booking }: ScheduleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { items, isLoading } = useItineraryItems(booking.seminar_id);
  const { getRoomAssignment } = useRoomAssignments();
  const [roomAssignment, setRoomAssignment] = useState<any>(null);

  useEffect(() => {
    async function fetchRoomAssignment() {
      const assignment = await getRoomAssignment(booking.id);
      setRoomAssignment(assignment);
    }
    fetchRoomAssignment();
  }, [booking.id]);

  const filteredItems = items.filter(item => {
    switch (booking?.package_name.toLowerCase()) {
      case 'elite package':
        return true; // Show all items
      case 'vip package':
        return item.package_type !== 'elite';
      default:
        return item.package_type === 'standard';
    }
  });

  return (
    <div className="border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              {booking.package_name}
              <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </h3>
            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
              <Clock className="h-4 w-4 mr-2" />
              <span>
                {new Date(booking.seminar.start_date).toLocaleDateString()} - 
                {new Date(booking.seminar.end_date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{booking.seminar.location}</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium
            ${booking.status === 'confirmed' 
              ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300'
              : booking.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300'
              : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300'
            }`}>
            {booking.status}
          </span>
        </div>

        {roomAssignment && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
              <Home className="h-4 w-4" />
              <span>Room {roomAssignment.rooms.room_number}</span>
              <span className="text-sm">({roomAssignment.rooms.room_types.name})</span>
            </div>
          </div>
        )}

        {booking.status === 'pending' && (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            Your itinerary will be available once your booking is confirmed
          </p>
        )}
      </div>

      {isExpanded && (
        <div className="border-t dark:border-gray-700">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
            {booking.status === 'confirmed' ? (
              isLoading ? (
                <div className="text-center py-4 text-gray-600 dark:text-gray-400">
                  Loading itinerary...
                </div>
              ) : filteredItems.length > 0 ? (
                <ItineraryList items={filteredItems} />
              ) : (
                <div className="text-center py-4 text-gray-600 dark:text-gray-400">
                  No itinerary items available yet
                </div>
              )
            ) : (
              <div className="text-center py-4 text-gray-600 dark:text-gray-400 flex flex-col items-center gap-2">
                <Calendar className="h-6 w-6" />
                <p>Itinerary will be available after booking confirmation</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}