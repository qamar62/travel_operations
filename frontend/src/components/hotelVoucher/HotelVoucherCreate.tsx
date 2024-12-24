import React from 'react';
import { CreateHotelVoucherInput } from '../../types';
import { createHotelVoucher } from '../../services/hotelVoucherService';
import HotelVoucherForm from './HotelVoucherForm';

const HotelVoucherCreate: React.FC = () => {
  const handleSubmit = async (data: CreateHotelVoucherInput) => {
    await createHotelVoucher(data);
  };

  return (
    <HotelVoucherForm
      onSubmit={handleSubmit}
      title="Create Hotel Voucher"
    />
  );
};

export default HotelVoucherCreate;
