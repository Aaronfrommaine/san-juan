```tsx
import React from 'react';
import { Edit2, Trash2, MapPin } from 'lucide-react';
import { ItineraryItem } from '../../../lib/types/itinerary';

interface ItineraryItemListProps {
  items: ItineraryItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ItineraryItemList({ items, onEdit, onDelete }: ItineraryItemListProps) {
  const groupedItems = items.reduce((acc, item) => {
    const day = item.day_number;
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {} as Record<number, ItineraryItem[]>);

  const days = Object.keys(groupedItems).sort((a, b) => Number(a) - Number(b));

  const getLocationPreviewUrl = (location: string) => {
    const [, coords] = location.split('|');
    if (coords) {
      const [lat, lng] = coords.split(',');
      return `https://maps.googleapis.com/maps/api/streetview?size=400x200&location=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`;
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {days.map(day => (
        <div key={day} className="space-y-4">
          <h3 className="text-lg font-medium">Day {day}</h3>
          <div className="space-y-4">
            {groupedItems[Number(day)]
              .sort((a, b) => a.start_time.localeCompare(b.start_time))
              .map(item => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-500">
                          {item.start_time} - {item.end_time}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          {item.activity_type}
                        </span>
                      </div>
                      <h4 className="font-medium mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {item.description}
                      </p>
                      
                      <div className="flex items-start gap-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mt-1" />
                        <span>{item.location.split('|')[0]}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(item.id)}
                        className="p-2 text-gray-600 hover:text-yellow-500"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this item?')) {
                            onDelete(item.id);
                          }
                        }}
                        className="p-2 text-gray-600 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {item.location.includes('|') && (
                    <div className="mt-4">
                      <img
                        src={getLocationPreviewUrl(item.location)}
                        alt="Location street view"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```