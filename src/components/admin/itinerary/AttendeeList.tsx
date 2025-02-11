import React from 'react';
import { useAttendees } from '../../../lib/hooks/useAttendees';
import { Mail, Phone, Building2, Package } from 'lucide-react';

interface AttendeeListProps {
  seminarId: string;
}

export default function AttendeeList({ seminarId }: AttendeeListProps) {
  const { attendees, isLoading } = useAttendees(seminarId);

  if (isLoading) {
    return <div className="text-gray-600">Loading attendees...</div>;
  }

  if (!attendees.length) {
    return <div className="text-gray-600">No attendees registered yet.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Registered Attendees</h3>
      <div className="grid gap-4">
        {attendees.map((attendee) => (
          <div key={attendee.id} className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">
                  {attendee.first_name} {attendee.last_name}
                </h4>
                {attendee.company && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <Building2 className="h-4 w-4 mr-2" />
                    {attendee.company}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href={`mailto:${attendee.email}`} className="hover:text-yellow-500">
                    {attendee.email}
                  </a>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <Phone className="h-4 w-4 mr-2" />
                  <a href={`tel:${attendee.phone}`} className="hover:text-yellow-500">
                    {attendee.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <Package className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-sm font-medium">{attendee.package_name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}