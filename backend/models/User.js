const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  piUserId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['customer', 'restaurant_owner', 'driver', 'admin'],
    default: 'customer'
  },
  profile: {
    firstName: String,
    lastName: String,
    phoneNumber: String,
    avatar: String
  },
  addresses: [{
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  driverDetails: {
    vehicleType: String,
    licensePlate: String,
    documents: [{
      type: String,
      documentUrl: String,
      verified: Boolean
    }],
    currentLocation: {
      coordinates: {
        lat: Number,
        lng: Number
      },
      lastUpdated: Date
    },
    isAvailable: {
      type: Boolean,
      default: false
    }
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  piWalletAddress: String,
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  stats: {
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    }
  },
  active: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for quick lookups
userSchema.index({ piUserId: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'driverDetails.isAvailable': 1 });

module.exports = mongoose.model('User', userSchema);
