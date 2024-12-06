import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Booking } from '../types';
import { fetchBookingById } from '../services/api';

const BookingDetails: React.FC = () => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const loadBooking = async () => {
      try {
        if (id) {
          const data = await fetchBookingById(parseInt(id, 10));
          setBooking(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setLoading(false);
      }
    };

    loadBooking();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10">Loading booking details...</div>;
  }

  if (!booking) {
    return <div className="text-center mt-10">Booking not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{booking.hotel_name}</h1>
          <Link 
            to="/" 
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            Back to Bookings
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Booking Details</h2>
            <p><strong>Reservation Number:</strong> {booking.reservation_number}</p>
            <p><strong>Hotel Confirmation:</strong> {booking.hotel_confirmation_number}</p>
            <p><strong>Travel Dates:</strong> {booking.travel_start_date} - {booking.travel_end_date}</p>
            <p><strong>Rooms:</strong> {booking.num_rooms}</p>
            <p><strong>Transfer Type:</strong> {booking.transfer_type}</p>
            <p><strong>Meal Plan:</strong> {booking.meal_plan}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Traveler Information</h2>
            <p><strong>Name:</strong> {booking.traveler.name}</p>
            <p><strong>Adults:</strong> {booking.traveler.num_adults}</p>
            <p><strong>Infants:</strong> {booking.traveler.num_infants}</p>
          </div>
        </div>

        {booking.itinerary_items && booking.itinerary_items.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Itinerary</h2>
            <div className="space-y-2">
              {booking.itinerary_items.map(item => (
                <div key={item.id} className="bg-gray-100 p-3 rounded">
                  <p><strong>Day {item.day}:</strong> {item.title}</p>
                  <p>{item.date} at {item.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;
