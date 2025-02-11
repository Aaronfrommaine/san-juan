import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import ItineraryDay from './ItineraryDay';
import { itineraryData } from './itineraryData';

export default function Itinerary() {
  const [showVIP, setShowVIP] = useState(false);

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Calendar className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Investment Journey
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            An immersive experience designed to give you the knowledge, network, and
            confidence to invest in Puerto Rico's real estate market
          </p>
          
          <button
            onClick={() => setShowVIP(!showVIP)}
            className="inline-flex items-center px-4 py-2 border border-yellow-500 rounded-md text-sm font-medium text-yellow-700 hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            {showVIP ? 'Hide VIP Day' : 'Show VIP Day'}
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {itineraryData.regular.map((day) => (
            <ItineraryDay
              key={day.day}
              day={day.day}
              events={day.events}
            />
          ))}
          {showVIP && itineraryData.vip.map((day) => (
            <ItineraryDay
              key={day.day}
              day={day.day}
              events={day.events}
              isVIP
            />
          ))}
        </div>
      </div>
    </div>
  );
}