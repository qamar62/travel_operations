import React from 'react';
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
} from '@mui/material';
import {
  Print as PrintIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ServiceVoucher, RoomAllocation, ItineraryItem, ItineraryActivity } from '../../types';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import './VoucherDetail.css';

interface VoucherResponse {
  service_voucher: ServiceVoucher;
}

interface VoucherDetailProps {
  // Not needed in this component
}

const VoucherDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [voucher, setVoucher] = useState<ServiceVoucher | null>(null);
  const [loading, setLoading] = useState(true);
  const voucherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const response = await api.get<VoucherResponse>(`/service-vouchers/${id}/`);
        console.log('Fetched voucher:', response.data);
        setVoucher(response.data.service_voucher); 
      } catch (error) {
        console.error('Failed to fetch voucher:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVoucher();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!voucherRef.current) return;

    const pages = voucherRef.current.querySelectorAll('.voucher-page');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) pdf.addPage();
      
      const canvas = await html2canvas(pages[i] as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: 210 * 3.779527559,
        height: 297 * 3.779527559,
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save(`service-voucher-${voucher?.reservation_number}.pdf`);
  };

  const handleShare = async () => {
    if (!voucher) return;
    try {
      await navigator.share({
        title: `Service Voucher - ${voucher.reservation_number}`,
        text: `Service voucher for ${voucher.traveler?.name} at ${voucher.hotel_name}`,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!voucher) {
    return (
      <Box p={3}>
        <Typography color="error">Voucher not found</Typography>
      </Box>
    );
  }

  const renderRoomAllocations = (rooms: RoomAllocation[]) => {
    return rooms.map((room: RoomAllocation) => (
      `${room.quantity}x ${room.room_type_display}`
    ));
  };

  const renderInclusions = (inclusions: string) => {
    return inclusions.split('.').map((inclusion: string, index: number) => (
      <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ color: 'green', marginRight: '8px' }}>✓</span>
        {inclusion.trim()}
      </li>
    ));
  };

  const renderItineraryItems = (items: ItineraryItem[]) => {
    return items.map((item: ItineraryItem) => (
      <div key={item.id} className="itinerary-day">
        <div className="itinerary-day-header">
          <Typography variant="h6">
            Day {item.day} - {new Date(item.date).toLocaleDateString()}
          </Typography>
        </div>
        
        {item.activities?.map(activity => (
          <div key={activity.id} className="activity-block">
            <div className="activity-time">
              {new Date(`2000-01-01T${activity.time}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </div>
            <div className="activity-content">
              <div className="activity-description">
                <Typography variant="body1">
                  {activity.description}
                </Typography>
                {activity.location && (
                  <Typography className="activity-location">
                    📍 {activity.location}
                  </Typography>
                )}
                {activity.notes && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Note: {activity.notes}
                  </Typography>
                )}
              </div>
              <span className="activity-type-badge">
                {activity.activity_type_display}
              </span>
            </div>
          </div>
        ))}
      </div>
    ));
  };

  const renderActivities = (activities: ItineraryActivity[]) => {
    return activities.map((activity: ItineraryActivity) => (
      <div key={activity.id} className="activity-block">
        <div className="activity-time">
          {new Date(`2000-01-01T${activity.time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}
        </div>
        <div className="activity-content">
          <div className="activity-description">
            <Typography variant="body1">
              {activity.description}
            </Typography>
            {activity.location && (
              <Typography className="activity-location">
                📍 {activity.location}
              </Typography>
            )}
            {activity.notes && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Note: {activity.notes}
              </Typography>
            )}
          </div>
          <span className="activity-type-badge">
            {activity.activity_type_display}
          </span>
        </div>
      </div>
    ));
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="flex-end" mb={3} className="no-print">
        <Button startIcon={<PrintIcon />} onClick={handlePrint} sx={{ mr: 1 }}>
          Print
        </Button>
        <Button startIcon={<DownloadIcon />} onClick={handleDownloadPDF} sx={{ mr: 1 }}>
          Download
        </Button>
        <Button startIcon={<ShareIcon />} onClick={handleShare}>
          Share
        </Button>
      </Box>

      <div ref={voucherRef}>
        {/* First Page */}
        <div className="voucher-page">
          <div className="voucher-content">
            <div className="company-header">
              <div className="logo-area">
                <img src="/placeholder-logo.png" alt="Company Logo" style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
              <div className="company-info">
                <Typography variant="body2">Empire Building Back Of Baroda | Same Building - 58P - Dubai</Typography>
                <Typography variant="body2">Tel: +971 4 321 8585</Typography>
              </div>
            </div>

            <Typography className="service-voucher-title">
              Service Voucher
            </Typography>

            <table className="voucher-table">
              <tbody>
                <tr>
                  <th>GROUP / PAX NAME</th>
                  <td>{voucher.traveler?.name}</td>
                </tr>
                <tr>
                  <th>TRAVEL DATE</th>
                  <td>
                    {new Date(voucher.travel_start_date).toLocaleDateString()} to{' '}
                    {new Date(voucher.travel_end_date).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <th>Reservation Number</th>
                  <td>{voucher.reservation_number}</td>
                </tr>
                <tr>
                  <th>NO OF PAX</th>
                  <td>
                    Adults: {voucher.traveler?.num_adults} | Infants: {voucher.traveler?.num_infants}
                  </td>
                </tr>
                <tr>
                  <th>No Of Rooms</th>
                  <td>
                    {renderRoomAllocations(voucher.room_allocations)}
                  </td>
                </tr>
                <tr>
                  <th>Total Rooms</th>
                  <td>{voucher.total_rooms}</td>
                </tr>
                <tr>
                  <th>Transfer Type</th>
                  <td>{voucher.transfer_type_display}</td>
                </tr>
                <tr>
                  <th>Meal Plan</th>
                  <td>{voucher.meal_plan_display}</td>
                </tr>
                <tr>
                  <th>Hotel Confirmation Number</th>
                  <td>{voucher.hotel_confirmation_number}</td>
                </tr>
                <tr>
                  <th>Inclusions</th>
                  <td>
                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                      {renderInclusions(voucher.inclusions)}
                    </ul>
                  </td>
                </tr>
                <tr>
                  <th>Arrival Details</th>
                  <td>{voucher.arrival_details}</td>
                </tr>
                <tr>
                  <th>Departure Details</th>
                  <td>{voucher.departure_details}</td>
                </tr>
                <tr>
                  <th>Meeting Point</th>
                  <td>{voucher.meeting_point}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="emergency-contacts">
            <h3>Emergency Contact Numbers</h3>
            <table>
              <tbody>
                <tr>
                  <td>Mr Sohan Dsouza -  <PhoneIcon fontSize="small" /> +971 558238896</td>
                  <td>Mr Mohammad Anas -  <PhoneIcon fontSize="small" /> +971 505536630</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Second Page - Itinerary */}
        <div className="voucher-page page-break">
          {/* Continuation header for itinerary pages */}
          <div className="company-header">
            <div className="logo-area">
              <img src="/placeholder-logo.png" alt="Company Logo" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
            <div className="company-info">
              <Typography variant="body2">Reservation: {voucher.reservation_number}</Typography>
              <Typography variant="body2">Guest: {voucher.traveler?.name}</Typography>
              <Typography variant="body2" className="page-info">Detailed Itinerary</Typography>
            </div>
          </div>

          <div className="itinerary-content">
            {renderItineraryItems(voucher.itinerary_items)}
          </div>

          {/* Emergency contacts for itinerary pages */}
          <div className="emergency-contacts">
            <h3>Emergency Contact Numbers</h3>
            <table>
              <tbody>
                <tr>
                  <td>Mr. Sohan Dsouza - <PhoneIcon fontSize="small" /> +971 558238896</td>
                  <td>Mr. Mohammed Anas - <PhoneIcon fontSize="small" /> +971 505536630</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default VoucherDetail;
