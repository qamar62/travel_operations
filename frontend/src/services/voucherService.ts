import { api } from './api';
import { ServiceVoucher, CreateServiceVoucherInput } from '../types';
import { getAuthToken } from '../utils/auth';

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
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await api.get(`/operations/service-vouchers/?page=${page}&page_size=${pageSize}`, {
      headers: {
        Authorization: token
      }
    });
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
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await api.post('/operations/service-vouchers/', voucher, {
      headers: {
        Authorization: token
      }
    });
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
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await api.patch(`/operations/service-vouchers/${id}/`, voucher, {
      headers: {
        Authorization: token
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating service voucher:', error);
    throw new Error('Failed to update service voucher');
  }
};

export const deleteServiceVoucher = async (id: number): Promise<void> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    await api.delete(`/operations/service-vouchers/${id}/`, {
      headers: {
        Authorization: token
      }
    });
  } catch (error) {
    console.error('Error deleting service voucher:', error);
    throw new Error('Failed to delete service voucher');
  }
};
