import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';

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

const VoucherDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [voucher, setVoucher] = useState<ServiceVoucher | null>(null);
  const [loading, setLoading] = useState(true);
  const voucherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const response = await api.get<ServiceVoucher>(`/api/service-vouchers/${id}/`);
        setVoucher(response.data);
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
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        width: 210 * 3.779527559, // Convert mm to pixels (96 DPI)
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
        text: `Service voucher for ${voucher.traveler.name} at ${voucher.hotel_name}`,
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
                {/* Logo will be added later */}
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
                  <td>{voucher.traveler.name}</td>
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
                    Adults: {voucher.traveler.num_adults} | Infants: {voucher.traveler.num_infants}
                  </td>
                </tr>
                <tr>
                  <th>No Of Rooms</th>
                  <td>
                    {voucher.room_allocations.map((room) => (
                      `${room.quantity}x ${room.room_type_display}`
                    )).join(', ')}
                  </td>
                </tr>
                <tr>
                  <th>TRANSFER TYPE</th>
                  <td>Private Basis</td>
                </tr>
                <tr>
                  <th>HOTEL</th>
                  <td>{voucher.hotel_name}</td>
                </tr>
                <tr>
                  <th>INCLUSIONS</th>
                  <td>
                    <ul className="inclusions-list">
                      <li>Accommodation with Buffet Breakfast</li>
                      <li>Private transfers</li>
                      <li>Tours as per itinerary</li>
                      <li>All entrance tickets as mentioned</li>
                    </ul>
                  </td>
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

import PhoneIcon from '@mui/icons-material/Phone';

        {/* Second Page - Itinerary */}
        <div className="voucher-page page-break">
          <div className="voucher-content">
            <div className="company-header">
              <div className="logo-area">
                <img src="/placeholder-logo.png" alt="Company Logo" style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
              <div className="company-info">
                <Typography variant="body2">Reservation: {voucher.reservation_number}</Typography>
                <Typography variant="body2">Guest: {voucher.traveler.name}</Typography>
              </div>
            </div>

            <div className="itinerary-title">
              Detailed Itinerary
            </div>

            <div className="itinerary-content">
              {voucher.itinerary_items
                .sort((a, b) => a.day - b.day)
                .map((item) => (
                  <div key={item.id} className="itinerary-item">
                    <Typography variant="h6">
                      Day {item.day} - {new Date(item.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                      Time: {item.time}
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '8px' }}>
                      {item.description}
                    </Typography>
                  </div>
                ))}
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
