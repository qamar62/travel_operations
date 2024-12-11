import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import { ServiceVoucher, fetchServiceVouchers, updateServiceVoucher } from '../../services/voucherService';
import ServiceVoucherForm from './ServiceVoucherForm';

const VoucherEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState<ServiceVoucher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVoucher = async () => {
      try {
        const response = await fetchServiceVouchers();
        const foundVoucher = response.results.find(v => v.id === Number(id));
        if (foundVoucher) {
          setVoucher(foundVoucher);
        }
      } catch (err) {
        console.error('Error loading voucher:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadVoucher();
    }
  }, [id]);

  const handleSubmit = async (data: ServiceVoucher) => {
    try {
      await updateServiceVoucher(Number(id), data);
      navigate(`/vouchers/${id}`);
    } catch (err) {
      console.error('Error updating voucher:', err);
    }
  };

  const handleCancel = () => {
    navigate(`/vouchers/${id}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!voucher) {
    return (
      <Container>
        <Typography color="error">Voucher not found</Typography>
      </Container>
    );
  }

  return (
    <ServiceVoucherForm
      initialData={voucher}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isOpen={true}
      mode="edit"
    />
  );
};

export default VoucherEdit;
