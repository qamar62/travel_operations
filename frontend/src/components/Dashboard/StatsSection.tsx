import React from 'react';
import { Card, Grid, Typography, Box } from '@mui/material';
import {
  Description as DescriptionIcon,
  People as PeopleIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import { ServiceVoucher } from '../../types';

interface StatsSectionProps {
  vouchers: ServiceVoucher[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ vouchers }) => {
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

  return (
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
  );
};

export default StatsSection;
