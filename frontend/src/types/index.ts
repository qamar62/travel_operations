export interface Traveler {
  id: number; // Changed to required
  name: string;
  num_adults: number;
  num_infants: number;
  contact_email?: string;
  contact_phone?: string;
}

export interface RoomAllocation {
  id: number;
  room_type: string;
  room_type_display: string;
  quantity: number;
}

export interface ItineraryActivity {
  id: number;
  time: string;
  activity_type: string;
  activity_type_display: string; // Added for display purposes
  description: string;
  location: string;
  notes: string;
}

export interface ItineraryItem {
  id: number;
  day: number;
  date: string;
  time: string; // Added time property
  activities: ItineraryActivity[]; // Ensure activities property is included
}

export interface ServiceVoucher {
  id: number;
  traveler: Traveler;
  room_allocations: RoomAllocation[];
  itinerary_items: ItineraryItem[]; // Ensure itinerary_items includes activities
  travel_start_date: string;
  travel_end_date: string;
  reservation_number: string;
  hotel_name: string;
  total_rooms: number;
  transfer_type_display: string;
  meal_plan_display: string;
  hotel_confirmation_number: string;
  transfer_type: string;
  meal_plan: string;
  inclusions: string;
  arrival_details: string;
  departure_details: string;
  meeting_point: string;
}

// New interface for creating a voucher (omits id and other server-generated fields)
export type CreateServiceVoucherInput = Omit<ServiceVoucher, 'id'> & {
  id?: never;
};

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
  itinerary_items?: ItineraryItem[];
}
