import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Award, Home } from 'lucide-react';
import { Profile } from '../../../lib/types/profile';
import { useRoomAssignments } from '../../../lib/hooks/useRoomAssignments';
import { useSeminars } from '../../../lib/hooks/useSeminars';

interface AttendeeCardProps {
  profile: Profile;
  bookingId?: string;
}

export default function AttendeeCard({ profile, bookingId }: AttendeeCardProps) {
  const { getRoomAssignment } = useRoomAssignments();
  const { seminars } = useSeminars();
  const [roomAssignment, setRoomAssignment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ensure badges exist, default to empty array if not
  const badges = profile.badges || [];

  useEffect(() => {
    async function fetchRoomAssignment() {
      if (!bookingId) {
        setIsLoading(false);
        return;
      }

      try {
        const assignment = await getRoomAssignment(bookingId);
        setRoomAssignment(assignment);
      } catch (error) {
        console.error('Error fetching room assignment:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoomAssignment();
  }, [bookingId]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-medium text-lg">
            {profile.first_name} {profile.last_name}
          </h3>
          {profile.title && profile.company && (
            <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1">
              <Building2 className="h-4 w-4 mr-2" />
              <span>{profile.title} at {profile.company}</span>
            </div>
          )}
          {profile.location && (
            <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{profile.location}</span>
            </div>
          )}
        </div>
        
        {profile.avatar_type && (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300 rounded-full text-sm">
            {profile.avatar_type.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </span>
        )}
      </div>

      {profile.bio && (
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {profile.bio}
        </p>
      )}

      {/* Room Assignment Section */}
      {bookingId && (
        <div className="border-t dark:border-gray-700 pt-4 mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Room Assignment
          </h4>
          {isLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading room details...</p>
          ) : roomAssignment ? (
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Home className="h-4 w-4 mr-2" />
                <span>Room {roomAssignment.rooms.room_number} - {roomAssignment.rooms.room_types.name}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {roomAssignment.rooms.room_types.description}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No room assigned yet</p>
          )}
        </div>
      )}

      {badges.length > 0 && (
        <div className="border-t dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Achievements
          </h4>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              >
                <Award className="h-3 w-3 mr-1" />
                {badge.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}