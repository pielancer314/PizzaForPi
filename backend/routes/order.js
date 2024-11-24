const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const piNetwork = require('../blockchain/piNetwork');

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      user: req.user._id,
      status: 'pending'
    });

    // Create Pi payment
    const payment = await piNetwork.createPayment(
      order.totalAmount,
      `Payment for order at ${order.restaurant}`,
      req.user.piUserId
    );

    order.payment = {
      piPaymentId: payment.identifier,
      status: 'pending'
    };

    await order.save();

    // Notify restaurant through Socket.IO
    req.app.get('io').to(`restaurant_${order.restaurant}`).emit('new_order', order);

    res.status(201).json({ order, payment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('restaurant')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get restaurant's orders
router.get('/restaurant-orders', auth, async (req, res) => {
  try {
    if (!req.user.restaurantId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const orders = await Order.find({ restaurant: req.user.restaurantId })
      .populate('user', 'username profile')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify authorization
    const isRestaurantOwner = req.user.restaurantId?.toString() === order.restaurant.toString();
    const isOrderCustomer = req.user._id.toString() === order.user.toString();
    const isDriver = req.user.role === 'driver' && order.driver?.toString() === req.user._id.toString();

    if (!isRestaurantOwner && !isOrderCustomer && !isDriver && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    order.status = req.body.status;
    
    if (req.body.status === 'delivered') {
      order.actualDeliveryTime = new Date();
    }

    await order.save();

    // Notify all relevant parties through Socket.IO
    const io = req.app.get('io');
    io.to(`order_${order._id}`).emit('order_status_update', {
      orderId: order._id,
      status: order.status
    });

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Complete payment
router.post('/:id/complete-payment', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { txid } = req.body;

    // Complete payment on Pi Network
    await piNetwork.completePayment(order.payment.piPaymentId, txid);

    order.payment.status = 'completed';
    order.payment.txid = txid;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add rating and review
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ error: 'Can only rate delivered orders' });
    }

    order.rating = {
      food: req.body.foodRating,
      delivery: req.body.deliveryRating,
      comment: req.body.comment
    };

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
