const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const UserModel = require('../models/User').model;
const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findOne({ userId: decoded.userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Get user addresses
router.get('/addresses', authenticateToken, async (req, res) => {
  try {
    res.json({
      addresses: req.user.addresses
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ error: 'Failed to get addresses' });
  }
});

// Add new address
router.post('/addresses', authenticateToken, async (req, res) => {
  try {
    const { type, address, houseNumber, floor, block, landmark, city, state, pincode, isDefault, latitude, longitude, name } = req.body;

    // Backend validation
    if (!address || !address.trim()) {
      return res.status(400).json({ error: 'Address is required' });
    }
    if (!type || !type.trim()) {
      return res.status(400).json({ error: 'Address type is required' });
    }
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Location (latitude and longitude) is required' });
    }
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Check for duplicate address type
    const addressType = type.toLowerCase().trim();
    const existingAddress = req.user.addresses.find(
      addr => addr.type.toLowerCase().trim() === addressType
    );

    if (existingAddress) {
      return res.status(409).json({ 
        error: `An address with type "${type}" already exists. Please choose a different type or update the existing address.` 
      });
    }

    const newAddress = {
      type: type || 'home',
      address,
      houseNumber,
      floor,
      block,
      latitude,
      longitude,
      landmark,
      city,
      state,
      pincode,
      isDefault: isDefault || false,
      name
    };

    // If this is the first address or isDefault is true, make it default
    if (req.user.addresses.length === 0 || isDefault) {
      // Remove default from other addresses
      req.user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
      newAddress.isDefault = true;
    }

    req.user.addresses.push(newAddress);
    await req.user.save();

    res.json({
      message: 'Address added successfully',
      address: newAddress
    });

  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ error: 'Failed to add address' });
  }
});

// Update address
router.put('/addresses/:addressId', authenticateToken, async (req, res) => {
  try {
    const { addressId } = req.params;
    const { type, address, houseNumber, floor, block, landmark, city, state, pincode, isDefault } = req.body;

    const addressIndex = req.user.addresses.findIndex(
      addr => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // Check for duplicate address type if type is being updated
    if (type) {
      const addressType = type.toLowerCase().trim();
      const existingAddress = req.user.addresses.find(
        (addr, index) => index !== addressIndex && addr.type.toLowerCase().trim() === addressType
      );

      if (existingAddress) {
        return res.status(409).json({ 
          error: `An address with type "${type}" already exists. Please choose a different type.` 
        });
      }
    }

    // Update address fields
    if (type) req.user.addresses[addressIndex].type = type;
    if (address) req.user.addresses[addressIndex].address = address;
    if (houseNumber !== undefined) req.user.addresses[addressIndex].houseNumber = houseNumber;
    if (floor !== undefined) req.user.addresses[addressIndex].floor = floor;
    if (block !== undefined) req.user.addresses[addressIndex].block = block;
    if (landmark !== undefined) req.user.addresses[addressIndex].landmark = landmark;
    if (city) req.user.addresses[addressIndex].city = city;
    if (state) req.user.addresses[addressIndex].state = state;
    if (pincode) req.user.addresses[addressIndex].pincode = pincode;

    // Handle default address
    if (isDefault) {
      req.user.addresses.forEach((addr, index) => {
        addr.isDefault = index === addressIndex;
      });
    }

    await req.user.save();

    res.json({
      message: 'Address updated successfully',
      address: req.user.addresses[addressIndex]
    });

  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
});

// Delete address
router.delete('/addresses/:addressId', authenticateToken, async (req, res) => {
  try {
    const { addressId } = req.params;

    const addressIndex = req.user.addresses.findIndex(
      addr => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ error: 'Address not found' });
    }

    const deletedAddress = req.user.addresses[addressIndex];
    req.user.addresses.splice(addressIndex, 1);

    // If we deleted the default address and there are other addresses, make the first one default
    if (deletedAddress.isDefault && req.user.addresses.length > 0) {
      req.user.addresses[0].isDefault = true;
    }

    await req.user.save();

    res.json({
      message: 'Address deleted successfully'
    });

  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

// Set default address
router.patch('/addresses/:addressId/default', authenticateToken, async (req, res) => {
  try {
    const { addressId } = req.params;

    const addressIndex = req.user.addresses.findIndex(
      addr => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // Remove default from all addresses
    req.user.addresses.forEach(addr => {
      addr.isDefault = false;
    });

    // Set the selected address as default
    req.user.addresses[addressIndex].isDefault = true;

    await req.user.save();

    res.json({
      message: 'Default address updated successfully',
      address: req.user.addresses[addressIndex]
    });

  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({ error: 'Failed to set default address' });
  }
});

// Get user cart
router.get('/cart', authenticateToken, async (req, res) => {
  try {
    res.json({ cart: req.user.cart || [] });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
});

// Save/update user cart
router.post('/cart', authenticateToken, async (req, res) => {
  try {
    const { cart } = req.body;
    if (!Array.isArray(cart)) {
      return res.status(400).json({ error: 'Cart must be an array' });
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      { cart },
      { new: true }
    );
    res.json({ message: 'Cart updated successfully', cart: updatedUser.cart });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Nurse updates their live location
router.post('/location', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    req.user.location = {
      type: 'Point',
      coordinates: [longitude, latitude]
    };
    await req.user.save();
    res.json({ success: true, location: req.user.location });
  } catch (error) {
    console.error('Error updating nurse location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Update health profile
router.post('/update-health-profile', authenticateToken, async (req, res) => {
  try {
    const { 
      name, age, gender, currentSteps, sleepHours, waterIntake, 
      conditions, medications, allergies 
    } = req.body;

    // req.user is already the user object from authentication middleware
    const user = req.user;

    // Update user profile with health data
    user.name = name || user.name;
    user.age = age || user.age;
    user.sex = gender || user.sex; // Note: using sex field from User model
    user.healthProfile = {
      currentSteps: currentSteps || 0,
      sleepHours: sleepHours || 7,
      waterIntake: waterIntake || 2.5,
      conditions: conditions || [],
      medications: medications || [],
      allergies: allergies || [],
      lastUpdated: new Date()
    };

    await user.save();

    res.json({
      success: true,
      message: 'Health profile updated successfully',
      data: user.healthProfile
    });
  } catch (error) {
    console.error('Error updating health profile:', error);
    res.status(500).json({ error: 'Failed to update health profile' });
  }
});

// Get health profile
router.get('/health-profile', authenticateToken, async (req, res) => {
  try {
    // req.user is already the user object from authentication middleware
    const user = req.user;
    
    res.json({
      success: true,
      data: {
        name: user.name,
        age: user.age,
        gender: user.sex, // Note: using sex field from User model
        currentSteps: user.healthProfile?.currentSteps || 0,
        sleepHours: user.healthProfile?.sleepHours || 7,
        waterIntake: user.healthProfile?.waterIntake || 2.5,
        conditions: user.healthProfile?.conditions || [],
        medications: user.healthProfile?.medications || [],
        allergies: user.healthProfile?.allergies || [],
      }
    });
  } catch (error) {
    console.error('Error fetching health profile:', error);
    res.status(500).json({ error: 'Failed to fetch health profile' });
  }
});

// Delete user profile
router.delete('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID not found' });
    }
    // Remove from MongoDB
    if (typeof req.user.remove === 'function') {
      await req.user.remove();
    } else if (typeof req.user.userId === 'string') {
      // In-memory DB fallback
      const inMemoryDB = require('../models/InMemoryDB');
      await inMemoryDB.deleteUserByUserId(req.user.userId);
    }
    res.json({ message: 'User profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

module.exports = router; 