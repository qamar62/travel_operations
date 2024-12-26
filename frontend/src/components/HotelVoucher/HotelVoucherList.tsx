import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
  Button,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { HotelVoucher } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { getHotelVouchers, deleteHotelVoucher } from '../../services/hotelVoucherService';

const HotelVoucherList: React.FC = () => {
  const [vouchers, setVouchers] = useState<HotelVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const data = await getHotelVouchers();
      console.log('Fetched vouchers:', data);
      setVouchers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      showNotification('Failed to fetch hotel vouchers', 'error');
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleView = (id: number) => {
    navigate(`/hotel-vouchers/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/hotel-vouchers/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteHotelVoucher(id);
      showNotification('Hotel voucher deleted successfully', 'success');
      fetchVouchers();
    } catch (error) {
      showNotification('Failed to delete hotel voucher', 'error');
    }
  };

  const handleCreate = () => {
    navigate('/hotel-vouchers/create');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Hotel Vouchers
        </Typography>
        <Button variant="contained" color="primary" onClick={handleCreate}>
          Create Hotel Voucher
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Guest Name</TableCell>
              <TableCell>Hotel Name</TableCell>
              <TableCell>Check-in Date</TableCell>
              <TableCell>Check-out Date</TableCell>
              <TableCell>Room Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vouchers && vouchers.length > 0 ? (
              vouchers.map((voucher) => (
                <TableRow key={voucher.id}>
                  <TableCell>{voucher.id}</TableCell>
                  <TableCell>{voucher.guest_name}</TableCell>
                  <TableCell>{voucher.hotel_name}</TableCell>
                  <TableCell>{new Date(voucher.check_in_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(voucher.check_out_date).toLocaleDateString()}</TableCell>
                  <TableCell>{voucher.room_type}</TableCell>
                  <TableCell>{voucher.status}</TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton onClick={() => handleView(voucher.id)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEdit(voucher.id)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(voucher.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No hotel vouchers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HotelVoucherList;
