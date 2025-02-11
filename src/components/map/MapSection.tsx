import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { properties, attractions } from './mapData';
import PropertyCard from './PropertyCard';
import { initializeMap } from '../../lib/mapbox';

export default function MapSection() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initMap = async () => {
      try {
        map.current = await initializeMap(mapContainer.current);
        setIsMapLoaded(true);
        setMapError(null);
        
        // Add markers after successful initialization
        [...properties, ...attractions].forEach(item => {
          const marker = new mapboxgl.Marker({
            color: item.type === 'venue' ? '#EAB308' : '#71717A',
            scale: 0.8
          })
            .setLngLat([item.coordinates.lng, item.coordinates.lat])
            .addTo(map.current!);

          // Add click handler
          marker.getElement().addEventListener('click', () => {
            setSelectedItem(item.id);
          });
        });
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Unable to load interactive map. Using static view instead.');
        setIsMapLoaded(false);
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Fallback content when map fails to load
  const renderFallbackContent = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800/90 p-8 text-center">
      <MapPin className="h-12 w-12 text-yellow-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Map View Unavailable</h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-4">
        {mapError || 'The interactive map is currently unavailable.'}
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-3xl">
        {properties.map(property => (
          <div key={property.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h4 className="font-medium mb-2">{property.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{property.location}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <MapPin className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Your Investment Playground
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover prime locations, upcoming tours, and local attractions
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-100 rounded-lg overflow-hidden h-[600px] relative">
            <div ref={mapContainer} className="w-full h-full" />
            {!isMapLoaded && renderFallbackContent()}
          </div>

          <div className="space-y-4">
            {selectedItem ? (
              <PropertyCard
                item={[...properties, ...attractions].find(p => p.id === selectedItem)!}
                onClose={() => setSelectedItem(null)}
              />
            ) : (
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  Click on any marker to explore
                </h3>
                <p className="text-yellow-700 text-sm">
                  Discover our seminar venue, upcoming property tours, and local attractions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}