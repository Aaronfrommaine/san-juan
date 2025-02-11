import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Profile } from '../../../lib/types/profile';
import AttendeeCard from './AttendeeCard';
import MessageCenter from './MessageCenter';

interface AttendeeListProps {
  attendees: (Profile & {
    booking_id?: string;
  })[];
}

export default function AttendeeList({ attendees }: AttendeeListProps) {
  const [selectedAttendee, setSelectedAttendee] = useState<string | null>(null);

  if (attendees.length === 0) {
    return (
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400">
          No fellow investors found for your upcoming seminars.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attendees.map((attendee) => (
          <div key={attendee.id} className="relative group">
            <AttendeeCard 
              profile={attendee} 
              bookingId={attendee.booking_id}
            />
            <button
              onClick={() => setSelectedAttendee(attendee.id)}
              className="absolute top-4 right-4 p-2 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Message"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      {selectedAttendee && (
        <MessageCenter
          recipientId={selectedAttendee}
          onClose={() => setSelectedAttendee(null)}
        />
      )}
    </>
  );
}