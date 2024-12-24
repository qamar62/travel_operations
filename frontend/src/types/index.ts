// Base interfaces
export interface BaseTraveler {
  name: string;
  num_adults: number;
  num_children: number;
  num_infants: number;
  contact_email: string;
  contact_phone: string;
}

export interface RoomAllocation {
  id?: number;
  room_type: string;
  room_type_display?: string;
  quantity: number;
  num_adults: number;
  num_children: number;
  num_infants: number;
}

export interface ItineraryActivity {
  id?: number;
  time: string;
  activity_type: string;
  activity_type_display?: string;
  description: string;
  location?: string;
  notes?: string;
}

export interface ItineraryItem {
  id?: number;
  day: number;
  date: string;
  activities: ItineraryActivity[];
}

// Service Voucher Types
export interface ServiceVoucher {
  id: number;
  service_type: string;
  customer_name: string;
  service_date: string;
  status: string;
  description: string;
  traveler: BaseTraveler;
  room_allocations: RoomAllocation[];
  itinerary_items: ItineraryItem[];
  travel_start_date: string;
  travel_end_date: string;
  reservation_number: string;
  hotel_name: string;
  hotel_confirmation_number: string;
  meal_plan: string;
  meal_plan_display: string;
  transfer_type: string;
  transfer_type_display: string;
  meeting_point: string;
  arrival_details: string;
  departure_details: string;
  inclusions: string;
  total_rooms: number;
  created_at?: string;
  updated_at?: string;
}

// Hotel Voucher Types
export interface HotelVoucher {
  id: number;
  guest_name: string;
  hotel_name: string;
  hotel_address: string;
  check_in_date: string;
  check_out_date: string;
  number_of_nights: number;
  number_of_rooms: number;
  room_type?: string;
  confirmation_number: string;
  status?: string;
}

// Props Types
export interface VoucherDetailProps {
  voucher: ServiceVoucher;
}

export interface VoucherFormProps {
  initialData?: ServiceVoucher;
  onSubmit: (data: ServiceVoucher) => void;
  onCancel: () => void;
  isOpen: boolean;
  mode: 'create' | 'edit';
}

// Input types
export type CreateServiceVoucherInput = Omit<ServiceVoucher, 'id' | 'created_at' | 'updated_at'>;
export type CreateHotelVoucherInput = Omit<HotelVoucher, 'id'>;
