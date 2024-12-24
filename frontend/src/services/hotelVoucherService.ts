import { api } from './api';
import { HotelVoucher, CreateHotelVoucherInput } from '../types';

interface ApiResponse<T> {
  results: T[];
  count: number;
}

export const getHotelVouchers = async (): Promise<HotelVoucher[]> => {
  const response = await api.get<ApiResponse<HotelVoucher>>('/operations/hotel-vouchers/');
  return response.data.results || [];
};

export const getHotelVoucher = async (id: number): Promise<HotelVoucher> => {
  const response = await api.get<HotelVoucher>(`/operations/hotel-vouchers/${id}/`);
  return response.data;
};

export const createHotelVoucher = async (data: CreateHotelVoucherInput): Promise<HotelVoucher> => {
  const response = await api.post<HotelVoucher>('/operations/hotel-vouchers/', data);
  return response.data;
};

export const updateHotelVoucher = async (id: number, data: Partial<CreateHotelVoucherInput>): Promise<HotelVoucher> => {
  const response = await api.put<HotelVoucher>(`/operations/hotel-vouchers/${id}/`, data);
  return response.data;
};

export const deleteHotelVoucher = async (id: number): Promise<void> => {
  await api.delete(`/operations/hotel-vouchers/${id}/`);
};
