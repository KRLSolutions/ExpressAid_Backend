// routes/cashfree.js
const express = require('express');
const router = express.Router();
const config = require('../config');

// Initialize Cashfree SDK
let cashfree;
try {
  const { Cashfree, CFEnvironment } = require('cashfree-pg');
  
  console.log('🔧 Initializing Cashfree SDK...');
  console.log('📋 Config:', {
    environment: config.cashfree.environment,
    appId: config.cashfree.appId,
    secretKey: config.cashfree.secretKey ? config.cashfree.secretKey.substring(0, 10) + '...' : 'NOT SET'
  });

  // Map environment string to CFEnvironment enum
  const environment = config.cashfree.environment === 'PRODUCTION' 
    ? CFEnvironment.PRODUCTION 
    : CFEnvironment.SANDBOX;

  cashfree = new Cashfree(
    environment,
    config.cashfree.appId,
    config.cashfree.secretKey
  );
  
  console.log('✅ Cashfree SDK initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Cashfree SDK:', error);
  cashfree = null;
}

// NEW: Generate secure UPI URL endpoint
router.post('/generate-upi-url', async (req, res) => {
  try {
    const { orderAmount, customerId, customerPhone, customerEmail, paymentMethod } = req.body;

    console.log('🎯 Generating secure UPI URL:', {
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
    const transactionRef = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get business UPI ID from environment (secure)
    const businessUpiId = process.env.BUSINESS_UPI_ID || '9346048610-2@axl'; // Default for testing
    
    // Create secure UPI URL
    const upiUrl = `upi://pay?pa=${businessUpiId}&pn=ExpressAid&am=${amount}&tr=${transactionRef}&tn=Payment for ExpressAid services - Order ${transactionRef}&cu=INR`;
    
    // Log the transaction for audit trail
    console.log('📱 Generated UPI URL:', {
      transactionRef,
      amount,
      customerId,
      customerPhone,
      upiUrl: upiUrl.substring(0, 50) + '...' // Log partial URL for security
    });

    // TODO: Save transaction to database for tracking
    // await saveTransaction({
    //   transactionRef,
    //   amount,
    //   customerId,
    //   customerPhone,
    //   status: 'pending',
    //   paymentMethod: 'upi',
    //   createdAt: new Date()
    // });

    res.json({
      success: true,
      data: {
        upiUrl,
        transactionRef,
        amount,
        businessUpiId: businessUpiId.substring(0, 10) + '...', // Partial for security
        paymentMethod: paymentMethod || 'upi'
      }
    });

  } catch (error) {
    console.error('❌ UPI URL generation failed:', error);
    res.status(500).json({
      error: 'Failed to generate UPI URL',
      details: error.message || 'Unknown error'
    });
  }
});

router.post('/cashfree/create-order', async (req, res) => {
  try {
    const { orderAmount, customerId, customerPhone, customerEmail, returnUrl, paymentMethod } = req.body;

    console.log('🎯 Creating Cashfree order:', {
      orderAmount,
      customerId,
      customerPhone,
      customerEmail,
      paymentMethod
    });

    // Validate required fields
    if (!orderAmount || !customerId || !customerPhone) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'orderAmount, customerId, and customerPhone are required'
      });
    }

    // Create order payload according to Cashfree SDK documentation
    const orderPayload = {
      order_amount: parseFloat(orderAmount),
      order_currency: "INR",
      customer_details: {
        customer_id: customerId,
        customer_name: customerId,
        customer_email: customerEmail || `${customerId}@expressaid.com`,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: returnUrl || "https://expressaid.com/payment-success",
        notify_url: "https://expressaid.centralus.cloudapp.azure.com:5000/api/cashfree/webhook"
      },
      order_note: "ExpressAid Healthcare Services"
    };

    console.log('📤 Order payload:', JSON.stringify(orderPayload, null, 2));

    // Create order using Cashfree SDK
    const result = await cashfree.PGCreateOrder(orderPayload);
    
    console.log('✅ Order created successfully:', {
      orderId: result.data.order_id,
      sessionId: result.data.payment_session_id,
      status: result.data.order_status
    });

    res.json({
      success: true,
      data: {
        order_id: result.data.order_id,
        payment_session_id: result.data.payment_session_id,
        order_status: result.data.order_status,
        payment_url: result.data.payment_url
      }
    });

  } catch (error) {
    console.error('❌ Cashfree order creation failed:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('📋 Error response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    
    if (error.message) {
      console.error('📝 Error message:', error.message);
    }

    res.status(500).json({
      error: 'Failed to create Cashfree order',
      details: error.response?.data || error.message || 'Unknown error'
    });
  }
});

// Webhook endpoint for Cashfree notifications
router.post('/cashfree/webhook', async (req, res) => {
  try {
    console.log('🔔 Cashfree webhook received:', req.body);
    
    const { orderId, orderAmount, orderStatus, paymentMode, customerDetails } = req.body;
    
    console.log('📊 Payment details:', {
      orderId,
      orderAmount,
      orderStatus,
      paymentMode,
      customerId: customerDetails?.customerId
    });
    
    // TODO: Update order status in your database
    // await updateOrderStatus(orderId, orderStatus);
    
    res.json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;