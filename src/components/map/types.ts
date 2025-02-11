export interface Coordinates {
  lat: number;
  lng: number;
}

export interface BaseLocation {
  id: string;
  name: string;
  description: string;
  image: string;
  coordinates: Coordinates;
}

export interface Property extends BaseLocation {
  type: 'property' | 'venue';
  price: number;
  features: string[];
  featured?: boolean;
}

export interface Attraction extends BaseLocation {
  type: 'attraction';
  website: string;
}