import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import CheckoutForm from '../components/checkout/CheckoutForm';

// Mock cart data - replace with actual cart data from context/redux
const mockCart = {
  items: [
    {
      id: '1',
      name: 'Margherita Pizza',
      price: 14.99,
      quantity: 2,
    },
    {
      id: '5',
      name: 'Garlic Knots',
      price: 6.99,
      quantity: 1,
    },
  ],
  subtotal: 36.97,
  deliveryFee: 3.99,
};

const Checkout = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const handleSubmit = async (formData) => {
    setIsProcessing(true);

    try {
      // Mock API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock order number generation
      const mockOrderNumber = Math.random().toString(36).substring(2, 10).toUpperCase();
      setOrderNumber(mockOrderNumber);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error processing order:', error);
      // Handle error (show error message, etc.)
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    navigate('/orders'); // Navigate to orders page
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Checkout
      </Typography>

      {isProcessing ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            gap: 2,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6">
            Processing your order...
          </Typography>
          <Typography color="text.secondary">
            Please do not close this window
          </Typography>
        </Box>
      ) : (
        <CheckoutForm onSubmit={handleSubmit} cart={mockCart} />
      )}

      {/* Order Confirmation Dialog */}
      <Dialog
        open={showConfirmation}
        onClose={handleConfirmationClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Order Confirmed!
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Thank you for your order!
            </Typography>
            <Typography color="text.secondary" paragraph>
              Your order number is:
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'monospace',
                bgcolor: 'grey.100',
                py: 2,
                borderRadius: 1,
                mb: 2,
              }}
            >
              {orderNumber}
            </Typography>
            <Typography>
              You will receive a confirmation email shortly with your order details.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleConfirmationClose}
            fullWidth
          >
            View Order Status
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Checkout;
