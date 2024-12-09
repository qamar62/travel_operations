import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';
import Badge from '@mui/material/Badge';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import {
  Print as PrintIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ServiceVoucher } from '../../services/voucherService';
import { api } from '../../services/api';
import './VoucherDetail.css';

interface VoucherResponse {
  service_voucher: ServiceVoucher;
}

const VoucherDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [voucher, setVoucher] = useState<ServiceVoucher | null>(null);
  const [loading, setLoading] = useState(true);
  const voucherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const response = await api.get<VoucherResponse>(`/api/service-vouchers/${id}/`);
        console.log('Fetched voucher:', response.data);
        setVoucher(response.data.service_voucher); // Access the service_voucher property
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
                    {voucher.room_allocations?.map((room) => (
                      `${room.quantity}x ${room.room_type_display}`
                    )).join(', ')}
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
                      {voucher.inclusions.split('.').map((inclusion, index) => (
                        <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ color: 'green', marginRight: '8px' }}>✓</span>
                          {inclusion.trim()}
                        </li>
                      ))}
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
          <div className="voucher-content">
            <div className="company-header">
              <div className="logo-area">
                <img src="/placeholder-logo.png" alt="Company Logo" style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
              <div className="company-info">
                <Typography variant="body2">Reservation: {voucher.reservation_number}</Typography>
                <Typography variant="body2">Guest: {voucher.traveler?.name}</Typography>
              </div>
            </div>

            <div className="itinerary-title">
              <Typography variant="h5" color="primary">Detailed Itinerary</Typography>
            </div>

            <div className="itinerary-content">
              <table style={{ width: '100%', marginTop: '16px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>Day</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>Time</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {voucher.itinerary_items?.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>Day {item.day}</td>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{new Date(item.date).toLocaleDateString()}</td>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                          {item.activities?.map(activity => (
                            <Typography variant="subtitle1" color="primary" key={activity.id}>
                              {activity.time}
                            </Typography>
                          ))}
                        </td>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                          {item.activities?.map(activity => (
                            <div key={activity.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body1" color="text.secondary">
                                {activity.description}
                              </Typography>
                              <Badge badgeContent={activity.activity_type_display} color="primary" />
                            </div>
                          ))}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="emergency-contacts">
            <h3>Emergency Contact Numbers</h3>
            <table>
              <tbody>
                <tr>
                  <td>Mr. Sohan Dsouza</td>
                  <td>+971 558238896</td>
                </tr>
                <tr>
                  <td>Mr. Mohammed Anas</td>
                  <td>+971 505536630</td>
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
