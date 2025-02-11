import React from 'react';
import { Home, Hotel, Palm, Coffee } from 'lucide-react';

interface MapMarkerProps {
  type: 'venue' | 'property' | 'attraction';
  isSelected: boolean;
}

const markerIcons = {
  venue: Hotel,
  property: Home,
  attraction: Coffee,
};

export default function MapMarker({ type, isSelected }: MapMarkerProps) {
  const Icon = markerIcons[type];
  
  return (
    <div
      className={`p-2 rounded-full cursor-pointer
        ${isSelected 
          ? 'bg-yellow-500 text-white scale-125' 
          : 'bg-white text-gray-700 hover:bg-yellow-100'} 
        shadow-lg transition-all duration-200`}
    >
      <Icon className="h-5 w-5" />
    </div>
  );
}