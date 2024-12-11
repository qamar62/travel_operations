import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ServiceVoucher, RoomAllocation, ItineraryItem, ItineraryActivity } from '../../services/voucherService';

interface ServiceVoucherFormProps {
  initialData?: ServiceVoucher;
  onSubmit: (data: ServiceVoucher) => void;
  onCancel: () => void;
  isOpen: boolean;
  mode: 'create' | 'edit';
}

const ROOM_TYPES = [
  { value: 'SGL', label: 'Single Room' },
  { value: 'DBL', label: 'Double Room' },
  { value: 'TWN', label: 'Twin Room' },
  { value: 'TPL', label: 'Triple Room' },
];

const ACTIVITY_TYPES = [
  { value: 'arrival', label: 'Arrival' },
  { value: 'departure', label: 'Departure' },
  { value: 'tour', label: 'Tour' },
  { value: 'meal', label: 'Meal' },
  { value: 'leisure', label: 'Leisure' },
];

const TRANSFER_TYPES = [
  { value: 'PRIVATE', label: 'Private Transfer' },
  { value: 'SHARED', label: 'Shared Transfer' },
  { value: 'GROUP', label: 'Group Transfer' },
];

const MEAL_PLANS = [
  { value: 'BB', label: 'Bed and Breakfast' },
  { value: 'HB', label: 'Half Board' },
  { value: 'FB', label: 'Full Board' },
  { value: 'AI', label: 'All Inclusive' },
];

