import axios from 'axios';
import { api } from './api';

const API_URL = 'http://127.0.0.1:8000/api';

export interface Traveler {
  id: number;
  name: string;
  num_adults: number;
  num_infants: number;
  contact_email: string;
  contact_phone: string;
}

export interface RoomAllocation {
  id: number;
  room_type: string;
  room_type_display: string;
  quantity: number;
}

export interface ItineraryItem {
  id: number;
  day: number;
  date: string;
  time: string;
  description: string;
}

export interface ServiceVoucher {
  id: number;
  traveler: Traveler;
  room_allocations: RoomAllocation[];
  itinerary_items: ItineraryItem[];
  travel_start_date: string;
  travel_end_date: string;
  reservation_number: string;
  hotel_name: string;
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ServiceVoucher[];
}

export const fetchServiceVouchers = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get<ApiResponse>('/api/service-vouchers/');
    return response.data;
  } catch (error) {
    console.error('Error fetching service vouchers:', error);
    throw new Error('Failed to fetch service vouchers');
  }
};
