export type PackageType = 'standard' | 'vip' | 'elite';

export interface MealDetails {
  menu: string[];
  dietary_options?: string[];
  special_notes?: string;
}

export interface TourDetails {
  meeting_point: string;
  transportation: string;
  what_to_bring: string[];
  included_items: string[];
}

export interface ItineraryItem {
  id: string;
  seminar_id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  day_number: number;
  location: string;
  speaker_name?: string;
  speaker_bio?: string;
  activity_type: 'presentation' | 'workshop' | 'meal' | 'tour' | 'networking';
  package_type: PackageType;
  meal_details?: MealDetails;
  tour_details?: TourDetails;
  created_at: string;
  updated_at: string;
}