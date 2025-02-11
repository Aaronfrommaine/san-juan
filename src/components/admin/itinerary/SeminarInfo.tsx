import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Database } from '../../../lib/database.types';

type Seminar = Database['public']['Tables']['seminars']['Row'];

interface SeminarInfoProps {
  seminar: Seminar;
}

export default function SeminarInfo({ seminar }: SeminarInfoProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-yellow-500" />
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Dates</div>
            <div className="font-medium">
              {new Date(seminar.start_date).toLocaleDateString()} -
              {new Date(seminar.end_date).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-yellow-500" />
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Location</div>
            <div className="font-medium">{seminar.location}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-yellow-500" />
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Attendance</div>
            <div className="font-medium">
              {seminar.total_spots - seminar.spots_remaining} / {seminar.total_spots} Spots Filled
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}