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
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ServiceVoucher, CreateServiceVoucherInput, Traveler, RoomAllocation, ItineraryActivity, ItineraryItem } from '../../types';
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

const steps = ['Traveler Details', 'Hotel & Room', 'Transfer & Meal', 'Itinerary'];

const CreateVoucherModal: React.FC<CreateVoucherModalProps> = ({
  open,
  onClose,
  onVoucherCreated,
}) => {
  const [formData, setFormData] = useState<CreateServiceVoucherInput>(initialVoucherState);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomAllocations, setRoomAllocations] = useState<RoomAllocation[]>([]);
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

  const handleRoomAllocationChange = (index: number, field: string, value: string | number) => {
    const updatedAllocations = [...roomAllocations];
    updatedAllocations[index] = {
      ...updatedAllocations[index],
      [field]: value,
    };
    setRoomAllocations(updatedAllocations);
    setFormData({
      ...formData,
      room_allocations: updatedAllocations,
    });
  };

  const addRoomAllocation = () => {
    setRoomAllocations([
      ...roomAllocations,
      { id: 0, room_type: 'DBL', room_type_display: 'Double', quantity: 1 },
    ]);
  };

  const handleActivityChange = (dayIndex: number, activityIndex: number, field: string, value: any) => {
    const updatedItems = [...itineraryItems];
    if (!updatedItems[dayIndex]) {
      updatedItems[dayIndex] = {
        id: 0,
        day: dayIndex + 1,
        date: formData.travel_start_date,
        activities: [],
      };
    }
    
    if (!updatedItems[dayIndex].activities[activityIndex]) {
      updatedItems[dayIndex].activities[activityIndex] = {
        id: 0,
        time: '',
        activity_type: 'OTHER',
        activity_type_display: 'Other',
        description: '',
        location: '',
        notes: '',
      };
    }

    updatedItems[dayIndex].activities[activityIndex] = {
      ...updatedItems[dayIndex].activities[activityIndex],
      [field]: value,
    };

    setItineraryItems(updatedItems);
  };

  const addActivity = (dayIndex: number) => {
    const updatedItems = [...itineraryItems];
    if (!updatedItems[dayIndex]) {
      updatedItems[dayIndex] = {
        id: 0,
        day: dayIndex + 1,
        date: formData.travel_start_date,
        activities: [],
      };
    }
    
    updatedItems[dayIndex].activities.push({
      id: 0,
      time: '',
      activity_type: 'OTHER',
      activity_type_display: 'Other',
      description: '',
      location: '',
      notes: '',
    });

    setItineraryItems(updatedItems);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        room_allocations: roomAllocations,
        itinerary_items: itineraryItems,
      };
      const response = await createServiceVoucher(submitData);
      onVoucherCreated(response);
      onClose();
      setFormData(initialVoucherState);
      setRoomAllocations([]);
      setItineraryItems([]);
      setActiveStep(0);
    } catch (err) {
      setError('Failed to create service voucher. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Phone"
                name="traveler.contact_phone"
                value={formData.traveler.contact_phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Number of Adults"
                name="traveler.num_adults"
                type="number"
                value={formData.traveler.num_adults}
                onChange={handleChange}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Number of Infants"
                name="traveler.num_infants"
                type="number"
                value={formData.traveler.num_infants}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
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
                label="Hotel Confirmation Number"
                name="hotel_confirmation_number"
                value={formData.hotel_confirmation_number}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Room Allocations</Typography>
              {roomAllocations.map((room, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Room Type"
                        value={room.room_type}
                        onChange={(e) => handleRoomAllocationChange(index, 'room_type', e.target.value)}
                      >
                        <MenuItem value="SGL">Single</MenuItem>
                        <MenuItem value="DBL">Double</MenuItem>
                        <MenuItem value="TWN">Twin</MenuItem>
                        <MenuItem value="TPL">Triple</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        value={room.quantity}
                        onChange={(e) => handleRoomAllocationChange(index, 'quantity', parseInt(e.target.value))}
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button variant="outlined" onClick={addRoomAllocation}>Add Room</Button>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Transfer Type"
                name="transfer_type"
                value={formData.transfer_type}
                onChange={handleChange}
                required
              >
                <MenuItem value="PRIVATE">Private Transfer</MenuItem>
                <MenuItem value="SHARED">Shared Transfer</MenuItem>
                <MenuItem value="GROUP">Group Transfer</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Meal Plan"
                name="meal_plan"
                value={formData.meal_plan}
                onChange={handleChange}
                required
              >
                <MenuItem value="BB">Bed and Breakfast</MenuItem>
                <MenuItem value="HB">Half Board</MenuItem>
                <MenuItem value="FB">Full Board</MenuItem>
                <MenuItem value="AI">All Inclusive</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Inclusions"
                name="inclusions"
                value={formData.inclusions}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Arrival Details"
                name="arrival_details"
                value={formData.arrival_details}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Departure Details"
                name="departure_details"
                value={formData.departure_details}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meeting Point"
                name="meeting_point"
                value={formData.meeting_point}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={2}>
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
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Itinerary</Typography>
              {Array.from({ length: calculateDays() }).map((_, dayIndex) => (
                <Paper key={dayIndex} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Day {dayIndex + 1}
                  </Typography>
                  {(itineraryItems[dayIndex]?.activities || []).map((activity, activityIndex) => (
                    <Box key={activityIndex} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Time"
                            type="time"
                            value={activity.time}
                            onChange={(e) => handleActivityChange(dayIndex, activityIndex, 'time', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            select
                            label="Activity Type"
                            value={activity.activity_type}
                            onChange={(e) => handleActivityChange(dayIndex, activityIndex, 'activity_type', e.target.value)}
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
                            value={activity.description}
                            onChange={(e) => handleActivityChange(dayIndex, activityIndex, 'description', e.target.value)}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Location"
                            value={activity.location}
                            onChange={(e) => handleActivityChange(dayIndex, activityIndex, 'location', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Notes"
                            value={activity.notes}
                            onChange={(e) => handleActivityChange(dayIndex, activityIndex, 'notes', e.target.value)}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                  <Button variant="outlined" onClick={() => addActivity(dayIndex)}>
                    Add Activity for Day {dayIndex + 1}
                  </Button>
                </Paper>
              ))}
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  const calculateDays = () => {
    if (!formData.travel_start_date || !formData.travel_end_date) return 1;
    const start = new Date(formData.travel_start_date);
    const end = new Date(formData.travel_end_date);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 900,
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

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 4 }}>
            {renderStepContent(activeStep)}
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between">
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back
            </Button>
            <Box>
              <Button
                onClick={onClose}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Voucher'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateVoucherModal;
