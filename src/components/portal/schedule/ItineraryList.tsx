import React from 'react';
import { ItineraryItem } from '../../../lib/types/itinerary';
import { Clock, MapPin } from 'lucide-react';

interface ItineraryListProps {
  items: ItineraryItem[];
}

export default function ItineraryList({ items }: ItineraryListProps) {
  const groupedItems = items.reduce((acc, item) => {
    const day = item.day_number;
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {} as Record<number, ItineraryItem[]>);

  const days = Object.keys(groupedItems).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="space-y-6">
      {days.map(day => (
        <div key={day} className="space-y-3">
          <h4 className="font-medium text-gray-900">Day {day}</h4>
          <div className="space-y-3">
            {groupedItems[Number(day)]
              .sort((a, b) => a.start_time.localeCompare(b.start_time))
              .map(item => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Clock className="h-4 w-4" />
                    <span>{item.start_time} - {item.end_time}</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      {item.activity_type}
                    </span>
                  </div>
                  <h5 className="font-medium mb-1">{item.title}</h5>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{item.location.split('|')[0]}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}