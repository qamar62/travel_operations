import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { HotelVoucher, CreateHotelVoucherInput } from '../../types';
import { useNotification } from '../../context/NotificationContext';

interface HotelVoucherFormProps {
  initialData?: HotelVoucher;
  onSubmit: (data: CreateHotelVoucherInput) => Promise<void>;
  title: string;
}

const HotelVoucherForm: React.FC<HotelVoucherFormProps> = ({
  initialData,
  onSubmit,
  title,
}) => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateHotelVoucherInput>({
    guest_name: initialData?.guest_name || '',
    hotel_name: initialData?.hotel_name || '',
    hotel_address: initialData?.hotel_address || '',
    check_in_date: initialData?.check_in_date || '',
    check_out_date: initialData?.check_out_date || '',
    number_of_nights: initialData?.number_of_nights || 1,
    number_of_rooms: initialData?.number_of_rooms || 1,
    room_type: initialData?.room_type || '',
    confirmation_number: initialData?.confirmation_number || '',
    status: initialData?.status || 'pending'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateNights = () => {
    if (formData.check_in_date && formData.check_out_date) {
      const checkIn = new Date(formData.check_in_date);
      const checkOut = new Date(formData.check_out_date);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      setFormData(prev => ({ ...prev, number_of_nights: nights }));
    }
  };

  useEffect(() => {
    calculateNights();
  }, [formData.check_in_date, formData.check_out_date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      showNotification('Hotel voucher saved successfully', 'success');
      navigate('/hotel-vouchers');
    } catch (error) {
      showNotification('Failed to save hotel voucher', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {title}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Guest Name"
              name="guest_name"
              value={formData.guest_name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Hotel Name"
              name="hotel_name"
              value={formData.hotel_name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Hotel Address"
              name="hotel_address"
              value={formData.hotel_address}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Check-in Date"
              name="check_in_date"
              value={formData.check_in_date}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Check-out Date"
              name="check_out_date"
              value={formData.check_out_date}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Number of Rooms"
              name="number_of_rooms"
              value={formData.number_of_rooms}
              onChange={handleChange}
              required
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Number of Nights"
              name="number_of_nights"
              value={formData.number_of_nights}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Confirmation Number"
              name="confirmation_number"
              value={formData.confirmation_number}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Room Type"
              name="room_type"
              value={formData.room_type}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/hotel-vouchers')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default HotelVoucherForm;
