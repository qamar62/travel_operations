import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ServiceVoucher, CreateServiceVoucherInput, Traveler, ItineraryActivity, ItineraryItem } from '../../types';
import { createServiceVoucher } from '../../services/api';

interface CreateVoucherModalProps {
  open: boolean;
  onClose: () => void;
  onVoucherCreated: (voucher: ServiceVoucher) => void;
}

const initialVoucherState: CreateServiceVoucherInput = {
  traveler: {
    name: '',
    num_adults: 1,
    num_infants: 0,
    contact_email: '',
    contact_phone: '',
  } as Traveler,
  room_allocations: [],
  itinerary_items: [],
  travel_start_date: '',
  travel_end_date: '',
  reservation_number: '',
  hotel_name: '',
  total_rooms: 1,
  transfer_type: 'GROUP',
  meal_plan: 'HB',
  transfer_type_display: 'Group Transfer',
  meal_plan_display: 'Half Board',
  hotel_confirmation_number: '',
  inclusions: '',
  arrival_details: '',
  departure_details: '',
  meeting_point: '',
};

const CreateVoucherModal: React.FC<CreateVoucherModalProps> = ({
  open,
  onClose,
  onVoucherCreated,
}) => {
  const [formData, setFormData] = useState<CreateServiceVoucherInput>(initialVoucherState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('traveler.')) {
      const travelerField = name.split('.')[1];
      setFormData({
        ...formData,
        traveler: {
          ...formData.traveler,
          [travelerField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleActivityChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedActivities = [...itineraryItems];
    if (!updatedActivities[index]) {
      updatedActivities[index] = { id: 0, day: 1, date: new Date().toISOString().split('T')[0], activities: [] };
    }
    const activityIndex = updatedActivities[index].activities.length; // Get the current activity index
    updatedActivities[index].activities[activityIndex] = {
      id: 0, // Temporary value, will be replaced by server
      time: '',
      activity_type: 'OTHER',
      activity_type_display: 'Other',
      description: '',
      location: '',
      notes: '',
    };
    updatedActivities[index] = {
      ...updatedActivities[index],
      [name]: value,
    };
    setItineraryItems(updatedActivities);
  };

  const addActivity = () => {
    setItineraryItems([...itineraryItems, { id: 0, day: 1, date: new Date().toISOString().split('T')[0], activities: [{ id: 0, time: '', activity_type: 'OTHER', activity_type_display: 'Other', description: '', location: '', notes: '' }] }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await createServiceVoucher({ ...formData, itinerary_items: itineraryItems });
      onVoucherCreated(response);
      onClose();
      setFormData(initialVoucherState);
      setItineraryItems([]);
    } catch (err) {
      setError('Failed to create service voucher. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: 800,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Create New Service Voucher</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Traveler Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Traveler Information</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Traveler Name"
                name="traveler.name"
                value={formData.traveler.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Email"
                name="traveler.contact_email"
                type="email"
                value={formData.traveler.contact_email}
                onChange={handleChange}
              />
            </Grid>

            {/* Booking Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Booking Details</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hotel Name"
                name="hotel_name"
                value={formData.hotel_name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reservation Number"
                name="reservation_number"
                value={formData.reservation_number}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Travel Start Date"
                name="travel_start_date"
                type="date"
                value={formData.travel_start_date}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Travel End Date"
                name="travel_end_date"
                type="date"
                value={formData.travel_end_date}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Itinerary Activities */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Itinerary Activities</Typography>
              {itineraryItems.map((item, index) => (
                <Box key={index} sx={{ mb: 2, border: '1px solid #ccc', p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Day"
                        name="day"
                        type="number"
                        value={item.day}
                        onChange={(e) => handleActivityChange(index, e)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date"
                        name="date"
                        type="date"
                        value={item.date}
                        onChange={(e) => handleActivityChange(index, e)}
                        required
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Time"
                        name="time"
                        type="time"
                        value={item.activities[0]?.time || ''}
                        onChange={(e) => handleActivityChange(index, e)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Activity Type"
                        name="activity_type"
                        select
                        value={item.activities[0]?.activity_type || 'OTHER'}
                        onChange={(e) => handleActivityChange(index, e)}
                        required
                      >
                        <MenuItem value="TRANSFER">Transfer</MenuItem>
                        <MenuItem value="TOUR">Tour/Activity</MenuItem>
                        <MenuItem value="CHECKIN">Hotel Check-in</MenuItem>
                        <MenuItem value="CHECKOUT">Hotel Check-out</MenuItem>
                        <MenuItem value="MEAL">Meal</MenuItem>
                        <MenuItem value="FREE">Free Time</MenuItem>
                        <MenuItem value="OTHER">Other</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={item.activities[0]?.description || ''}
                        onChange={(e) => handleActivityChange(index, e)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={item.activities[0]?.location || ''}
                        onChange={(e) => handleActivityChange(index, e)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Notes"
                        name="notes"
                        value={item.activities[0]?.notes || ''}
                        onChange={(e) => handleActivityChange(index, e)}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button variant="outlined" onClick={addActivity}>Add Activity</Button>
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Voucher'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateVoucherModal;
