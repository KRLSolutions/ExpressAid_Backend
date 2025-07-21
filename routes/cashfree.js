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