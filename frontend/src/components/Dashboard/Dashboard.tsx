import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { fetchServiceVouchers, ServiceVoucher } from '../../services/voucherService';
import StatsSection from './StatsSection';
import RecentVouchers from './RecentVouchers';
import CreateVoucherModal from './CreateVoucherModal';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [vouchers, setVouchers] = useState<ServiceVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      setLoading(true);
      const response = await fetchServiceVouchers();
      setVouchers(response.results);
      setError(null);
    } catch (error) {
      console.error('Failed to load service vouchers:', error);
      setError('Failed to load service vouchers');
    } finally {
      setLoading(false);
    }
  };

  const handleVoucherCreated = (newVoucher: ServiceVoucher) => {
    setVouchers([...vouchers, newVoucher]);
  };

  if (loading) {
    return (
      <Box className="dashboard-container">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="dashboard-container">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="dashboard-container">
      <Box className="dashboard-header">
        <Typography variant="h4" component="h1" gutterBottom>
          Travel Operations Dashboard
        </Typography>
        <IconButton
          color="primary"
          size="large"
          onClick={() => setIsCreateModalOpen(true)}
          className="add-voucher-button"
        >
          <AddIcon />
        </IconButton>
      </Box>

      <StatsSection vouchers={vouchers} />

      <Box sx={{ mt: 4 }}>
        <RecentVouchers vouchers={vouchers} />
      </Box>

      <CreateVoucherModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onVoucherCreated={handleVoucherCreated}
      />
    </Box>
  );
};

export default Dashboard;
