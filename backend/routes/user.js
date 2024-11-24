const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.patch('/me', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['profile', 'addresses', 'preferences', 'piWalletAddress'];
    
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();

    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Become a driver
router.post('/become-driver', auth, async (req, res) => {
  try {
    if (req.user.role === 'restaurant_owner') {
      return res.status(400).json({ error: 'Restaurant owners cannot be drivers' });
    }

    req.user.role = 'driver';
    req.user.driverDetails = {
      vehicleType: req.body.vehicleType,
      licensePlate: req.body.licensePlate,
      documents: req.body.documents || []
    };

    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update driver status
router.patch('/driver-status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ error: 'Not a driver' });
    }

    req.user.driverDetails.isAvailable = req.body.isAvailable;
    if (req.body.currentLocation) {
      req.user.driverDetails.currentLocation = {
        coordinates: req.body.currentLocation,
        lastUpdated: new Date()
      };
    }

    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get nearby available drivers
router.get('/nearby-drivers', auth, async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 5000 } = req.query; // maxDistance in meters

    const drivers = await User.find({
      role: 'driver',
      'driverDetails.isAvailable': true,
      'driverDetails.currentLocation.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: maxDistance
        }
      }
    }).select('username profile driverDetails');

    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = req.user.stats;
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
