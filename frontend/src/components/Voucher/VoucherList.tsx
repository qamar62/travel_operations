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
  Tooltip,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Add as AddIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import { fetchServiceVouchers, ServiceVoucher } from '../../services/voucherService';
import CreateVoucherModal from './CreateVoucherModal';

// Utility functions moved outside components
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

interface ExpandableRowProps {
  voucher: ServiceVoucher;
  handleViewVoucher: (id: number) => void;
  handleEditVoucher: (id: number) => void;
}

const ExpandableRow: React.FC<ExpandableRowProps> = ({
  voucher,
  handleViewVoucher,
  handleEditVoucher,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{voucher.reservation_number}</TableCell>
        <TableCell>{voucher.traveler.name}</TableCell>
        <TableCell>{voucher.hotel_name}</TableCell>
        <TableCell>{new Date(voucher.travel_start_date).toLocaleDateString()}</TableCell>
        <TableCell>
          <Chip
            label={getStatusText(voucher.travel_start_date, voucher.travel_end_date)}
            color={getStatusColor(voucher.travel_start_date, voucher.travel_end_date) as any}
            size="small"
          />
        </TableCell>
        <TableCell>
          <Tooltip title="View Details">
            <IconButton onClick={() => handleViewVoucher(voucher.id)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEditVoucher(voucher.id)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Itinerary Details
              </Typography>
              <List>
                {voucher.itinerary_items.map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem>
                      <ListItemText
                        primary={`Day ${item.day} - ${new Date(item.date).toLocaleDateString()}`}
                        secondary={
                          <List>
                            {item.activities.map((activity) => (
                              <ListItem key={activity.id}>
                                <ListItemText
                                  primary={`${activity.time} - ${activity.activity_type_display}`}
                                  secondary={activity.description}
                                />
                              </ListItem>
                            ))}
                          </List>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const VoucherList: React.FC = () => {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<ServiceVoucher[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadVouchers = async () => {
    try {
      setLoading(true);
      const response = await fetchServiceVouchers(page + 1, rowsPerPage);
      setVouchers(response.results);
      setTotalCount(response.count);
    } catch (error) {
      console.error('Error loading vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVouchers();
  }, [page, rowsPerPage]);

  const handleViewVoucher = (id: number) => {
    navigate(`/vouchers/${id}`);
  };

  const handleEditVoucher = (id: number) => {
    navigate(`/vouchers/${id}/edit`);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleCreateVoucher = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleVoucherCreated = async (newVoucher: ServiceVoucher) => {
    await loadVouchers(); // Reload the list to include the new voucher
    setIsCreateModalOpen(false);
  };

  // Filter vouchers based on search term
  const filteredVouchers = vouchers.filter((voucher) =>
    Object.values({
      ...voucher,
      travelerName: voucher.traveler.name,
    }).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Service Vouchers
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateVoucher}
        >
          Create Voucher
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search vouchers..."
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Reservation #</TableCell>
              <TableCell>Traveler</TableCell>
              <TableCell>Hotel</TableCell>
              <TableCell>Travel Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading...</TableCell>
              </TableRow>
            ) : filteredVouchers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No vouchers found</TableCell>
              </TableRow>
            ) : (
              filteredVouchers.map((voucher) => (
                <ExpandableRow
                  key={voucher.id}
                  voucher={voucher}
                  handleViewVoucher={handleViewVoucher}
                  handleEditVoucher={handleEditVoucher}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <CreateVoucherModal
        open={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onVoucherCreated={handleVoucherCreated}
      />
    </Box>
  );
};

export default VoucherList;
