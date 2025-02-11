/*
  # Investment Seminar Platform Schema Documentation

  1. Core Tables
    - `seminars`: Manages seminar events
    - `bookings`: Handles attendee registrations
    - `profiles`: Stores user profiles
    - `user_roles`: Manages user permissions
    - `awarded_badges`: Tracks user achievements

  2. Networking
    - `chat_messages`: Group chat functionality
    - `direct_messages`: Private messaging
    - `group_announcements`: Official announcements

  3. Accommodation
    - `hotels`: Property information
    - `room_types`: Room categories
    - `rooms`: Individual rooms
    - `room_assignments`: Room bookings

  4. Itinerary
    - `itinerary_items`: Event schedule items
    - `host_assignments`: Seminar hosts

  5. Analytics
    - `lead_tracking`: Marketing analytics
    - `travel_quiz_responses`: User preferences
*/

-- Core Tables Schema Documentation

-- seminars
/*
  Manages seminar events and their details
  - Primary tracking for available spots
  - Automatic status updates based on dates
  - Unique seminar codes for reference
*/
COMMENT ON TABLE seminars IS 'Seminar events with capacity management';
COMMENT ON COLUMN seminars.id IS 'Unique identifier';
COMMENT ON COLUMN seminars.start_date IS 'Event start date';
COMMENT ON COLUMN seminars.end_date IS 'Event end date';
COMMENT ON COLUMN seminars.location IS 'Seminar location';
COMMENT ON COLUMN seminars.total_spots IS 'Maximum capacity';
COMMENT ON COLUMN seminars.spots_remaining IS 'Available spots';
COMMENT ON COLUMN seminars.status IS 'upcoming/in-progress/completed';
COMMENT ON COLUMN seminars.seminar_code IS 'Unique reference code';

-- bookings
/*
  Handles attendee registrations and package selections
  - Links users to seminars
  - Tracks booking status
  - Manages spouse/partner registrations
*/
COMMENT ON TABLE bookings IS 'Attendee registrations and package details';
COMMENT ON COLUMN bookings.id IS 'Unique identifier';
COMMENT ON COLUMN bookings.user_id IS 'Reference to auth.users';
COMMENT ON COLUMN bookings.seminar_id IS 'Reference to seminars';
COMMENT ON COLUMN bookings.package_name IS 'Selected package level';
COMMENT ON COLUMN bookings.status IS 'pending/confirmed/cancelled';
COMMENT ON COLUMN bookings.include_spouse IS 'Spouse/partner inclusion flag';
COMMENT ON COLUMN bookings.attendee_code IS 'Unique attendee reference';

-- profiles
/*
  Extended user information and preferences
  - Professional details
  - Investment preferences
  - Avatar and badges
*/
COMMENT ON TABLE profiles IS 'Extended user profiles';
COMMENT ON COLUMN profiles.id IS 'References auth.users';
COMMENT ON COLUMN profiles.avatar_type IS 'Investment personality type';
COMMENT ON COLUMN profiles.investment_focus IS 'Array of investment interests';
COMMENT ON COLUMN profiles.avatar_result IS 'Questionnaire results';

-- Networking Tables Schema Documentation

-- chat_messages
/*
  Group chat functionality for seminar attendees
  - Seminar-specific chat rooms
  - Message history
*/
COMMENT ON TABLE chat_messages IS 'Group chat messages';
COMMENT ON COLUMN chat_messages.seminar_id IS 'Associated seminar';
COMMENT ON COLUMN chat_messages.sender_id IS 'Message author';
COMMENT ON COLUMN chat_messages.content IS 'Message content';

-- direct_messages
/*
  Private messaging between attendees
  - One-to-one communication
  - Read receipts
*/
COMMENT ON TABLE direct_messages IS 'Private messages between users';
COMMENT ON COLUMN direct_messages.sender_id IS 'Message sender';
COMMENT ON COLUMN direct_messages.recipient_id IS 'Message recipient';
COMMENT ON COLUMN direct_messages.read_at IS 'Read timestamp';

-- Accommodation Tables Schema Documentation

-- hotels
/*
  Property information for seminar venues
  - Amenities and features
  - Location details
*/
COMMENT ON TABLE hotels IS 'Seminar venue properties';
COMMENT ON COLUMN hotels.amenities IS 'Property features (JSONB)';
COMMENT ON COLUMN hotels.location IS 'Property location';

-- room_types
/*
  Room categories and packages
  - Package-specific amenities
  - Pricing tiers
*/
COMMENT ON TABLE room_types IS 'Room categories and amenities';
COMMENT ON COLUMN room_types.package_level IS 'standard/vip/elite';
COMMENT ON COLUMN room_types.amenities IS 'Room features (JSONB)';

-- rooms
/*
  Individual room inventory
  - Room status tracking
  - Type association
*/
COMMENT ON TABLE rooms IS 'Individual hotel rooms';
COMMENT ON COLUMN rooms.status IS 'available/occupied/maintenance';
COMMENT ON COLUMN rooms.room_number IS 'Physical room identifier';

-- Itinerary Tables Schema Documentation

-- itinerary_items
/*
  Event schedule management
  - Activity details
  - Package-specific events
*/
COMMENT ON TABLE itinerary_items IS 'Seminar schedule items';
COMMENT ON COLUMN itinerary_items.activity_type IS 'presentation/workshop/meal/tour/networking';
COMMENT ON COLUMN itinerary_items.package_type IS 'standard/vip/elite';
COMMENT ON COLUMN itinerary_items.location IS 'Activity location with coordinates';

-- Analytics Tables Schema Documentation

-- lead_tracking
/*
  Marketing analytics and lead sources
  - UTM parameter tracking
  - Conversion analysis
*/
COMMENT ON TABLE lead_tracking IS 'Marketing analytics data';
COMMENT ON COLUMN lead_tracking.utm_source IS 'Traffic source';
COMMENT ON COLUMN lead_tracking.utm_campaign IS 'Marketing campaign';

-- Key Relationships and Constraints

-- Seminars -> Bookings
COMMENT ON CONSTRAINT bookings_seminar_id_fkey ON bookings IS 'Links booking to seminar';

-- Profiles -> Auth Users
COMMENT ON CONSTRAINT profiles_id_fkey ON profiles IS 'Links profile to auth user';

-- Rooms -> Room Types
COMMENT ON CONSTRAINT rooms_room_type_id_fkey ON rooms IS 'Links room to category';

-- Security Policies Documentation

/*
  Row Level Security (RLS) Overview:

  1. Public Access
    - Upcoming seminars are publicly viewable
    - Professional directory is public
    - Badge definitions are public

  2. Authenticated Access
    - Users can view/edit their own profiles
    - Users can view fellow attendees in their seminars
    - Users can send/receive messages within their seminars

  3. Admin Access
    - Full access to all tables
    - Manage user roles and permissions
    - Override RLS for data management
*/

-- Performance Optimizations

/*
  Key Indexes:
  1. Seminars
    - start_date for upcoming filtering
    - spots_remaining for availability checks
  
  2. Bookings
    - user_id + seminar_id for attendee lookups
    - status for confirmed bookings
  
  3. Messages
    - sender_id + recipient_id for conversations
    - created_at for chronological ordering
  
  4. Room Assignments
    - booking_id for quick lookups
    - date range for availability checks
*/