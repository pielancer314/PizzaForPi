import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  useTheme,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  AccessTime as AccessTimeIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';

const steps = ['Delivery Address', 'Delivery Time', 'Payment'];

const CheckoutForm = ({ onSubmit, cart }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Delivery Address
    street: '',
    apartment: '',
    city: '',
    zipCode: '',
    instructions: '',
    
    // Delivery Time
    deliveryOption: 'asap',
    scheduledTime: '',
    
    // Payment
    paymentMethod: 'pi',
    piWalletAddress: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onSubmit(formData);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return formData.street && formData.city && formData.zipCode;
      case 1:
        return formData.deliveryOption === 'asap' || 
          (formData.deliveryOption === 'scheduled' && formData.scheduledTime);
      case 2:
        return formData.paymentMethod === 'pi' && formData.piWalletAddress;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Apartment, Suite, etc. (optional)"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ZIP Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Delivery Instructions (optional)"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <FormControl component="fieldset">
              <FormLabel component="legend">Delivery Time</FormLabel>
              <RadioGroup
                name="deliveryOption"
                value={formData.deliveryOption}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="asap"
                  control={<Radio />}
                  label="As soon as possible"
                />
                <FormControlLabel
                  value="scheduled"
                  control={<Radio />}
                  label="Schedule for later"
                />
              </RadioGroup>
            </FormControl>
            {formData.deliveryOption === 'scheduled' && (
              <TextField
                fullWidth
                type="datetime-local"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleChange}
                sx={{ mt: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Payment will be processed securely through Pi Network
            </Alert>
            <FormControl component="fieldset">
              <FormLabel component="legend">Payment Method</FormLabel>
              <RadioGroup
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="pi"
                  control={<Radio />}
                  label="Pay with Pi"
                />
              </RadioGroup>
            </FormControl>
            {formData.paymentMethod === 'pi' && (
              <TextField
                fullWidth
                label="Pi Wallet Address"
                name="piWalletAddress"
                value={formData.piWalletAddress}
                onChange={handleChange}
                required
                sx={{ mt: 2 }}
              />
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {steps[activeStep]}
                </Typography>
                {renderStepContent()}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              {cart.items.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography>
                    {item.quantity}x {item.name}
                  </Typography>
                  <Typography>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <Box
                sx={{
                  borderTop: 1,
                  borderColor: 'divider',
                  pt: 2,
                  mt: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography>Subtotal</Typography>
                  <Typography>${cart.subtotal.toFixed(2)}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography>Delivery Fee</Typography>
                  <Typography>${cart.deliveryFee.toFixed(2)}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                    fontWeight: 'bold',
                  }}
                >
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">
                    ${(cart.subtotal + cart.deliveryFee).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CheckoutForm;
