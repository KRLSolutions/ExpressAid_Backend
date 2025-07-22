const express = require('express');
const router = express.Router();

// UPI Payment endpoint - generates UPI deep link URL
router.post('/payment', async (req, res) => {
  try {
    const { orderAmount, customerId, customerPhone, customerEmail, paymentMethod } = req.body;

    console.log('🎯 UPI Payment Request:', {
      orderAmount,
      customerId,
      customerPhone,
      paymentMethod
    });

    // Validate required fields
    if (!orderAmount || !customerId || !customerPhone) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'orderAmount, customerId, and customerPhone are required'
      });
    }

    // Validate amount
    const amount = parseFloat(orderAmount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount',
        details: 'orderAmount must be a positive number'
      });
    }

    // Generate unique transaction reference
    const transactionRef = `upi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get business UPI ID from environment (secure)
    const businessUpiId = process.env.BUSINESS_UPI_ID || '9346048610-2@axl'; // Default for testing
    
    // Create UPI deep link URL
    const upiUrl = `upi://pay?pa=${businessUpiId}&pn=ExpressAid&am=${amount}&tr=${transactionRef}&tn=ExpressAid Payment - ${transactionRef}&cu=INR`;
    
    console.log('📱 Generated UPI URL:', upiUrl);
    console.log('📱 Transaction Ref:', transactionRef);

    // Return the UPI URL for React Native to open
    res.json({
      success: true,
      data: {
        upiUrl,
        transactionRef,
        amount,
        businessUpiId: businessUpiId.substring(0, 10) + '...', // Partial for security
        paymentMethod: paymentMethod || 'upi',
        message: 'UPI payment URL generated successfully'
      }
    });

  } catch (error) {
    console.error('❌ UPI payment failed:', error);
    res.status(500).json({
      error: 'Failed to generate UPI payment',
      details: error.message || 'Unknown error'
    });
  }
});

// Test endpoint to verify UPI route is working
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'UPI payment route is working!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 