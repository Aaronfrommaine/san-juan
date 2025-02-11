import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useBookings } from '../../lib/hooks/useBookings';
import ScheduleCard from './schedule/ScheduleCard';

export default function Schedule() {
  const { bookings, isLoading, error } = useBookings();

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading your schedule...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center text-red-600 mb-2">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Failed to load schedule</span>
        </div>
        <p className="text-center text-gray-600">
          Please try refreshing the page
        </p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        No bookings found. Book your first seminar to get started!
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Your Seminar Schedule</h2>
      <div className="space-y-6">
        {bookings.map((booking) => (
          <ScheduleCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
}