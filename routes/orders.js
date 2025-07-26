const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const UserModel = require('../models/User').model;
const Nurse = require('../models/Nurse');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { assignNurseToOrder, getAreaInfo } = require('../services/nurseAssignmentService');

// Helper function to generate JWT token
function generateToken(userId, phoneNumber, role) {
  return jwt.sign(
    { userId, phoneNumber, role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
}

// Middleware to verify JWT token for both users and nurses
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Check if it's a nurse token (role is 'nurse')
    if (decoded.role === 'nurse') {
      const nurse = await Nurse.findById(decoded.userId);
      if (!nurse) {
        return res.status(404).json({ error: 'Nurse not found' });
      }
      req.user = nurse;
      req.user.role = 'nurse'; // Ensure role is set
      req.user.userId = nurse._id; // Set userId for consistency with the rest of the code
    } else {
      // Check if it's a user token (role is 'customer' or undefined)
      const user = await User.findOne({ userId: decoded.userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      req.user = user;
    }
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// POST /api/orders - create a new order
router.post('/', authenticateToken, async (req, res) => {
  console.log('ORDER BODY:', req.body, 'USER:', req.user);
  try {
    const userId = req.user && req.user._id; // Use MongoDB ObjectId, not userId string
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { items, address, total, paymentMethod, cashfreeOrderId } = req.body;
    if (!items || !address || !total || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Assign nurse immediately
    const assignedNurse = await assignNurseToOrder(null, {
      latitude: address.latitude,
      longitude: address.longitude
    });

    let orderStatus = 'nurse_assigned';
    if (!assignedNurse) {
      orderStatus = 'no_nurses_available';
    }

    // Create order with assigned nurse
    const order = new Order({
      user: userId,
      items,
      address,
      total,
      paymentMethod,
      cashfreeOrderId,
      status: orderStatus,
      assignedNurse: assignedNurse || undefined,
      notifiedNurses: [],
      nurseAcceptanceTimeout: null,
      acceptedAt: assignedNurse ? new Date() : undefined
    });
    await order.save();

    // Get area information for display
    const areaInfo = getAreaInfo(address.latitude, address.longitude);

    return res.status(201).json({
      success: true,
      message: assignedNurse
        ? 'Order placed successfully. Nurse assigned!'
        : 'Order placed successfully but no nurses available.',
      order: {
        ...order.toObject(),
        token: generateToken(req.user.userId, req.user.phoneNumber, 'customer'),
        areaInfo
      },
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// GET /api/orders/active - get the current active order for the logged-in user
router.get('/active', authenticateToken, async (req, res) => {
  try {
    let userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const activeOrder = await Order.findOne({
      user: userId,
      status: { $nin: ['finished', 'completed', 'cancelled', 'timeout'] }
    }).sort({ createdAt: -1 });
    res.json({ success: true, order: activeOrder });
  } catch (err) {
    console.error('Active order fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch active order' });
  }
});

// GET /api/orders/:orderId - get order details (with nurse info)
router.get('/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('nurse');
    console.log('GET /api/orders/:orderId returning:', order);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Check for timeout
    if (order.status === 'nurse_notified' && order.nurseAcceptanceTimeout && new Date() > order.nurseAcceptanceTimeout) {
      console.log(`Order ${orderId} has timed out, updating status to timeout`);
      order.status = 'timeout';
      await order.save();
      console.log('Order status updated to timeout');
    }
    
    res.json({ success: true, order });
  } catch (err) {
    console.error('Order fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// GET /api/orders/:orderId/status - get order status and nurse details
router.get('/:orderId/status', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      order: {
        _id: order._id,
        status: order.status,
        assignedNurse: order.assignedNurse,
        createdAt: order.createdAt,
        acceptedAt: order.acceptedAt,
        items: order.items,
        address: order.address,
        total: order.total,
        paymentMethod: order.paymentMethod,
        cashfreeOrderId: order.cashfreeOrderId
      }
    });
  } catch (err) {
    console.error('Error fetching order status:', err);
    res.status(500).json({ error: 'Failed to fetch order status' });
  }
});

// GET /api/orders - get all orders for the logged-in user or nurse
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role === 'nurse') {
      // For nurses, get orders assigned to them
      const orders = await Order.find({ nurse: req.user.userId }).populate('user', 'name phoneNumber').sort({ createdAt: -1 });
      res.json({ success: true, orders });
    } else {
      // For customers, get their own orders
      const userId = req.user && req.user.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      
      // Find the user by userId to get the MongoDB ObjectId
      const user = await UserModel.findOne({ userId: userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const orders = await Order.find({ user: user._id }).populate('nurse', 'name phoneNumber').sort({ createdAt: -1 });
      res.json({ success: true, orders });
    }
  } catch (err) {
    console.error('Order fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/my-orders - get orders for nurses (alias for the above)
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'nurse') {
      return res.status(403).json({ error: 'Only nurses can access this endpoint' });
    }
    
    const orders = await Order.find({ nurse: req.user.userId }).populate('user', 'name phoneNumber').sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.error('My orders fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PATCH /api/orders/:orderId/deny - nurse denies the order
router.patch('/:orderId/deny', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'nurse') {
      return res.status(403).json({ error: 'Only nurses can deny orders' });
    }
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status !== 'nurse_notified') {
      return res.status(400).json({ error: 'Order is not available for denial' });
    }
    // Find the nurse in notifiedNurses
    const nurseEntry = order.notifiedNurses.find(n => n.nurseId.toString() === req.user.userId.toString() && n.status === 'pending');
    if (!nurseEntry) {
      return res.status(403).json({ error: 'You were not notified or already responded' });
    }
    nurseEntry.status = 'denied';
    await order.save();
    
    // Check if any other nurses are still pending or if any accepted
    const pendingNurses = order.notifiedNurses.filter(n => n.status === 'pending');
    const acceptedNurse = order.notifiedNurses.find(n => n.status === 'accepted');
    
    if (acceptedNurse) {
      // Another nurse accepted, no action needed
      res.json({ success: true, message: 'Order denied. Another nurse has accepted the order.' });
    } else if (pendingNurses.length === 0) {
      // No more nurses available
      order.status = 'no_nurses_available';
      await order.save();
      res.json({ success: true, message: 'Order denied. No more nurses available.' });
    } else {
      // Other nurses still pending
      res.json({ success: true, message: 'Order denied. Other nurses are still considering the order.' });
    }
  } catch (err) {
    console.error('Order deny error:', err);
    res.status(500).json({ error: 'Failed to deny order' });
  }
});

// PATCH /api/orders/:orderId/admin-update - Admin endpoint to update order status and nurse details
router.patch('/:orderId/admin-update', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, assignedNurse } = req.body;
    
    // Validate status if provided
    if (status && !['searching', 'nurse_notified', 'nurse_assigned', 'in_progress', 'completed', 'finished', 'cancelled', 'timeout', 'no_nurses_available'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    const updateData = {};
    if (status) updateData.status = status;
    if (assignedNurse) updateData.assignedNurse = assignedNurse;
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (err) {
    console.error('Admin order update error:', err);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// GET /api/orders/available - get available orders for nurses
router.get('/available', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'nurse') {
      return res.status(403).json({ error: 'Only nurses can view available orders' });
    }

    // Debug logs
    console.log('NURSE req.user:', req.user);
    const query = {
      status: 'nurse_notified',
      'notifiedNurses.nurseId': req.user.userId, // Use userId from JWT token
      $or: [
        { nurseAcceptanceTimeout: { $exists: false } },
        { nurseAcceptanceTimeout: { $gt: new Date() } }
      ]
    };
    console.log('NURSE available orders query:', query);

    const availableOrders = await Order.find(query).populate('user', 'name phoneNumber');
    res.json({ success: true, orders: availableOrders });
  } catch (err) {
    console.error('Available orders fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch available orders' });
  }
});

// PATCH /api/orders/:orderId/finish - mark an order as finished
router.patch('/:orderId/finish', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    // Only the user who owns the order can finish it
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    order.status = 'finished';
    await order.save();
    res.json({ success: true, message: 'Order marked as finished', order });
  } catch (err) {
    console.error('Order finish error:', err);
    res.status(500).json({ error: 'Failed to finish order' });
  }
});

// PATCH /api/orders/:orderId/complete - mark an order as completed (for admin/nurse use)
router.patch('/:orderId/complete', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Allow both the user who owns the order and nurses to complete it
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'nurse') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    order.status = 'completed';
    await order.save();
    res.json({ success: true, message: 'Order marked as completed', order });
  } catch (err) {
    console.error('Order complete error:', err);
    res.status(500).json({ error: 'Failed to complete order' });
  }
});

module.exports = router; 