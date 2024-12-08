import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { fetchServiceVouchers, ServiceVoucher } from '../../services/voucherService';

const VoucherList: React.FC = () => {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<ServiceVoucher[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const loadVouchers = async () => {
      try {
        setLoading(true);
        const response = await fetchServiceVouchers(page + 1, rowsPerPage);
        setVouchers(response.results);
        setTotalCount(response.count);
      } catch (error) {
        console.error('Failed to load vouchers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadVouchers();
  }, [page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleViewVoucher = (id: number) => {
    navigate(`/vouchers/${id}`);
  };

  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.traveler.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.reservation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.hotel_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'info'; // Upcoming
    if (now > end) return 'default'; // Completed
    return 'success'; // Active
  };

  const getStatusText = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'Upcoming';
    if (now > end) return 'Completed';
    return 'Active';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Service Vouchers
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by traveler name, reservation number, or hotel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reservation Number</TableCell>
              <TableCell>Traveler</TableCell>
              <TableCell>Hotel</TableCell>
              <TableCell>Travel Dates</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading...</TableCell>
              </TableRow>
            ) : filteredVouchers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No vouchers found</TableCell>
              </TableRow>
            ) : (
              filteredVouchers.map((voucher) => (
                <TableRow key={voucher.id}>
                  <TableCell>{voucher.reservation_number}</TableCell>
                  <TableCell>{voucher.traveler.name}</TableCell>
                  <TableCell>{voucher.hotel_name}</TableCell>
                  <TableCell>
                    {new Date(voucher.travel_start_date).toLocaleDateString()} -{' '}
                    {new Date(voucher.travel_end_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(voucher.travel_start_date, voucher.travel_end_date)}
                      color={getStatusColor(voucher.travel_start_date, voucher.travel_end_date)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleViewVoucher(voucher.id)}
                      color="primary"
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default VoucherList;
