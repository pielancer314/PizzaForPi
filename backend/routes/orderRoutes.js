const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const { io } = require('../socket');

// Create a new order
router.post('/', authenticateUser, async (req, res) => {
  try {
    const {
      restaurantId,
      items,
      deliveryAddress,
      specialInstructions,
      paymentMethod,
      transactionId,
    } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const order = new Order({
      user: req.user._id,
      restaurant: restaurantId,
      items,
      deliveryAddress,
      specialInstructions,
      payment: {
        method: paymentMethod,
        transactionId,
        amount: calculateTotal(items),
      },
      timeline: [
        {
          status: 'ordered',
          time: new Date(),
          completed: true,
        },
      ],
    });

    await order.save();

    // Emit order created event
    io.to(`restaurant_${restaurantId}`).emit('new_order', {
      orderId: order._id,
      restaurant: restaurant.name,
      items: order.items,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Get order by ID
router.get('/:orderId', authenticateUser, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('restaurant', 'name image address')
      .populate('user', 'name phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to view this order
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// Get user's order history
router.get('/user/history', authenticateUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('restaurant', 'name image')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(orders);
  } catch (error) {
    console.error('Get order history error:', error);
    res.status(500).json({ message: 'Error fetching order history' });
  }
});

// Update order status (for restaurant/admin use)
router.patch('/:orderId/status', authenticateUser, async (req, res) => {
  try {
    const { status, driverId } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validate status transition
    const validStatus = ['confirmed', 'preparing', 'ready', 'delivering', 'delivered'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Update timeline
    order.timeline.push({
      status,
      time: new Date(),
      completed: true,
    });

    if (driverId) {
      order.driver = driverId;
    }

    await order.save();

    // Emit status update event
    io.to(`order_${order._id}`).emit('order_status_update', {
      orderId: order._id,
      status,
      timeline: order.timeline,
    });

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// Cancel order
router.post('/:orderId/cancel', authenticateUser, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow cancellation if order is not yet being prepared
    const preparingStatuses = ['preparing', 'ready', 'delivering', 'delivered'];
    if (preparingStatuses.includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel order at this stage' });
    }

    order.status = 'cancelled';
    order.timeline.push({
      status: 'cancelled',
      time: new Date(),
      completed: true,
    });

    await order.save();

    // Emit cancellation event
    io.to(`order_${order._id}`).emit('order_cancelled', {
      orderId: order._id,
      status: 'cancelled',
    });

    res.json(order);
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Error cancelling order' });
  }
});

// Helper function to calculate order total
function calculateTotal(items) {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}

module.exports = router;
