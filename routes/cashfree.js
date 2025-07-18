// routes/cashfree.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

const CASHFREE_CLIENT_ID = 'TEST10393719a08909e07f6157a7221e91739301';
const CASHFREE_CLIENT_SECRET = 'cfsk_ma_test_d81a3c09420dcde848287e6b7aacfca5_3f2bf834';
const CASHFREE_API_BASE = 'https://sandbox.cashfree.com/pg';

router.post('/create-order', async (req, res) => {
  try {
    const { orderAmount, customerId, customerPhone, customerEmail, returnUrl, paymentMethod } = req.body;

    console.log('🎯 Creating Cashfree order with:', {
      orderAmount,
      customerId,
      customerPhone,
      customerEmail,
      paymentMethod
    });

    const orderPayload = {
      order_id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      order_amount: orderAmount,
      order_currency: 'INR',
      customer_details: {
        customer_id: customerId,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: returnUrl || 'https://yourfrontend.com/payment-success',
      }
    };

    console.log('📤 Sending order to Cashfree:', orderPayload);

    const response = await axios.post(
      `${CASHFREE_API_BASE}/orders`,
      orderPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': CASHFREE_CLIENT_ID,
          'x-client-secret': CASHFREE_CLIENT_SECRET,
          'x-api-version': '2022-09-01',
        }
      }
    );

    console.log('✅ Cashfree order created successfully:', response.data);

    const { order_id, payment_session_id } = response.data;

    // Return response in the format expected by frontend
    res.json({
      success: true,
      data: {
        orderId: order_id,
        paymentSessionId: payment_session_id,
        paymentUrl: `https://sandbox.cashfree.com/pg/view/payment/${payment_session_id}`,
        orderAmount: orderAmount,
        orderCurrency: 'INR'
      }
    });
  } catch (error) {
    console.error('❌ Cashfree error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to create Cashfree order',
      details: error.response?.data || error.message
    });
  }
});

// UPI Session Links endpoint
router.post('/upi-session', async (req, res) => {
  try {
    const { paymentSessionId, paymentMethod } = req.body;

    console.log('🔗 Getting UPI session links for:', { paymentSessionId, paymentMethod });

    // For now, return mock UPI links since the actual Cashfree UPI API might be different
    // In production, you would call the actual Cashfree UPI API
    const mockUpiLinks = {
      phonepe: `phonepe://pay?pa=merchant@upi&pn=ExpressAid&tn=Payment&am=${Math.random() * 1000}&cu=INR&tr=${Date.now()}`,
      gpay: `upi://pay?pa=merchant@upi&pn=ExpressAid&tn=Payment&am=${Math.random() * 1000}&cu=INR&tr=${Date.now()}`,
      default: `upi://pay?pa=merchant@upi&pn=ExpressAid&tn=Payment&am=${Math.random() * 1000}&cu=INR&tr=${Date.now()}`
    };

    // Return response in the format expected by frontend
    res.json({
      success: true,
      data: {
        data: {
          payload: mockUpiLinks
        }
      }
    });

  } catch (error) {
    console.error('❌ UPI session error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get UPI session links',
      details: error.response?.data || error.message
    });
  }
});

// Test credentials endpoint
router.get('/test-credentials', async (req, res) => {
  try {
    console.log('🔍 Testing Cashfree credentials...');
    
    // Test with minimal order
    const testOrder = {
      order_id: `test_${Date.now()}`,
      order_amount: 1,
      order_currency: 'INR',
      customer_details: {
        customer_id: 'test',
        customer_phone: '9999999999',
        customer_email: 'test@example.com'
      }
    };

    const response = await axios.post(
      `${CASHFREE_API_BASE}/orders`,
      testOrder,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': CASHFREE_CLIENT_ID,
          'x-client-secret': CASHFREE_CLIENT_SECRET,
          'x-api-version': '2022-09-01',
        }
      }
    );

    console.log('✅ Cashfree credentials are valid!');
    res.json({
      success: true,
      message: 'Cashfree credentials are valid',
      data: response.data
    });

  } catch (error) {
    console.error('❌ Cashfree credentials test failed:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Cashfree credentials test failed',
      details: error.response?.data || error.message
    });
  }
});

module.exports = router;
