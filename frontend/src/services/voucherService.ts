import axios from 'axios';
import { api } from './api';

const API_URL = 'http://127.0.0.1:8000/api';

export interface Traveler {
  id: number; // Required
  name: string;
  num_adults: number;
  num_infants: number;
  contact_email?: string; // Optional
  contact_phone?: string; // Optional
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
  total_rooms: number; // Added property
  transfer_type_display: string; // Added property
  meal_plan_display: string; // Added property
  hotel_confirmation_number: string; // Added property
  transfer_type: string; // Added property
  meal_plan: string; // Added property
  inclusions: string; // Added property
  arrival_details: string; // Added property
  departure_details: string; // Added property
  meeting_point: string; // Added property
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ServiceVoucher[];
}

export const fetchServiceVouchers = async (page: number = 1, pageSize: number = 10): Promise<ApiResponse> => {
  try {
    const response = await api.get<ApiResponse>('/api/service-vouchers/', {
      params: {
        page,
        page_size: pageSize
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching service vouchers:', error);
    throw new Error('Failed to fetch service vouchers');
  }
};

export const createServiceVoucher = async (voucher: ServiceVoucher) => {
  const response = await api.post<ServiceVoucher>('/api/service-vouchers/', voucher);
  return response.data;
};

export const updateServiceVoucher = async (id: number, voucher: ServiceVoucher) => {
  const response = await api.put<ServiceVoucher>(`/api/service-vouchers/${id}/`, voucher);
  return response.data;
};

export const deleteServiceVoucher = async (id: number) => {
  await api.delete(`/api/service-vouchers/${id}/`);
};
