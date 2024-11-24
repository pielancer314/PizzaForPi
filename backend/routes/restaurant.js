const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const auth = require('../middleware/auth');

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ active: true });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create restaurant (requires authentication and restaurant_owner role)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'restaurant_owner' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to create restaurant' });
    }

    const restaurant = new Restaurant({
      ...req.body,
      piWalletAddress: req.body.piWalletAddress
    });

    await restaurant.save();
    
    // Update user with restaurant reference
    req.user.restaurantId = restaurant._id;
    await req.user.save();

    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update restaurant
router.patch('/:id', auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    if (req.user.restaurantId.toString() !== restaurant._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update restaurant' });
    }

    const updates = Object.keys(req.body);
    updates.forEach(update => restaurant[update] = req.body[update]);
    await restaurant.save();

    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete restaurant
router.delete('/:id', auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    if (req.user.restaurantId.toString() !== restaurant._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete restaurant' });
    }

    // Soft delete by setting active to false
    restaurant.active = false;
    await restaurant.save();

    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search restaurants
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const restaurants = await Restaurant.find({
      active: true,
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { 'cuisine': { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ]
    });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
