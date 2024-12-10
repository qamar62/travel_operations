import axios from 'axios';
import { ServiceVoucher, CreateServiceVoucherInput } from '../types';

const API_URL = 'http://127.0.0.1:8000/api';

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

export const updateServiceVoucher = async (id: number, voucher: ServiceVoucher) => {
  const response = await api.put<ServiceVoucher>(`/service-vouchers/${id}/`, voucher);
  return response.data;
};

export const deleteServiceVoucher = async (id: number) => {
  await api.delete(`/service-vouchers/${id}/`);
};
