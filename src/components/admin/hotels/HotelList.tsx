import React from 'react';
import { Building2, MapPin, Edit2, Trash2 } from 'lucide-react';
import { Hotel } from '../../../lib/types/hotels';

interface HotelListProps {
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  onSelect: (hotel: Hotel) => void;
  onEdit: (hotel: Hotel) => void;
  onDelete: (id: string) => void;
}

export default function HotelList({ hotels, selectedHotel, onSelect, onEdit, onDelete }: HotelListProps) {
  if (!hotels.length) {
    return (
      <div className="text-center p-8 text-gray-600 dark:text-gray-400">
        No properties added yet. Click "Add Property" to get started.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {hotels.map((hotel) => (
        <div
          key={hotel.id}
          onClick={() => onSelect(hotel)}
          className={`p-4 rounded-lg border transition-colors cursor-pointer ${
            selectedHotel?.id === hotel.id
              ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-yellow-200'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-yellow-500" />
              <h3 className="font-medium">{hotel.name}</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(hotel);
                }}
                className="p-1 text-gray-600 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Are you sure you want to delete this property?')) {
                    onDelete(hotel.id);
                  }
                }}
                className="p-1 text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>{hotel.location}</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {Object.entries(hotel.amenities || {}).map(([key, value]) => (
              value && (
                <span
                  key={key}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                >
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              )
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}