import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Typography,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchServiceVouchers, deleteServiceVoucher } from '../../services/voucherService';
import { ServiceVoucher, ItineraryItem, ItineraryActivity } from '../../types';
import CreateVoucherModal from './CreateVoucherModal';

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
            {open ? <ViewIcon /> : <ViewIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{voucher.reservation_number}</TableCell>
        <TableCell>{voucher.traveler.name}</TableCell>
        <TableCell>{voucher.hotel_name}</TableCell>
        <TableCell>{new Date(voucher.travel_start_date).toLocaleDateString()}</TableCell>
        <TableCell>
          <Chip
            label={voucher.status}
            color={voucher.status === 'active' ? 'success' : 'default'}
            size="small"
          />
        </TableCell>
        <TableCell>
          <Tooltip title="View Details">
            <IconButton onClick={() => handleViewVoucher(voucher.id)}>
              <ViewIcon />
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
                {voucher.itinerary_items.map((item: ItineraryItem) => (
                  <React.Fragment key={item.id}>
                    <ListItem>
                      <ListItemText
                        primary={`Day ${item.day} - ${new Date(item.date).toLocaleDateString()}`}
                        secondary={
                          <List>
                            {item.activities.map((activity: ItineraryActivity) => (
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
  const [vouchers, setVouchers] = useState<ServiceVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(null);
  const navigate = useNavigate();

  const loadVouchers = async () => {
    try {
      setLoading(true);
      const response = await fetchServiceVouchers(1, 10);
      const sortedVouchers = [...response.results].sort((a: ServiceVoucher, b: ServiceVoucher) => {
        if (a.id && b.id) {
          return b.id - a.id;
        }
        return 0;
      });
      setVouchers(sortedVouchers);
    } catch (error) {
      console.error('Error loading vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVouchers();
  }, []);

  const handleViewVoucher = (id: number) => {
    navigate(`/vouchers/${id}`);
  };

  const handleEditVoucher = (id: number) => {
    navigate(`/vouchers/${id}/edit`);
  };

  const handleCreateVoucher = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleVoucherCreated = async (newVoucher: ServiceVoucher) => {
    await loadVouchers();
    setIsCreateModalOpen(false);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Service Vouchers
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={handleCreateVoucher}
        >
          Create Voucher
        </Button>
      </Box>

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
            ) : vouchers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No vouchers found</TableCell>
              </TableRow>
            ) : (
              vouchers.map((voucher: ServiceVoucher) => (
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

      <CreateVoucherModal
        open={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onVoucherCreated={handleVoucherCreated}
      />
    </Box>
  );
};

export default VoucherList;
