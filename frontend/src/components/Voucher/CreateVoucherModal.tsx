import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ServiceVoucher } from '../../services/voucherService';
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
  const handleSubmit = async (data: ServiceVoucher) => {
    try {
      // The ServiceVoucherForm component handles the API call
      onVoucherCreated(data);
      onClose();
    } catch (error) {
      console.error('Error creating voucher:', error);
    }
  };

  return (
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
  );
};

export default CreateVoucherModal;
