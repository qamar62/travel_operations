export interface ServiceVoucher {
  id: number;
  service_type: string;
  customer_name: string;
  service_date: string;
  status: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceVoucherInput {
  service_type: string;
  customer_name: string;
  service_date: string;
  status: string;
  description: string;
}

export interface HotelVoucher {
  id: number;
  guest_name: string;
  hotel_name: string;
  check_in_date: string;
  check_out_date: string;
  room_type: string;
  status: string;
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateHotelVoucherInput {
  guest_name: string;
  hotel_name: string;
  check_in_date: string;
  check_out_date: string;
  room_type: string;
  status: string;
  special_requests?: string;
}

export interface Booking {
  id: number;
  customer_name: string;
  booking_date: string;
  status: string;
}
