import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import ServiceVoucherForm from './ServiceVoucherForm';
import { api } from '../../services/api';
import { ServiceVoucher, CreateServiceVoucherInput } from '../../types';

const VoucherEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState<ServiceVoucher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        setLoading(true);
        const response = await api.get<ServiceVoucher>(`/operations/service-vouchers/${id}/`);
        setVoucher(response.data);
      } catch (error) {
        console.error('Error fetching voucher:', error);
        setError('Failed to load voucher');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVoucher();
    }
  }, [id]);

  const handleSubmit = async (data: CreateServiceVoucherInput) => {
    try {
      if (!id) throw new Error('No voucher ID provided');
      await api.patch(`/operations/service-vouchers/${id}/`, data);
      navigate('/vouchers');
    } catch (error) {
      console.error('Error updating voucher:', error);
      setError('Failed to update voucher');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!voucher) {
    return (
      <Box p={3}>
        <Typography>Voucher not found</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Edit Voucher
      </Typography>
      <ServiceVoucherForm
        initialData={voucher}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/vouchers')}
        isOpen={true}
        mode="edit"
      />
    </Box>
  );
};

export default VoucherEdit;
