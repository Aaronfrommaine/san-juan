import React from 'react';
import { Mail, Phone, Building2, Package } from 'lucide-react';
import { useAttendees } from '../../../lib/hooks/useAttendees';

interface AttendeeListProps {
  attendees: any[];
  isLoading: boolean;
}

export default function AttendeeList({ attendees, isLoading }: AttendeeListProps) {
  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-500 border-t-transparent mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading attendees...</p>
      </div>
    );
  }

  if (!attendees.length) {
    return (
      <div className="text-center p-8 text-gray-600 dark:text-gray-400">
        No attendees registered yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
  );
}