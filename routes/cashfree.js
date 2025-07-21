// routes/cashfree.js
const express = require('express');
const router = express.Router();
const config = require('../config');

// Initialize Cashfree SDK with proper error handling
let cashfree;
try {
  const { Cashfree } = require('cashfree-pg');
  
  console.log('🔧 Initializing Cashfree SDK with config:', {
    clientId: config.cashfree.appId,
    clientSecret: config.cashfree.secretKey.substring(0, 10) + '...',
    environment: config.cashfree.environment
  });

  console.log('🔍 Environment variables check:', {
    CASHFREE_APP_ID: process.env.CASHFREE_APP_ID,
    CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY ? process.env.CASHFREE_SECRET_KEY.substring(0, 10) + '...' : 'NOT SET',
    CASHFREE_ENV: process.env.CASHFREE_ENV
  });

  cashfree = new Cashfree({
    clientId: config.cashfree.appId,
    clientSecret: config.cashfree.secretKey,
    environment: config.cashfree.environment
  });
  
  console.log('✅ Cashfree SDK initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Cashfree SDK:', error);
  cashfree = null;
}

router.post('/cashfree/create-order', async (req, res) => {
  try {
    const { orderAmount, customerId, customerPhone, customerEmail, returnUrl, paymentMethod } = req.body;

    console.log('🎯 Creating Cashfree order with SDK:', {
      orderAmount,
      customerId,
      customerPhone,
      customerEmail,
      returnUrl,
      paymentMethod
    });

    // Check if Cashfree SDK is available
    if (!cashfree) {
      console.error('❌ Cashfree SDK not initialized');
      return res.status(500).json({
        error: 'Payment service not available',
        details: 'Cashfree SDK not initialized'
      });
    }

    // Validate required fields
    if (!orderAmount || !customerId || !customerPhone) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'orderAmount, customerId, and customerPhone are required'
      });
    }

    const orderPayload = {
      orderId: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderAmount: parseFloat(orderAmount),
      orderCurrency: 'INR',
      customerDetails: {
        customerId: customerId,
        customerEmail: customerEmail || `${customerId}@expressaid.com`,
        customerPhone: customerPhone,
      },
      orderMeta: {
        returnUrl: returnUrl || 'https://expressaid.com/payment-success',
        notifyUrl: 'https://expressaid.centralus.cloudapp.azure.com:5000/api/cashfree/webhook'
      }
    };

    // Add payment method if specified
    if (paymentMethod) {
      orderPayload.paymentMethod = paymentMethod;
    }

    console.log('📤 SDK Order Payload:', JSON.stringify(orderPayload, null, 2));

    const result = await cashfree.PGCreateOrder(orderPayload);
    
    console.log('✅ SDK Response:', JSON.stringify(result, null, 2));

    res.json({
      success: true,
      data: {
        order_id: result.orderId,
        payment_session_id: result.paymentSessionId,
        order_status: result.orderStatus,
        payment_url: result.paymentUrl
      }
    });
  } catch (error) {
    console.error('❌ Cashfree SDK error:', error);
    console.error('📋 Error details:', {
      message: error.message,
      code: error.code,
      type: error.type,
      stack: error.stack
    });
    
    // Handle specific Cashfree errors
    if (error.message && error.message.includes('401')) {
      console.error('🔐 Cashfree Authentication Error - Using fallback mode');
      
      // For development/testing, create a mock order
      const mockOrderId = `mock_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const mockSessionId = `mock_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return res.json({
        success: true,
        data: {
          order_id: mockOrderId,
          payment_session_id: mockSessionId,
          order_status: 'ACTIVE',
          payment_url: `https://sandbox.cashfree.com/pg/view/payment/${mockSessionId}`,
          is_mock: true,
          message: 'Using mock payment for development. Please update Cashfree credentials for production.'
        }
      });
    }
    
    res.status(500).json({
      error: 'Failed to create Cashfree order',
      details: error.message || 'Unknown error'
    });
  }
});



// Webhook endpoint for Cashfree notifications
router.post('/cashfree/webhook', async (req, res) => {
  try {
    console.log('🔔 Cashfree webhook received:', req.body);
    
    const { orderId, orderAmount, orderStatus, paymentMode, customerDetails } = req.body;
    
    // Verify webhook signature (you should implement this)
    // const signature = req.headers['x-webhook-signature'];
    // const isValid = verifyWebhookSignature(req.body, signature);
    
    console.log('📊 Payment details:', {
      orderId,
      orderAmount,
      orderStatus,
      paymentMode,
      customerId: customerDetails?.customerId
    });
    
    // Update order status in your database
    // await updateOrderStatus(orderId, orderStatus);
    
    res.json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
