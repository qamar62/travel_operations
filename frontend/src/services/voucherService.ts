import axios from 'axios';
import { api } from './api';
import { ServiceVoucher, CreateServiceVoucherInput } from '../types';

const API_URL = 'http://127.0.0.1:8000/api';

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ServiceVoucher[];
}

export const fetchServiceVouchers = async (
  page: number = 1,
  pageSize: number = 10
): Promise<ApiResponse> => {
  try {
    const response = await api.get(`/vouchers/?page=${page}&page_size=${pageSize}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service vouchers:', error);
    throw new Error('Failed to fetch service vouchers');
  }
};

export const createServiceVoucher = async (
  voucher: CreateServiceVoucherInput
): Promise<ServiceVoucher> => {
  try {
    const response = await api.post('/vouchers/', voucher);
    return response.data;
  } catch (error) {
    console.error('Error creating service voucher:', error);
    throw new Error('Failed to create service voucher');
  }
};

export const updateServiceVoucher = async (
  id: number,
  voucher: Partial<ServiceVoucher>
): Promise<ServiceVoucher> => {
  try {
    const response = await api.put(`/vouchers/${id}/`, voucher);
    return response.data;
  } catch (error) {
    console.error('Error updating service voucher:', error);
    throw new Error('Failed to update service voucher');
  }
};

export const deleteServiceVoucher = async (id: number): Promise<void> => {
  try {
    await api.delete(`/vouchers/${id}/`);
  } catch (error) {
    console.error('Error deleting service voucher:', error);
    throw new Error('Failed to delete service voucher');
  }
};
