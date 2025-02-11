import React from 'react';
import { Clock } from 'lucide-react';

interface Event {
  time: string;
  title: string;
  description: string;
}

interface ItineraryDayProps {
  day: number;
  events: Event[];
  isVIP?: boolean;
}

export default function ItineraryDay({ day, events, isVIP = false }: ItineraryDayProps) {
  return (
    <div className={`p-6 rounded-lg ${isVIP ? 'bg-yellow-50' : 'bg-white'}`}>
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Day {day}
        {isVIP && <span className="ml-2 text-yellow-600 text-sm">(VIP)</span>}
      </h3>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex items-center text-gray-500">
              <Clock className="h-5 w-5" />
              <span className="ml-2 text-sm">{event.time}</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{event.title}</h4>
              <p className="text-gray-600 text-sm">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}