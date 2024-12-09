import React from 'react';
import { Card, Grid, Typography, Box } from '@mui/material';
import { ServiceVoucher } from '../../types';

interface RecentVouchersProps {
  vouchers: ServiceVoucher[];
}

const RecentVouchers: React.FC<RecentVouchersProps> = ({ vouchers }) => {
  return (
    <Card className="recent-vouchers">
      <Typography variant="h6" component="h2" gutterBottom className="section-title">
        Recent Service Vouchers
      </Typography>
      <Box sx={{ mt: 2 }}>
        {vouchers.slice(0, 5).map((voucher) => (
          <Card key={voucher.id} sx={{ mb: 2, p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {voucher.traveler.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Reservation: {voucher.reservation_number}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  Hotel: {voucher.hotel_name}
                </Typography>
                <Typography variant="body2">
                  Check-in: {new Date(voucher.travel_start_date).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        ))}
      </Box>
    </Card>
  );
};

export default RecentVouchers;
