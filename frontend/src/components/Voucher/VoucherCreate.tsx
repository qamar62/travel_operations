import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ServiceVoucherForm from './ServiceVoucherForm';
import { api } from '../../services/api';
import { CreateServiceVoucherInput } from '../../types';

const VoucherCreate: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateServiceVoucherInput) => {
    try {
      await api.post('/operations/service-vouchers/', data);
      navigate('/vouchers');
    } catch (error) {
      console.error('Error creating voucher:', error);
      setError('Failed to create voucher');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Create New Voucher
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <ServiceVoucherForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/vouchers')}
        isOpen={true}
        mode="create"
      />
    </Box>
  );
};

export default VoucherCreate;
