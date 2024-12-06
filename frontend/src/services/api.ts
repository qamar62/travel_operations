import axios from 'axios';
import { Booking, Traveler } from '../types';

const API_URL = 'http://127.0.0.1:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchBookings = async () => {
  const response = await api.get<{results: Booking[]}>(`/service-vouchers/`);
  return response.data.results;
};

export const fetchBookingById = async (id: number) => {
  const response = await api.get<Booking>(`/service-vouchers/${id}/`);
  return response.data;
};

export const createBooking = async (booking: Booking) => {
  const response = await api.post<Booking>(`/service-vouchers/`, booking);
  return response.data;
};

export const updateBooking = async (id: number, booking: Booking) => {
  const response = await api.put<Booking>(`/service-vouchers/${id}/`, booking);
  return response.data;
};

export const deleteBooking = async (id: number) => {
  await api.delete(`/service-vouchers/${id}/`);
};
