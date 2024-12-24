import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Edit as EditIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { HotelVoucher } from '../../types';
import { getHotelVoucher } from '../../services/hotelVoucherService';
import { useNotification } from '../../context/NotificationContext';

const DetailRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <Grid container spacing={2} sx={{ py: 1 }}>
    <Grid item xs={4}>
      <Typography variant="subtitle1" color="text.secondary">
        {label}
      </Typography>
    </Grid>
    <Grid item xs={8}>
      <Typography variant="body1">{value}</Typography>
    </Grid>
  </Grid>
);

const HotelVoucherDetail: React.FC = () => {
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
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/hotel-vouchers')}
        >
          Back to List
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/hotel-vouchers/${id}/edit`)}
        >
          Edit
        </Button>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Hotel Voucher
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Confirmation #{voucher.confirmation_number}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Guest Information
          </Typography>
          <DetailRow label="Guest Name" value={voucher.guest_name} />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Hotel Information
          </Typography>
          <DetailRow label="Hotel Name" value={voucher.hotel_name} />
          <DetailRow label="Hotel Address" value={voucher.hotel_address} />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Booking Details
          </Typography>
          <DetailRow
            label="Check-in Date"
            value={new Date(voucher.check_in_date).toLocaleDateString()}
          />
          <DetailRow
            label="Check-out Date"
            value={new Date(voucher.check_out_date).toLocaleDateString()}
          />
          <DetailRow label="Number of Nights" value={voucher.number_of_nights} />
          <DetailRow label="Number of Rooms" value={voucher.number_of_rooms} />
        </Box>
      </Paper>
    </Box>
  );
};

export default HotelVoucherDetail;
