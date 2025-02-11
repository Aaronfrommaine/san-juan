import mapboxgl from 'mapbox-gl';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

if (!MAPBOX_TOKEN) {
  console.error('Missing Mapbox token in environment variables');
}

// Initialize Mapbox with error handling
mapboxgl.accessToken = MAPBOX_TOKEN || '';

export const initializeMap = async (container: HTMLElement): Promise<mapboxgl.Map> => {
  return new Promise((resolve, reject) => {
    try {
      if (!MAPBOX_TOKEN) {
        throw new Error('Mapbox token is required');
      }

      const map = new mapboxgl.Map({
        container,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-66.5901, 18.2208], // Puerto Rico
        zoom: 9,
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: true
      });

      map.on('load', () => resolve(map));
      map.on('error', (e) => {
        console.error('Mapbox error:', e);
        reject(e);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      reject(error);
    }
  });
};

// Geocoding helper with error handling
export const reverseGeocode = async (lng: number, lat: number): Promise<string> => {
  try {
    if (!MAPBOX_TOKEN) {
      throw new Error('Mapbox token is required');
    }

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }
    
    const data = await response.json();
    return data.features?.[0]?.place_name || 'Location not found';
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return 'Location not found';
  }
};