import axios from 'axios';
import { ServiceVoucher, CreateServiceVoucherInput, Booking } from '../types';
import { getAuthToken } from '../utils/auth';
import { refreshAccessToken } from './authService';

// Get the API URL from environment variables
const isDevelopment = import.meta.env.MODE === 'development';
const API_URL = isDevelopment 
  ? 'http://127.0.0.1:8000/api'
  : 'https://admin.ant.ae/api';

console.log('Current API URL:', API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = token;
    }
    console.log('Starting Request:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshAccessToken();
        const token = getAuthToken();
        if (token) {
          originalRequest.headers.Authorization = token;
        }
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const fetchServiceVouchers = async () => {
  const response = await api.get<{results: ServiceVoucher[]}>('/operations/service-vouchers/');
  return response.data.results;
};

export const fetchServiceVoucherById = async (id: number) => {
  const response = await api.get<ServiceVoucher>(`/operations/service-vouchers/${id}/`);
  return response.data;
};

export const createServiceVoucher = async (voucher: CreateServiceVoucherInput) => {
  const response = await api.post<ServiceVoucher>('/operations/service-vouchers/', voucher);
  return response.data;
};

export const updateServiceVoucher = async (id: number, voucher: Partial<ServiceVoucher>) => {
  const response = await api.patch<ServiceVoucher>(`/operations/service-vouchers/${id}/`, voucher);
  return response.data;
};

export const deleteServiceVoucher = async (id: number) => {
  await api.delete(`/operations/service-vouchers/${id}/`);
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
