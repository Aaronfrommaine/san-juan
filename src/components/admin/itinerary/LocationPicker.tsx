import React, { useState, useEffect, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import Map, { Marker } from 'react-map-gl';
import { useMapbox } from '../../../lib/hooks/useMapbox';
import LocationInput from './LocationInput';

interface LocationPickerProps {
  onSelect: (location: { address: string; coordinates: { lat: number; lng: number } } | null) => void;
  initialLocation?: string;
}

export default function LocationPicker({ onSelect, initialLocation }: LocationPickerProps) {
  const { reverseGeocode, mapboxToken } = useMapbox();
  const [viewState, setViewState] = useState({
    latitude: 18.2208,
    longitude: -66.5901,
    zoom: 9,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  });
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (initialLocation) {
      const [addr, coords] = initialLocation.split('|');
      if (coords) {
        const [lat, lng] = coords.split(',').map(Number);
        setMarker({ lat, lng });
        setAddress(addr);
        setViewState(prev => ({ ...prev, latitude: lat, longitude: lng }));
      }
    }
  }, [initialLocation]);

  const handleMapClick = useCallback(async (event: { lngLat: { lat: number; lng: number } }) => {
    const { lat, lng } = event.lngLat;
    setMarker({ lat, lng });
    
    try {
      const address = await reverseGeocode(lng, lat);
      setAddress(address);
      onSelect({
        address,
        coordinates: { lat, lng }
      });
    } catch (error) {
      console.error('Error getting address:', error);
    }
  }, [reverseGeocode, onSelect]);

  return (
    <div className="space-y-4">
      <div className="h-[300px] rounded-lg overflow-hidden">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={mapboxToken}
          onClick={handleMapClick}
          reuseMaps
        >
          {marker && (
            <Marker
              latitude={marker.lat}
              longitude={marker.lng}
              anchor="bottom"
            >
              <MapPin className="h-6 w-6 text-yellow-500" />
            </Marker>
          )}
        </Map>
      </div>

      <LocationInput
        value={address}
        onChange={setAddress}
        placeholder="Click on the map to select location"
      />
    </div>
  );
}