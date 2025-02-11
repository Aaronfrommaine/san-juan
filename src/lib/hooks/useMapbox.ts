import { useCallback } from 'react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

if (!MAPBOX_TOKEN) {
  throw new Error('Missing Mapbox token in environment variables');
}

export function useMapbox() {
  const reverseGeocode = useCallback(async (lng: number, lat: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      
      const data = await response.json();
      
      if (data.features?.[0]) {
        return data.features[0].place_name;
      }
      
      throw new Error('No address found');
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return 'Location not found';
    }
  }, []);

  return { 
    reverseGeocode,
    mapboxToken: MAPBOX_TOKEN
  };
}