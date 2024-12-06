import React, { useEffect, useState } from 'react';
import { Card, Grid, Typography, Box, IconButton, useTheme } from '@mui/material';
import {
  Description as DescriptionIcon,
  People as PeopleIcon,
  DateRange as DateRangeIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { fetchServiceVouchers, ServiceVoucher, ApiResponse } from '../../services/voucherService';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [vouchers, setVouchers] = useState<ServiceVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVouchers = async () => {
      try {
        setLoading(true);
        const response = await fetchServiceVouchers();
        const data = response as ApiResponse;
        setVouchers(data.results);
        setError(null);
      } catch (error) {
        console.error('Failed to load service vouchers:', error);
        setError('Failed to load service vouchers');
      } finally {
        setLoading(false);
      }
    };
    loadVouchers();
  }, []);

  const stats = [
    {
      title: 'Active Vouchers',
      count: vouchers.length,
      icon: <DescriptionIcon />,
      color: '#4CAF50',
    },
    {
      title: "Today's Arrivals",
      count: vouchers.filter(voucher => 
        new Date(voucher.travel_start_date).toDateString() === new Date().toDateString()
      ).length,
      icon: <PeopleIcon />,
      color: '#2196F3',
    },
    {
      title: 'Upcoming Tours',
      count: vouchers.filter(voucher => 
        new Date(voucher.travel_start_date) > new Date()
      ).length,
      icon: <DateRangeIcon />,
      color: '#FF9800',
    },
  ];

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
          onClick={() => {/* TODO: Add new voucher */}}
          className="add-voucher-button"
        >
          <AddIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3} className="stats-container">
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className="stat-card" sx={{ borderTop: `4px solid ${stat.color}` }}>
              <Box className="stat-content">
                <Box className="stat-icon" sx={{ color: stat.color }}>
                  {stat.icon}
                </Box>
                <Box className="stat-text">
                  <Typography variant="h3" component="div" className="stat-count">
                    {stat.count}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} className="dashboard-sections">
        <Grid item xs={12} md={8}>
          <Card className="recent-vouchers">
            <Typography variant="h6" component="h2" gutterBottom className="section-title">
              Recent Service Vouchers
            </Typography>
            <Box sx={{ mt: 2 }}>
              {vouchers.slice(0, 5).map((voucher) => (
                <Card key={voucher.id} sx={{ mb: 2, p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {voucher.traveler.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Reservation: {voucher.reservation_number}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">
                        Hotel: {voucher.hotel_name}
                      </Typography>
                      <Typography variant="body2">
                        Check-in: {new Date(voucher.travel_start_date).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="quick-actions">
            <Typography variant="h6" component="h2" gutterBottom className="section-title">
              Quick Actions
            </Typography>
            {/* TODO: Add quick action buttons */}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
