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
  SelectChangeEvent
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { 
  ServiceVoucher,
  CreateServiceVoucherInput,
  VoucherFormProps
} from '../../types';

const ROOM_TYPES = [
  { value: 'SGL', label: 'Single Room' },
  { value: 'DBL', label: 'Double Room' },
  { value: 'TWN', label: 'Twin Room' },
  { value: 'TPL', label: 'Triple Room' },
];

const MEAL_PLANS = [
  { value: 'BB', label: 'Bed and Breakfast' },
  { value: 'HB', label: 'Half Board' },
  { value: 'FB', label: 'Full Board' },
  { value: 'AI', label: 'All Inclusive' },
];

const TRANSFER_TYPES = [
  { value: 'PRIVATE', label: 'Private Transfer' },
  { value: 'SHARED', label: 'Shared Transfer' },
  { value: 'GROUP', label: 'Group Transfer' },
];

const ACTIVITY_TYPES = [
  { value: 'TRANSFER', label: 'Transfer' },
  { value: 'TOUR', label: 'Tour/Activity' },
  { value: 'CHECKIN', label: 'Hotel Check-in' },
  { value: 'CHECKOUT', label: 'Hotel Check-out' },
  { value: 'MEAL', label: 'Meal' },
  { value: 'FREE', label: 'Free Time' },
  { value: 'OTHER', label: 'Other' }
];

