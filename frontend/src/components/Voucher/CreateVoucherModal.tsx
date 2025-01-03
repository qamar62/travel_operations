import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createServiceVoucher } from '../../services/voucherService';
import { ServiceVoucher, CreateServiceVoucherInput } from '../../types';
import ServiceVoucherForm from './ServiceVoucherForm';

interface CreateVoucherModalProps {
  open: boolean;
  onClose: () => void;
  onVoucherCreated: (voucher: ServiceVoucher) => void;
}

const CreateVoucherModal: React.FC<CreateVoucherModalProps> = ({
  open,
  onClose,
  onVoucherCreated,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: CreateServiceVoucherInput) => {
    try {
      const createdVoucher = await createServiceVoucher(data);
      onVoucherCreated(createdVoucher);
      setSuccess(true);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle>
          Create New Voucher
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ServiceVoucherForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            isOpen={open}
            mode="create"
          />
        </DialogContent>
      </Dialog>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={success} autoHideDuration={1500}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Voucher created successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateVoucherModal;
