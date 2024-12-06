import React from 'react';
import { Booking } from '../types';
import { Link } from 'react-router-dom';

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-2">{booking.hotel_name}</h2>
      <p className="text-gray-600">Reservation: {booking.reservation_number}</p>
      <p className="text-gray-600">
        Dates: {booking.travel_start_date} - {booking.travel_end_date}
      </p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {booking.transfer_type} Transfer
        </span>
        <Link 
          to={`/booking/${booking.id}`} 
          className="text-blue-500 hover:text-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BookingCard;
