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
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Collapse,
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

// Utility functions for status
const getVoucherStatus = (startDate: string, endDate: string): { status: string; color: 'success' | 'info' | 'default' } => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return { status: 'Upcoming', color: 'info' };
  if (now > end) return { status: 'Completed', color: 'default' };
  return { status: 'Active', color: 'success' };
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
  const voucherStatus = getVoucherStatus(voucher.travel_start_date, voucher.travel_end_date);

  return (
    <React.Fragment>
      <TableRow>
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
        <TableCell>{new Date(voucher.travel_start_date).toLocaleDateString()}</TableCell>
        <TableCell>
          <Chip
            label={voucherStatus.status}
            color={voucherStatus.color}
            size="small"
          />
        </TableCell>
        <TableCell>
          <Tooltip title="View Details">
            <IconButton onClick={() => voucher.id && handleViewVoucher(voucher.id)}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton onClick={() => voucher.id && handleEditVoucher(voucher.id)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Itinerary Details
              </Typography>
              <List>
                {voucher.itinerary_items.map((item: ItineraryItem) => (
                  <React.Fragment key={item.id}>
                    <ListItem 
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white' }}>
                            {`Day ${item.day} - ${new Date(item.date).toLocaleDateString()}`}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <List sx={{ ml: 2, mb: 2 }}>
                      {item.activities.map((activity: ItineraryActivity) => (
                        <ListItem key={activity.id}>
                          <ListItemText
                            primary={
                              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                {`${activity.time} - ${activity.activity_type_display}`}
                              </Typography>
                            }
                            secondary={activity.description}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Divider sx={{ my: 2 }} />
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
              <TableCell>Travel Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading...</TableCell>
              </TableRow>
            ) : vouchers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No vouchers found</TableCell>
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
