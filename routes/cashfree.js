const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config');

// Cashfree credentials from config
const CF_APP_ID = config.cashfree.appId;
const CF_SECRET_KEY = config.cashfree.secretKey;
const CF_ENV = config.cashfree.environment;

// Cashfree API endpoint and version
const CF_API_URL = CF_ENV === 'TEST'
  ? 'https://sandbox.cashfree.com/pg/orders'
  : 'https://api.cashfree.com/pg/orders';
const CF_API_VERSION = '2023-08-01';

// New: Sessions endpoint for UPI intent
const CF_SESSIONS_URL = CF_ENV === 'TEST'
  ? 'https://sandbox.cashfree.com/pg/sessions'
  : 'https://api.cashfree.com/pg/sessions';

// UPI Intent endpoint
const CF_UPI_INTENT_URL = CF_ENV === 'TEST'
  ? 'https://sandbox.cashfree.com/pg/orders/sessions'
  : 'https://api.cashfree.com/pg/orders/sessions';

router.post('/cashfree/create-order', async (req, res) => {
  const { orderAmount, customerId, customerPhone, customerEmail, returnUrl, paymentMethod } = req.body;
  
  // Debug: Log the received request body
  console.log('📥 Received request body:', JSON.stringify(req.body, null, 2));
  console.log('🔍 Extracted paymentMethod:', paymentMethod);
  
  try {
    // Build the order payload as per latest docs
    const orderPayload = {
      order_currency: 'INR',
      order_amount: orderAmount,
      customer_details: {
        customer_id: customerId,
        customer_phone: customerPhone,
        customer_email: customerEmail
      },
      order_meta: {}
    };
    
    // Add payment_methods based on payment method
    if (paymentMethod === 'upi' || paymentMethod === 'phonepe' || paymentMethod === 'googlepay') {
      orderPayload.order_meta.payment_methods = 'upi';
      // Use a deep link URL that will open your React Native app
      orderPayload.order_meta.return_url = 'expressaid://payment/return?order_id={order_id}';
      // For UPI payments, also add UPI-specific configuration
      orderPayload.order_meta.upi_intent = true;
      console.log('✅ Setting payment_methods to "upi" for UPI/PhonePe/Google Pay');
    } else if (paymentMethod === 'card') {
      orderPayload.order_meta.payment_methods = 'cc,dc';
      // For card payments, also set return URL
      orderPayload.order_meta.return_url = 'expressaid://payment/return?order_id={order_id}';
      console.log('✅ Setting payment_methods to "cc,dc" for card payment');
    } else {
      orderPayload.order_meta.payment_methods = 'cc,dc,upi';
      orderPayload.order_meta.return_url = 'expressaid://payment/return?order_id={order_id}';
      console.log('✅ Setting payment_methods to "cc,dc,upi" for default');
    }
    
    // Optionally add return_url if provided
    if (returnUrl) {
      orderPayload.order_meta.return_url = returnUrl;
      console.log('✅ Added return_url:', returnUrl);
    }

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'x-api-version': CF_API_VERSION,
      'x-client-id': CF_APP_ID,
      'x-client-secret': CF_SECRET_KEY
    };

    console.log('🔧 Creating Cashfree order (latest API) with:', JSON.stringify(orderPayload, null, 2));
    console.log('💰 Amount:', orderAmount);
    console.log('🎯 Final order_meta:', JSON.stringify(orderPayload.order_meta, null, 2));

    // Make the API call
    const response = await axios.post(CF_API_URL, orderPayload, { headers });
    console.log('✅ Cashfree API Success! Response:', JSON.stringify(response.data, null, 2));
    res.json({
      success: true,
      data: response.data,
      message: 'Order created using latest Cashfree API'
    });
  } catch (error) {
    // Handle API errors
    const errData = error.response?.data || {};
    console.error('❌ Cashfree API error:', error.message, errData);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.message,
      details: errData
    });
  }
});

// New: UPI session endpoint to get UPI intent links
router.post('/cashfree/upi-session', async (req, res) => {
  const { paymentSessionId, paymentMethod } = req.body;
  try {
    const headers = {
      'Content-Type': 'application/json',
      'x-api-version': CF_API_VERSION,
      'x-client-id': CF_APP_ID,
      'x-client-secret': CF_SECRET_KEY
    };
    
    // Use the correct UPI intent endpoint
    const upiIntentUrl = CF_ENV === 'TEST'
      ? 'https://sandbox.cashfree.com/pg/orders/sessions'
      : 'https://api.cashfree.com/pg/orders/sessions';
    
    // For UPI intent, we need to use the payment session ID to get app-specific links
    const payload = {
      payment_session_id: paymentSessionId,
      payment_method: {
        upi: {
          channel: 'link'
        }
      }
    };
    
    console.log('🔗 Requesting UPI session links with:', JSON.stringify(payload));
    console.log('🔗 Using UPI intent URL:', upiIntentUrl);
    console.log('🔗 Payment method:', paymentMethod);
    
    const response = await axios.post(upiIntentUrl, payload, { headers });
    console.log('✅ UPI session response:', JSON.stringify(response.data, null, 2));
    
    // The response should contain UPI intent links for different apps
    // Based on your example, the response structure is:
    // { data: { payload: { phonepe: "...", gpay: "...", default: "..." } } }
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    const errData = error.response?.data || {};
    console.error('❌ UPI session error:', error.message, errData);
    console.error('❌ Error response status:', error.response?.status);
    console.error('❌ Error response headers:', error.response?.headers);
    
    // If the sessions API fails, we'll fall back to the payment URL
    console.log('🔄 Falling back to payment URL approach');
    res.json({
      success: false,
      error: error.message,
      details: errData,
      fallback: true
    });
  }
});

// Add a test endpoint to check credentials
router.get('/cashfree/test-credentials', async (req, res) => {
  try {
    // Minimal test order
    const orderPayload = {
      order_currency: 'INR',
      order_amount: 1,
      customer_details: {
        customer_id: 'test',
        customer_phone: '9999999999',
        customer_email: 'test@example.com'
      }
    };
    const headers = {
      'Content-Type': 'application/json',
      'x-api-version': CF_API_VERSION,
      'x-client-id': CF_APP_ID,
      'x-client-secret': CF_SECRET_KEY
    };
    const response = await axios.post(CF_API_URL, orderPayload, { headers });
    res.json({
      success: true,
      message: 'Credentials are valid!',
      data: response.data
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'Credentials are invalid or API is not accessible',
      error: error.message,
      details: error.response?.data
    });
  }
});

module.exports = router; 