const ServiceVoucherForm: React.FC<ServiceVoucherFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isOpen,
  mode
}) => {
  const [formData, setFormData] = useState<ServiceVoucher>(initialData || {
    traveler: {
      name: '',
      num_adults: 1,
      num_infants: 0,
      contact_email: '',
      contact_phone: '',
    },
    reservation_number: '',
    hotel_name: '',
    hotel_confirmation_number: '',
    travel_start_date: '',
    travel_end_date: '',
    transfer_type: 'PRIVATE',
    meal_plan: 'BB',
    inclusions: '',
    arrival_details: '',
    departure_details: '',
    meeting_point: '',
    room_allocations: [],
    itinerary_items: [],
  } as ServiceVoucher);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field: keyof ServiceVoucher) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleTravelerChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      traveler: {
        ...formData.traveler,
        [field]: field.includes('num_') ? Number(e.target.value) : e.target.value,
      },
    });
  };

  const addRoomAllocation = () => {
    const newRoom: RoomAllocation = {
      id: Math.random(), // Temporary ID for frontend
      room_type: 'DBL',
      room_type_display: 'Double Room',
      quantity: 1,
    };
    setFormData({
      ...formData,
      room_allocations: [...formData.room_allocations, newRoom],
    });
  };

  const removeRoomAllocation = (index: number) => {
    const newRooms = [...formData.room_allocations];
    newRooms.splice(index, 1);
    setFormData({
      ...formData,
      room_allocations: newRooms,
    });
  };

  const handleRoomChange = (index: number, field: keyof RoomAllocation) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const newRooms = [...formData.room_allocations];
    newRooms[index] = {
      ...newRooms[index],
      [field]: field === 'quantity' ? Number(e.target.value) : e.target.value,
      room_type_display: field === 'room_type' 
        ? ROOM_TYPES.find(type => type.value === e.target.value)?.label || ''
        : newRooms[index].room_type_display,
    };
    setFormData({
      ...formData,
      room_allocations: newRooms,
    });
  };

  const addItineraryItem = () => {
    const newItem: ItineraryItem = {
      id: Math.random(), // Temporary ID for frontend
      day: formData.itinerary_items.length + 1,
      date: formData.travel_start_date,
      time: '',
      activities: [],
    };
    setFormData({
      ...formData,
      itinerary_items: [...formData.itinerary_items, newItem],
    });
  };

  const removeItineraryItem = (index: number) => {
    const newItems = [...formData.itinerary_items];
    newItems.splice(index, 1);
    // Recalculate days
    newItems.forEach((item, idx) => {
      item.day = idx + 1;
    });
    setFormData({
      ...formData,
      itinerary_items: newItems,
    });
  };

  const addActivity = (itineraryIndex: number) => {
    const newActivity: ItineraryActivity = {
      id: Math.random(), // Temporary ID for frontend
      time: '09:00',
      activity_type: 'tour',
      activity_type_display: 'Tour',
      description: '',
      location: '',
      notes: '',
    };
    const newItems = [...formData.itinerary_items];
    newItems[itineraryIndex].activities.push(newActivity);
    setFormData({
      ...formData,
      itinerary_items: newItems,
    });
  };

  const removeActivity = (itineraryIndex: number, activityIndex: number) => {
    const newItems = [...formData.itinerary_items];
    newItems[itineraryIndex].activities.splice(activityIndex, 1);
    setFormData({
      ...formData,
      itinerary_items: newItems,
    });
  };

  const handleActivityChange = (
    itineraryIndex: number,
    activityIndex: number,
    field: keyof ItineraryActivity
  ) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const newItems = [...formData.itinerary_items];
    newItems[itineraryIndex].activities[activityIndex] = {
      ...newItems[itineraryIndex].activities[activityIndex],
      [field]: e.target.value,
      activity_type_display: field === 'activity_type'
        ? ACTIVITY_TYPES.find(type => type.value === e.target.value)?.label || ''
        : newItems[itineraryIndex].activities[activityIndex].activity_type_display,
    };
    setFormData({
      ...formData,
      itinerary_items: newItems,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      maxWidth="lg"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        {mode === 'create' ? 'Create Service Voucher' : 'Edit Service Voucher'}
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Traveler Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Traveler Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Name"
                    name="traveler.name"
                    value={formData.traveler?.name || ''}
                    onChange={handleTravelerChange('name')}
                    disabled={mode === 'edit'}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    fullWidth
                    label="Number of Adults"
                    name="traveler.num_adults"
                    type="number"
                    value={formData.traveler?.num_adults || 1}
                    onChange={handleTravelerChange('num_adults')}
                    disabled={mode === 'edit'}
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Number of Infants"
                    name="traveler.num_infants"
                    type="number"
                    value={formData.traveler?.num_infants || 0}
                    onChange={handleTravelerChange('num_infants')}
                    disabled={mode === 'edit'}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Email"
                    name="traveler.contact_email"
                    type="email"
                    value={formData.traveler?.contact_email || ''}
                    onChange={handleTravelerChange('contact_email')}
                    disabled={mode === 'edit'}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Phone"
                    name="traveler.contact_phone"
                    value={formData.traveler?.contact_phone || ''}
                    onChange={handleTravelerChange('contact_phone')}
                    disabled={mode === 'edit'}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Reservation Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Reservation Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Reservation Number"
                    name="reservation_number"
                    value={formData.reservation_number || ''}
                    onChange={handleChange('reservation_number')}
                    disabled={mode === 'edit'}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Hotel Name"
                    value={formData.hotel_name}
                    onChange={handleChange('hotel_name')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Hotel Confirmation Number"
                    value={formData.hotel_confirmation_number}
                    onChange={handleChange('hotel_confirmation_number')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Transfer Type</InputLabel>
                    <Select
                      value={formData.transfer_type}
                      onChange={handleChange('transfer_type')}
                      label="Transfer Type"
                    >
                      {TRANSFER_TYPES.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Meal Plan</InputLabel>
                    <Select
                      value={formData.meal_plan}
                      onChange={handleChange('meal_plan')}
                      label="Meal Plan"
                    >
                      {MEAL_PLANS.map(plan => (
                        <MenuItem key={plan.value} value={plan.value}>
                          {plan.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Travel Start Date"
                    type="date"
                    value={formData.travel_start_date.split('T')[0]}
                    onChange={handleChange('travel_start_date')}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Travel End Date"
                    type="date"
                    value={formData.travel_end_date.split('T')[0]}
                    onChange={handleChange('travel_end_date')}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Room Allocations */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Room Allocations</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addRoomAllocation}
                  variant="outlined"
                  size="small"
                >
                  Add Room
                </Button>
              </Box>
              {formData.room_allocations.map((room, index) => (
                <Paper key={room.id} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <FormControl fullWidth>
                        <InputLabel>Room Type</InputLabel>
                        <Select
                          value={room.room_type}
                          onChange={handleRoomChange(index, 'room_type')}
                          label="Room Type"
                          required
                        >
                          {ROOM_TYPES.map(type => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        value={room.quantity}
                        onChange={handleRoomChange(index, 'quantity')}
                        InputProps={{ inputProps: { min: 1 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <IconButton
                        onClick={() => removeRoomAllocation(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Grid>

            {/* Itinerary */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Itinerary</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addItineraryItem}
                  variant="outlined"
                  size="small"
                >
                  Add Day
                </Button>
              </Box>
              {formData.itinerary_items.map((item, itemIndex) => (
                <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">Day {item.day}</Typography>
                    <Box>
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => addActivity(itemIndex)}
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        Add Activity
                      </Button>
                      <IconButton
                        onClick={() => removeItineraryItem(itemIndex)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    value={item.date.split('T')[0]}
                    onChange={(e) => {
                      const newItems = [...formData.itinerary_items];
                      newItems[itemIndex].date = e.target.value;
                      setFormData({
                        ...formData,
                        itinerary_items: newItems,
                      });
                    }}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                  />
                  {item.activities.map((activity, activityIndex) => (
                    <Paper key={activity.id} sx={{ p: 2, mb: 2 }} variant="outlined">
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                          <TextField
                            fullWidth
                            label="Time"
                            type="time"
                            value={activity.time}
                            onChange={handleActivityChange(itemIndex, activityIndex, 'time')}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <FormControl fullWidth>
                            <InputLabel>Activity Type</InputLabel>
                            <Select
                              value={activity.activity_type}
                              onChange={handleActivityChange(itemIndex, activityIndex, 'activity_type')}
                              label="Activity Type"
                            >
                              {ACTIVITY_TYPES.map(type => (
                                <MenuItem key={type.value} value={type.value}>
                                  {type.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                          <TextField
                            fullWidth
                            label="Description"
                            value={activity.description}
                            onChange={handleActivityChange(itemIndex, activityIndex, 'description')}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Location"
                            value={activity.location}
                            onChange={handleActivityChange(itemIndex, activityIndex, 'location')}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <TextField
                              fullWidth
                              label="Notes"
                              value={activity.notes}
                              onChange={handleActivityChange(itemIndex, activityIndex, 'notes')}
                            />
                            <IconButton
                              onClick={() => removeActivity(itemIndex, activityIndex)}
                              color="error"
                              sx={{ ml: 1 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Paper>
              ))}
            </Grid>

            {/* Additional Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Additional Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Inclusions"
                    multiline
                    rows={3}
                    value={formData.inclusions}
                    onChange={handleChange('inclusions')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Arrival Details"
                    multiline
                    rows={2}
                    value={formData.arrival_details}
                    onChange={handleChange('arrival_details')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Departure Details"
                    multiline
                    rows={2}
                    value={formData.departure_details}
                    onChange={handleChange('departure_details')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Meeting Point"
                    value={formData.meeting_point}
                    onChange={handleChange('meeting_point')}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {mode === 'create' ? 'Create' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceVoucherForm;
