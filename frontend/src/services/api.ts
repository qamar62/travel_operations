import axios from 'axios';
import { ServiceVoucher, CreateServiceVoucherInput, Booking } from '../types';

// Get the API URL from environment variables
const isDevelopment = import.meta.env.MODE === 'development';
const API_URL = isDevelopment 
  ? 'http://127.0.0.1:8000/api'
  : 'https://admin.ant.ae/api';

console.log('Current API URL:', API_URL); // For debugging

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('Starting Request:', request.url);
  return request;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const fetchServiceVouchers = async () => {
  const response = await api.get<{results: ServiceVoucher[]}>('/vouchers/');
  return response.data.results;
};

export const fetchServiceVoucherById = async (id: number) => {
  const response = await api.get<ServiceVoucher>(`/vouchers/${id}/`);
  return response.data;
};

export const createServiceVoucher = async (voucher: CreateServiceVoucherInput) => {
  const response = await api.post<ServiceVoucher>(`/vouchers/`, voucher);
  return response.data;
};

export const updateServiceVoucher = async (id: number, voucher: Partial<ServiceVoucher>) => {
  const response = await api.patch<ServiceVoucher>(`/vouchers/${id}/`, voucher);
  return response.data;
};

export const deleteServiceVoucher = async (id: number) => {
  await api.delete(`/vouchers/${id}/`);
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
