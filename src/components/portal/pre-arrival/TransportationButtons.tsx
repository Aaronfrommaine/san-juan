import React, { useState } from 'react';
import { Car, Crown, Star } from 'lucide-react';
import { useTravelDetails } from '../../../lib/hooks/useTravelDetails';
import { useBookings } from '../../../lib/hooks/useBookings';

interface TransportationButtonsProps {
  hotelName: string;
  coordinates: { lat: number; lng: number };
}

export default function TransportationButtons({ hotelName, coordinates }: TransportationButtonsProps) {
  const { travelDetails } = useTravelDetails();
  const { bookings } = useBookings();
  const [showTooltip, setShowTooltip] = useState(false);

  // Get the user's package from their most recent booking
  const userPackage = bookings[0]?.package_name?.toLowerCase() || '';
  const hasShuttleAccess = userPackage.includes('elite') || userPackage.includes('vip');

  const getUberLink = () => {
    return `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${coordinates.lat}&dropoff[longitude]=${coordinates.lng}&dropoff[nickname]=${encodeURIComponent(hotelName)}`;
  };

  const handleShuttleRequest = () => {
    if (!hasShuttleAccess) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      return;
    }

    // Format arrival time nicely
    const arrivalTime = travelDetails?.arrivalTime 
      ? new Date(travelDetails.arrivalTime).toLocaleString()
      : 'Not provided';

    const subject = 'Shuttle Service Request';
    const body = `Hello Kevin,

I would like to request shuttle service for my upcoming stay.

Flight Details:
Airline: ${travelDetails?.airline || 'Not provided'}
Flight Number: ${travelDetails?.flightNumber || 'Not provided'}
Arrival Time: ${arrivalTime}

Hotel: ${hotelName}

Please let me know if you need any additional information.

Thank you!`;

    // Open email client with pre-filled content
    window.location.href = `mailto:kevin@abodekport.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <button
            onClick={handleShuttleRequest}
            className={`w-full px-4 py-3 rounded-lg transition-colors flex items-center justify-center group
              ${hasShuttleAccess 
                ? 'bg-yellow-500 hover:bg-yellow-400 text-black' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            onMouseEnter={() => !hasShuttleAccess && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Car className="h-5 w-5 mr-2" />
            Request Shuttle
            {hasShuttleAccess && (
              <div className="ml-2 flex items-center gap-1">
                <Crown className="h-4 w-4" />
                <Star className="h-4 w-4" />
              </div>
            )}
          </button>

          {/* Premium Feature Tooltip */}
          {showTooltip && !hasShuttleAccess && (
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-10 animate-fade-in">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
              <p>Complimentary shuttle service is included with Elite and VIP packages</p>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45"></div>
            </div>
          )}
        </div>
        
        <a
          href={getUberLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center"
        >
          <Car className="h-5 w-5 mr-2" />
          Open in Uber
        </a>
      </div>

      {/* Package Badge */}
      {hasShuttleAccess && (
        <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-full">
            <div className="flex items-center">
              {userPackage.includes('elite') ? <Crown className="h-4 w-4 text-yellow-500" /> : <Star className="h-4 w-4 text-yellow-500" />}
            </div>
            <span>Complimentary shuttle service included with your package</span>
          </div>
        </div>
      )}
    </div>
  );
}