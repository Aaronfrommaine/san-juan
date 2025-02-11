import { Database } from '../database.types';

export interface Hotel {
  id: string;
  name: string;
  location: string;
  description: string;
  amenities: {
    pool?: boolean;
    beach_access?: boolean;
    restaurant?: boolean;
    spa?: boolean;
    fitness_center?: boolean;
    conference_facilities?: boolean;
    rooftop_bar?: boolean;
    art_gallery?: boolean;
  };
}

export interface RoomType {
  id: string;
  hotel_id: string;
  name: string;
  description: string;
  package_level: 'standard' | 'vip' | 'elite';
  amenities: {
    size: string;
    bed: string;
    view: string;
    terrace?: boolean;
    balcony?: boolean;
    beach_access?: boolean;
    butler_service?: boolean;
  };
}

export interface Room {
  id: string;
  hotel_id: string;
  room_type_id: string;
  room_number: string;
  floor: string;
  status: 'available' | 'occupied' | 'maintenance';
  notes?: string;
}

export interface RoomAssignment {
  id: string;
  room_id: string;
  booking_id: string;
  check_in_date: string;
  check_out_date: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out';
}