import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  Flight as FlightIcon,
  Hotel as HotelIcon,
  DirectionsCar as TransferIcon,
  EventNote as EventIcon,
  TrendingUp,
  TrendingDown,
  LocalActivity,
  Group,
  AttachMoney,
} from '@mui/icons-material';
import { fetchServiceVouchers } from '../../services/voucherService';
import { ServiceVoucher } from '../../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const mockChartData = [
  { name: 'Jan', bookings: 65 },
  { name: 'Feb', bookings: 59 },
  { name: 'Mar', bookings: 80 },
  { name: 'Apr', bookings: 81 },
  { name: 'May', bookings: 56 },
  { name: 'Jun', bookings: 95 },
];

const Dashboard: React.FC = () => {
  const [vouchers, setVouchers] = useState<ServiceVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    loadVouchers();
  }, []);

  const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; trend?: 'up' | 'down' }> = ({ title, value, icon, trend }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>{icon}</Avatar>
          <Box>
            <Typography color="textSecondary" variant="subtitle2">
              {title}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Box>
          {trend && (
            <Box sx={{ ml: 'auto' }}>
              {trend === 'up' ? (
                <TrendingUp color="success" />
              ) : (
                <TrendingDown color="error" />
              )}
            </Box>
          )}
        </Box>
        <LinearProgress
          variant="determinate"
          value={70}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Welcome to Travel Operations
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Service Vouchers"
            value="22"
            icon={<LocalActivity />}
            trend="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Upcoming  Tasks"
            value="3"
            icon={<Group />}
            trend="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenue"
            value="AED 45.2K"
            icon={<AttachMoney />}
            trend="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Bookings"
            value="28"
            icon={<EventIcon />}
            trend="down"
          />
        </Grid>

        {/* Booking Trends Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Booking Trends" />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="bookings"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Recent Activities" />
            <CardContent>
              <List>
                {vouchers.slice(0, 5).map((voucher) => (
                  <React.Fragment key={voucher.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>
                          <HotelIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={voucher.traveler.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {voucher.hotel_name}
                            </Typography>
                            {` - ${new Date(voucher.travel_start_date).toLocaleDateString()}`}
                          </>
                        }
                      />
                      <Chip
                        label={voucher.transfer_type}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Service Distribution */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Service Distribution" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                      <FlightIcon />
                    </Avatar>
                    <Typography variant="h6">45%</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Flights
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                      <HotelIcon />
                    </Avatar>
                    <Typography variant="h6">30%</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Hotels
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                      <TransferIcon />
                    </Avatar>
                    <Typography variant="h6">15%</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Transfers
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                      <EventIcon />
                    </Avatar>
                    <Typography variant="h6">10%</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Activities
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
