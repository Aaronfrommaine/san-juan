import React, { useState } from 'react';
import { Plane, Car, Clock, MapPin } from 'lucide-react';
import { useTravelDetails } from '../../../lib/hooks/useTravelDetails';
import TransportationButtons from './TransportationButtons';

export default function TravelDetails() {
  const { travelDetails, updateTravelDetails, isLoading } = useTravelDetails();
  const [showFlightForm, setShowFlightForm] = useState(false);
  const [flightData, setFlightData] = useState({
    airline: travelDetails?.airline || '',
    flightNumber: travelDetails?.flightNumber || '',
    arrivalTime: travelDetails?.arrivalTime || '',
    departureTime: travelDetails?.departureTime || ''
  });

  const handleFlightSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTravelDetails(flightData);
    setShowFlightForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">Flight Information</h3>
          </div>
          <button
            onClick={() => setShowFlightForm(true)}
            className="px-3 py-1 text-sm bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
          >
            {travelDetails ? 'Update Flight' : 'Add Flight'}
          </button>
        </div>

        {showFlightForm ? (
          <form onSubmit={handleFlightSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Airline</label>
                <input
                  type="text"
                  value={flightData.airline}
                  onChange={e => setFlightData(prev => ({ ...prev, airline: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Flight Number</label>
                <input
                  type="text"
                  value={flightData.flightNumber}
                  onChange={e => setFlightData(prev => ({ ...prev, flightNumber: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Arrival Time</label>
                <input
                  type="datetime-local"
                  value={flightData.arrivalTime}
                  onChange={e => setFlightData(prev => ({ ...prev, arrivalTime: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Departure Time</label>
                <input
                  type="datetime-local"
                  value={flightData.departureTime}
                  onChange={e => setFlightData(prev => ({ ...prev, departureTime: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowFlightForm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Flight Details'}
              </button>
            </div>
          </form>
        ) : travelDetails ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Clock className="h-4 w-4" />
              <span>Arrival: {new Date(travelDetails.arrivalTime).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Plane className="h-4 w-4" />
              <span>{travelDetails.airline} {travelDetails.flightNumber}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No flight details added yet</p>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Car className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">Transportation Options</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <MapPin className="h-4 w-4" />
            <span>Córcega Beach Resort</span>
          </div>

          <TransportationButtons 
            hotelName="Córcega Beach Resort"
            coordinates={{ lat: 18.3489, lng: -67.2505 }}
          />
        </div>
      </div>
    </div>
  );
}