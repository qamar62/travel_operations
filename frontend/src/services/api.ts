import axios from 'axios';
import { ServiceVoucher, CreateServiceVoucherInput, Booking } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://admin.ant.ae/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchServiceVouchers = async () => {
  const response = await api.get<{results: ServiceVoucher[]}>(`/service-vouchers/`);
  return response.data.results;
};

export const fetchServiceVoucherById = async (id: number) => {
  const response = await api.get<ServiceVoucher>(`/service-vouchers/${id}/`);
  return response.data;
};

export const createServiceVoucher = async (voucher: CreateServiceVoucherInput) => {
  const response = await api.post<ServiceVoucher>(`/service-vouchers/`, voucher);
  return response.data;
};

export const updateServiceVoucher = async (id: number, voucher: Partial<ServiceVoucher>) => {
  const response = await api.patch<ServiceVoucher>(`/service-vouchers/${id}/`, voucher);
  return response.data;
};

export const deleteServiceVoucher = async (id: number) => {
  await api.delete(`/service-vouchers/${id}/`);
};

// Booking related API calls
export const fetchBookings = async () => {
  const response = await api.get<{results: Booking[]}>('/bookings/');
  return response.data.results;
};

export const fetchBookingById = async (id: number) => {
  const response = await api.get<Booking>(`/bookings/${id}/`);
  return response.data;
};

export const createBooking = async (booking: Omit<Booking, 'id'>) => {
  const response = await api.post<Booking>('/bookings/', booking);
  return response.data;
};

export const updateBooking = async (id: number, booking: Partial<Booking>) => {
  const response = await api.patch<Booking>(`/bookings/${id}/`, booking);
  return response.data;
};

export const deleteBooking = async (id: number) => {
  await api.delete(`/bookings/${id}/`);
};
