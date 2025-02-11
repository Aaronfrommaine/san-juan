import React from 'react';
import { Plus } from 'lucide-react';

interface ItineraryHeaderProps {
  onAddItem: () => void;
}

export default function ItineraryHeader({ onAddItem }: ItineraryHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Itinerary Management</h2>
      <button
        onClick={onAddItem}
        className="flex items-center px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Item
      </button>
    </div>
  );
}