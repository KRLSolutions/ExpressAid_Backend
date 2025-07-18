// routes/cashfree.js
const express = require('express');
const router = express.Router();
const { Cashfree } = require('cashfree-pg');
const config = require('../config');

// Initialize Cashfree SDK
const cashfree = new Cashfree({
  clientId: config.cashfree.appId,
  clientSecret: config.cashfree.secretKey,
  environment: config.cashfree.environment
});

router.post('/cashfree/create-order', async (req, res) => {
  try {
    const { orderAmount, customerId, customerPhone, customerEmail, returnUrl } = req.body;

    console.log('🎯 Creating Cashfree order with SDK:', {
      orderAmount,
      customerId,
      customerPhone,
      customerEmail,
      returnUrl
    });

    const orderPayload = {
      orderId: `order_${Date.now()}`,
      orderAmount: orderAmount,
      orderCurrency: 'INR',
      customerDetails: {
        customerId: customerId,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
      },
      orderMeta: {
        returnUrl: returnUrl || 'https://yourfrontend.com/payment-success',
      }
    };

    console.log('📤 SDK Order Payload:', JSON.stringify(orderPayload, null, 2));

    const result = await cashfree.PGCreateOrder(orderPayload);
    
    console.log('✅ SDK Response:', JSON.stringify(result, null, 2));

    res.json({
      data: {
        order_id: result.orderId,
        payment_session_id: result.paymentSessionId
      }
    });
  } catch (error) {
    console.error('❌ Cashfree SDK error:', error);
    console.error('📋 Error details:', {
      message: error.message,
      code: error.code,
      type: error.type
    });
    res.status(500).json({
      error: 'Failed to create Cashfree order',
      details: error.message || 'Unknown error'
    });
  }
});



module.exports = router;
