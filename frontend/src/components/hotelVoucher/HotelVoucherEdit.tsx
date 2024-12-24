import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { HotelVoucher, CreateHotelVoucherInput } from '../../types';
import { getHotelVoucher, updateHotelVoucher } from '../../services/hotelVoucherService';
import HotelVoucherForm from './HotelVoucherForm';
import { useNotification } from '../../context/NotificationContext';

const HotelVoucherEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [voucher, setVoucher] = useState<HotelVoucher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        if (!id) return;
        const data = await getHotelVoucher(parseInt(id));
        setVoucher(data);
      } catch (error) {
        showNotification('Failed to fetch hotel voucher', 'error');
        navigate('/hotel-vouchers');
      } finally {
        setLoading(false);
      }
    };

    fetchVoucher();
  }, [id, navigate, showNotification]);

  const handleSubmit = async (data: CreateHotelVoucherInput) => {
    if (!id) return;
    await updateHotelVoucher(parseInt(id), data);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!voucher) {
    return null;
  }

  return (
    <HotelVoucherForm
      initialData={voucher}
      onSubmit={handleSubmit}
      title="Edit Hotel Voucher"
    />
  );
};

export default HotelVoucherEdit;
