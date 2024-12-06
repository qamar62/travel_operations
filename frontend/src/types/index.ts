export interface Traveler {
  id?: number;
  name: string;
  num_adults: number;
  num_infants: number;
  contact_email?: string;
  contact_phone?: string;
}

export interface Itinerary {
  id?: number;
  booking: number;
  day: number;
  date: string;
  time: string;
  title: string;
  description?: string;
}

export interface Booking {
  id?: number;
  traveler: Traveler;
  reservation_number: string;
  hotel_confirmation_number: string;
  travel_start_date: string;
  travel_end_date: string;
  hotel_name: string;
  num_rooms: number;
  transfer_type: 'PRIVATE' | 'SHARED' | 'GROUP';
  meal_plan: 'BB' | 'HB' | 'FB' | 'AI';
  inclusions?: string;
  arrival_details?: string;
  departure_details?: string;
  meeting_point?: string;
  itinerary_items?: Itinerary[];
}