const ServiceVoucherForm: React.FC<VoucherFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isOpen,
  mode
}) => {
  const [formData, setFormData] = useState<CreateServiceVoucherInput>(() => {
    if (initialData) {
      const { id, created_at, updated_at, ...rest } = initialData;
      return rest;
    }
    return {
      service_type: 'HOTEL',
      customer_name: '',
      service_date: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      description: '',
      traveler: {
        name: '',
        num_adults: 1,
        num_children: 0,
        num_infants: 0,
        contact_email: '',
        contact_phone: '',
      },
      room_allocations: [{
        room_type: 'DBL',
        room_type_display: 'Double Room',
        quantity: 1,
        num_adults: 2,
        num_children: 0,
        num_infants: 0
      }],
      itinerary_items: [],
      travel_start_date: '',
      travel_end_date: '',
      reservation_number: '',
      hotel_name: '',
      total_rooms: 1,
      transfer_type: 'PRIVATE',
      transfer_type_display: 'Private Transfer',
      meal_plan: 'BB',
      meal_plan_display: 'Bed & Breakfast',
      inclusions: '',
      arrival_details: '',
      departure_details: '',
      meeting_point: '',
      hotel_confirmation_number: '',
    };
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const submissionData = {
      ...formData,
      total_rooms: formData.room_allocations.reduce((sum: number, room) => sum + room.quantity, 0)
    };
    onSubmit(submissionData);
  };

  const handleChange = (field: keyof CreateServiceVoucherInput) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleTravelerChange = (field: keyof BaseTraveler) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      traveler: {
        ...prev.traveler,
        [field]: field.includes('num_') ? Number(e.target.value) : e.target.value,
      },
    }));
  };

  const handleRoomChange = (index: number, field: keyof RoomAllocation) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const newRooms = [...formData.room_allocations];
    const value = field.includes('num_') || field === 'quantity' ? Number(e.target.value) : e.target.value;
    
    newRooms[index] = {
      ...newRooms[index],
      [field]: value,
      ...(field === 'room_type' && {
        room_type_display: ROOM_TYPES.find(type => type.value === value)?.label || ''
      })
    };
    
    setFormData(prev => ({
      ...prev,
      room_allocations: newRooms,
    }));
  };

  const addRoom = () => {
    setFormData(prev => ({
      ...prev,
      room_allocations: [
        ...prev.room_allocations,
        {
          room_type: 'DBL',
          room_type_display: 'Double Room',
          quantity: 1,
          num_adults: 2,
          num_children: 0,
          num_infants: 0
        }
      ],
    }));
  };

  const removeRoom = (index: number) => {
    setFormData(prev => ({
      ...prev,
      room_allocations: prev.room_allocations.filter((_: any, i: number) => i !== index),
    }));
  };

  const addItineraryItem = () => {
    const newItem = {
      day: formData.itinerary_items.length + 1,
      date: formData.travel_start_date,
      activities: [],
    };
    setFormData(prev => ({
      ...prev,
      itinerary_items: [...prev.itinerary_items, newItem],
    }));
  };

  const removeItineraryItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary_items: prev.itinerary_items.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleItineraryChange = (index: number, field: keyof ItineraryItem) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newItems = [...formData.itinerary_items];
    newItems[index] = {
      ...newItems[index],
      [field]: e.target.value,
    };
    setFormData(prev => ({
      ...prev,
      itinerary_items: newItems,
    }));
  };

  const addActivity = (itemIndex: number) => {
    const newItems = [...formData.itinerary_items];
    newItems[itemIndex].activities.push({
      time: '',
      activity_type: 'TRANSFER',
      activity_type_display: 'Transfer',
      description: '',
    });
    setFormData(prev => ({
      ...prev,
      itinerary_items: newItems,
    }));
  };

  const removeActivity = (itemIndex: number, activityIndex: number) => {
    const newItems = [...formData.itinerary_items];
    newItems[itemIndex].activities.splice(activityIndex, 1);
    setFormData(prev => ({
      ...prev,
      itinerary_items: newItems,
    }));
  };

  const handleActivityChange = (itemIndex: number, activityIndex: number, field: keyof ItineraryActivity) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const newItems = [...formData.itinerary_items];
    const value = e.target.value;
    newItems[itemIndex].activities[activityIndex] = {
      ...newItems[itemIndex].activities[activityIndex],
      [field]: value,
      ...(field === 'activity_type' && {
        activity_type_display: ACTIVITY_TYPES.find(type => type.value === value)?.label || ''
      })
    };
    setFormData(prev => ({
      ...prev,
      itinerary_items: newItems,
    }));
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onCancel}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle>
        {mode === 'create' ? 'Create Service Voucher' : 'Edit Service Voucher'}
      </DialogTitle>
      
      <DialogContent sx={{ flexGrow: 1, overflow: 'auto', pb: 0 }}>
        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            pb: '70px' // Add padding to account for sticky buttons
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">Traveler Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Traveler Name"
                    value={formData.traveler.name}
                    onChange={handleTravelerChange('name')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact Email"
                    value={formData.traveler.contact_email}
                    onChange={handleTravelerChange('contact_email')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact Phone"
                    value={formData.traveler.contact_phone}
                    onChange={handleTravelerChange('contact_phone')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Number of Adults"
                    value={formData.traveler.num_adults}
                    onChange={handleTravelerChange('num_adults')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Number of Children"
                    value={formData.traveler.num_children}
                    onChange={handleTravelerChange('num_children')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Number of Infants"
                    value={formData.traveler.num_infants}
                    onChange={handleTravelerChange('num_infants')}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Hotel Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Hotel Name"
                    value={formData.hotel_name}
                    onChange={handleChange('hotel_name')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Hotel Confirmation Number"
                    value={formData.hotel_confirmation_number}
                    onChange={handleChange('hotel_confirmation_number')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Meal Plan</InputLabel>
                    <Select
                      value={formData.meal_plan}
                      onChange={handleChange('meal_plan')}
                      label="Meal Plan"
                    >
                      {MEAL_PLANS.map((plan) => (
                        <MenuItem key={plan.value} value={plan.value}>
                          {plan.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Room Allocations</Typography>
              {formData.room_allocations.map((room, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel>Room Type</InputLabel>
                        <Select
                          value={room.room_type}
                          onChange={handleRoomChange(index, 'room_type')}
                          label="Room Type"
                        >
                          {ROOM_TYPES.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Quantity"
                        value={room.quantity}
                        onChange={handleRoomChange(index, 'quantity')}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Adults"
                        value={room.num_adults}
                        onChange={handleRoomChange(index, 'num_adults')}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Children"
                        value={room.num_children}
                        onChange={handleRoomChange(index, 'num_children')}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Infants"
                        value={room.num_infants}
                        onChange={handleRoomChange(index, 'num_infants')}
                      />
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <IconButton 
                        onClick={() => removeRoom(index)}
                        disabled={formData.room_allocations.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={addRoom}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Add Room
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Itinerary</Typography>
              {formData.itinerary_items.map((item, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Day"
                        value={item.day}
                        onChange={handleItineraryChange(index, 'day')}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Date"
                        value={item.date}
                        onChange={handleItineraryChange(index, 'date')}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Activities</Typography>
                      {item.activities.map((activity, activityIndex) => (
                        <Box key={activityIndex} sx={{ mb: 2 }}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={2}>
                              <TextField
                                fullWidth
                                type="time"
                                label="Time"
                                value={activity.time}
                                onChange={handleActivityChange(index, activityIndex, 'time')}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <FormControl fullWidth>
                                <InputLabel>Activity Type</InputLabel>
                                <Select
                                  value={activity.activity_type}
                                  onChange={handleActivityChange(index, activityIndex, 'activity_type')}
                                  label="Activity Type"
                                >
                                  {ACTIVITY_TYPES.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                      {type.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="Description"
                                value={activity.description}
                                onChange={handleActivityChange(index, activityIndex, 'description')}
                              />
                            </Grid>
                            <Grid item xs={12} md={1}>
                              <IconButton onClick={() => removeActivity(index, activityIndex)}>
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => addActivity(index)}
                        variant="outlined"
                        size="small"
                      >
                        Add Activity
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton 
                          onClick={() => removeItineraryItem(index)}
                          disabled={formData.itinerary_items.length === 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={addItineraryItem}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Add Day
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Transfer Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Transfer Type</InputLabel>
                    <Select
                      value={formData.transfer_type}
                      onChange={handleChange('transfer_type')}
                      label="Transfer Type"
                    >
                      {TRANSFER_TYPES.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Additional Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Meeting Point"
                    value={formData.meeting_point}
                    onChange={handleChange('meeting_point')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Arrival Details"
                    value={formData.arrival_details}
                    onChange={handleChange('arrival_details')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Departure Details"
                    value={formData.departure_details}
                    onChange={handleChange('departure_details')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Inclusions"
                    value={formData.inclusions}
                    onChange={handleChange('inclusions')}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions 
        sx={{
          position: 'sticky',
          bottom: 0,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          p: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          zIndex: 1
        }}
      >
        <Button 
          onClick={onCancel}
          variant="outlined"
          color="inherit"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          color="primary"
        >
          {mode === 'create' ? 'Create Voucher' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceVoucherForm;
