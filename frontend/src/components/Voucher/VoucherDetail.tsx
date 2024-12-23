import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Badge,
} from '@mui/material';
import {
  Print as PrintIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ServiceVoucher, RoomAllocation, ItineraryItem, ItineraryActivity } from '../../types';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import './VoucherDetail.css';

const VoucherDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [voucher, setVoucher] = useState<ServiceVoucher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const voucherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        setLoading(true);
        const response = await api.get<ServiceVoucher>(`/service-vouchers/${id}/`);
        console.log('Fetched voucher:', response.data);
        setVoucher(response.data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch voucher:', error);
        setError('Failed to fetch voucher details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVoucher();
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (voucherRef.current) {
      const canvas = await html2canvas(voucherRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`voucher-${id}.pdf`);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !voucher) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error || 'Voucher not found'}</Typography>
      </Box>
    );
  }

  return (
    <Box ref={voucherRef} className="voucher-detail" p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Service Voucher #{voucher.id}</Typography>
        <Box>
          <IconButton onClick={handlePrint} title="Print">
            <PrintIcon />
          </IconButton>
          <IconButton onClick={handleDownloadPDF} title="Download PDF">
            <DownloadIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Traveler Information</Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Name" 
                secondary={voucher.traveler.name} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Contact" 
                secondary={
                  <Box>
                    <Typography>{voucher.traveler.contact_email}</Typography>
                    <Typography>{voucher.traveler.contact_phone}</Typography>
                  </Box>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Group Size" 
                secondary={`${voucher.traveler.num_adults} Adults${voucher.traveler.num_children ? `, ${voucher.traveler.num_children} Children` : ''}${voucher.traveler.num_infants ? `, ${voucher.traveler.num_infants} Infants` : ''}`} 
              />
            </ListItem>
          </List>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Booking Details</Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Hotel" 
                secondary={voucher.hotel_name} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Confirmation Number" 
                secondary={voucher.hotel_confirmation_number} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Travel Dates" 
                secondary={`${voucher.travel_start_date} to ${voucher.travel_end_date}`} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Meal Plan" 
                secondary={voucher.meal_plan_display} 
              />
            </ListItem>
          </List>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Room Allocations</Typography>
          <List>
            {voucher.room_allocations.map((room: RoomAllocation, index: number) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={`Room ${index + 1}`} 
                  secondary={`${room.quantity}x ${room.room_type_display || room.room_type} - ${room.num_adults} Adults${room.num_children ? `, ${room.num_children} Children` : ''}${room.num_infants ? `, ${room.num_infants} Infants` : ''}`} 
                />
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Itinerary</Typography>
          <List>
            {voucher.itinerary_items?.map((item: any, index: number) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={`Day ${index + 1}`} 
                  secondary={
                    <Box>
                      {item.activities?.map((activity: any, actIndex: number) => (
                        <Typography key={actIndex}>
                          {activity.time}: {activity.description}
                        </Typography>
                      ))}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Additional Information</Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Transfer Type" 
                secondary={voucher.transfer_type_display} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Meeting Point" 
                secondary={voucher.meeting_point} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Arrival Details" 
                secondary={voucher.arrival_details} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Departure Details" 
                secondary={voucher.departure_details} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Inclusions" 
                secondary={voucher.inclusions} 
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VoucherDetail;
