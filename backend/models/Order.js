const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: String,
    price: Number,
    quantity: Number,
    specialInstructions: String
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'],
    default: 'pending'
  },
  payment: {
    piPaymentId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    txid: String
  },
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rating: {
    food: Number,
    delivery: Number,
    comment: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for quick lookups
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1, status: 1 });
orderSchema.index({ driver: 1, status: 1 });

module.exports = mongoose.model('Order', orderSchema);
