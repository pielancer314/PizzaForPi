import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../socket';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Divider,
  Chip,
  Avatar,
  Button,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  LocalPizza as LocalPizzaIcon,
  DirectionsBike as DirectionsBikeIcon,
  AccessTime as AccessTimeIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

const statusConfig = {
  ordered: {
    label: 'Order Placed',
    icon: ReceiptIcon,
  },
  confirmed: {
    label: 'Order Confirmed',
    icon: CheckCircleIcon,
  },
  preparing: {
    label: 'Preparing Order',
    icon: LocalPizzaIcon,
  },
  ready: {
    label: 'Ready for Delivery',
    icon: CheckCircleIcon,
  },
  delivering: {
    label: 'Out for Delivery',
    icon: DirectionsBikeIcon,
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircleIcon,
  },
  cancelled: {
    label: 'Cancelled',
    icon: CheckCircleIcon,
  },
};

const OrderTracking = () => {
  const theme = useTheme();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Fetch initial order data
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        
        const data = await response.json();
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrder();

    // Connect to Socket.IO and join order room
    socket.emit('join_order_room', orderId);

    // Listen for order status updates
    socket.on('order_status_update', (data) => {
      if (data.orderId === orderId) {
        setOrder(prev => ({
          ...prev,
          timeline: data.timeline,
        }));
      }
    });

    // Listen for driver location updates
    socket.on('driver_location', (data) => {
      if (data.orderId === orderId) {
        setDriverLocation(data.location);
      }
    });

    // Listen for order cancellation
    socket.on('order_cancelled', (data) => {
      if (data.orderId === orderId) {
        setOrder(prev => ({
          ...prev,
          status: 'cancelled',
          timeline: [...prev.timeline, {
            status: 'cancelled',
            time: new Date(),
            completed: true,
          }],
        }));
      }
    });

    return () => {
      // Cleanup Socket.IO listeners
      socket.off('order_status_update');
      socket.off('driver_location');
      socket.off('order_cancelled');
    };
  }, [orderId]);

  useEffect(() => {
    // Calculate active step based on order timeline
    if (order) {
      const step = order.timeline.findIndex(step => !step.completed);
      setActiveStep(step === -1 ? order.timeline.length : step);
    }
  }, [order]);

  const formatTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Order not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Order Status */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Order #{order.id}
            </Typography>
            <Typography color="text.secondary">
              Estimated Delivery Time: {order.estimatedDeliveryTime}
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} alternativeLabel>
            {order.timeline.map((step, index) => {
              const StepIcon = statusConfig[step.status].icon;
              return (
                <Step key={step.status} completed={step.completed}>
                  <StepLabel
                    StepIconComponent={StepIcon}
                    optional={
                      step.time && (
                        <Typography variant="caption">
                          {formatTime(step.time)}
                        </Typography>
                      )
                    }
                  >
                    {statusConfig[step.status].label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Restaurant and Driver Info */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar
                      src={order.restaurant.image}
                      sx={{ width: 80, height: 80 }}
                      variant="rounded"
                    />
                    <Box>
                      <Typography variant="h6">
                        {order.restaurant.name}
                      </Typography>
                      <Typography color="text.secondary">
                        {order.restaurant.address}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                {order.driver && activeStep >= 4 && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Avatar src={order.driver.image} />
                      <Box>
                        <Typography variant="h6">
                          {order.driver.name}
                        </Typography>
                        <Typography color="text.secondary" gutterBottom>
                          Your Driver • {order.driver.rating} ★
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          href={`tel:${order.driver.phone}`}
                        >
                          Call Driver
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              {order.items.map((item, index) => (
                <Box key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Box>
                      <Typography>
                        {item.quantity}x {item.name}
                      </Typography>
                      {item.notes && (
                        <Typography variant="body2" color="text.secondary">
                          Note: {item.notes}
                        </Typography>
                      )}
                    </Box>
                    <Typography>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                  {index < order.items.length - 1 && (
                    <Divider sx={{ my: 1 }} />
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Delivery Info */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Delivery Information
              </Typography>
              <Typography paragraph>
                {order.customer.address}
              </Typography>
              {order.customer.instructions && (
                <Typography color="text.secondary">
                  Note: {order.customer.instructions}
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Summary
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography>Subtotal</Typography>
                  <Typography>${order.payment.subtotal.toFixed(2)}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography>Delivery Fee</Typography>
                  <Typography>${order.payment.deliveryFee.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 'bold',
                  }}
                >
                  <Typography>Total</Typography>
                  <Typography>${order.payment.total.toFixed(2)}</Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Payment Method
                </Typography>
                <Chip
                  label={order.payment.method}
                  size="small"
                  sx={{ mt: 1 }}
                />
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 1, fontFamily: 'monospace' }}
                >
                  Transaction ID: {order.payment.transactionId}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderTracking;
