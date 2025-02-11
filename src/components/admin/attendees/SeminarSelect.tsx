import React from 'react';
import { Calendar, Users } from 'lucide-react';

interface Seminar {
  id: string;
  start_date: string;
  end_date: string;
  location: string;
  spots_remaining: number;
  total_spots: number;
}

interface SeminarSelectProps {
  seminars: Seminar[];
  selectedSeminarId: string | null;
  onSelect: (id: string) => void;
}

export default function SeminarSelect({ seminars, selectedSeminarId, onSelect }: SeminarSelectProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {seminars.map((seminar) => (
        <button
          key={seminar.id}
          onClick={() => onSelect(seminar.id)}
          className={`flex flex-col p-4 rounded-lg border transition-colors text-left ${
            selectedSeminarId === seminar.id
              ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-yellow-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">
              {new Date(seminar.start_date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span>
              {seminar.total_spots - seminar.spots_remaining} / {seminar.total_spots} Attendees
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}