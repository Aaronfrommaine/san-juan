import React from 'react';
import { Calendar, Users } from 'lucide-react';
import { useSeminars } from '../../lib/hooks/useSeminars';

interface SeminarSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SeminarSelect({ value, onChange }: SeminarSelectProps) {
  const { seminars, isLoading, error } = useSeminars();

  // Filter to only show upcoming seminars
  const upcomingSeminars = seminars.filter(seminar => seminar.status === 'upcoming');

  if (isLoading) return <div>Loading available dates...</div>;
  if (error) return <div>Failed to load seminar dates</div>;

  if (upcomingSeminars.length === 0) {
    return (
      <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <Calendar className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Upcoming Seminars
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          New seminar dates will be announced soon. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {upcomingSeminars.map((seminar) => (
        <label
          key={seminar.id}
          className={`block p-4 border rounded-lg cursor-pointer transition-colors
            ${value === seminar.id 
              ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
              : 'border-gray-200 hover:border-yellow-200 dark:border-gray-700'}`}
        >
          <input
            type="radio"
            name="seminar"
            value={seminar.id}
            checked={value === seminar.id}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                <Calendar className="h-4 w-4" />
                {new Date(seminar.start_date).toLocaleDateString()} - 
                {new Date(seminar.end_date).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{seminar.location}</div>
            </div>
            
            <div className="flex items-center gap-1 text-sm">
              <Users className="h-4 w-4" />
              <span className={seminar.spots_remaining < 5 ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}>
                {seminar.spots_remaining} spots left
              </span>
            </div>
          </div>
        </label>
      ))}
    </div>
  );
}