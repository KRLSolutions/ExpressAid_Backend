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

// Enhanced Cashfree UPI Payment Integration - Supports all UPI apps
router.post('/create-upi-order', async (req, res) => {
  try {
    const { orderAmount, customerId, customerPhone, customerEmail, paymentMethod } = req.body;

    console.log('🎯 Creating Cashfree UPI Order:', {
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

    // Validate amount
    const amount = parseFloat(orderAmount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount',
        details: 'orderAmount must be a positive number'
      });
    }

    // Generate unique order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create order payload according to Cashfree UPI documentation
    const orderPayload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerId,
        customer_name: customerId,
        customer_email: customerEmail || `${customerId}@expressaid.com`,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: "https://expressaid.com/payment-success",
        notify_url: "https://expressaid.centralus.cloudapp.azure.com:5000/api/cashfree/webhook"
      },
      order_note: "ExpressAid Healthcare Services - UPI Payment"
    };

    console.log('📤 Cashfree Order Payload:', JSON.stringify(orderPayload, null, 2));

    if (!cashfree) {
      // Mock response for development when Cashfree SDK is not available
      console.log('⚠️ Using mock Cashfree response (SDK not available)');
      
      const mockPaymentUrl = `https://sandbox.cashfree.com/pg/view/payment/mock_session_${orderId}`;
      
      return res.json({
        success: true,
        data: {
          order_id: orderId,
          payment_session_id: `mock_session_${orderId}`,
          order_status: "ACTIVE",
          payment_url: mockPaymentUrl,
          is_mock: true,
          message: "Mock payment session created for development",
          supported_payment_methods: ["phonepe", "googlepay", "paytm", "bhim", "upi"]
        }
      });
    }

    // Create order using Cashfree SDK
    const result = await cashfree.PGCreateOrder(orderPayload);
    
    console.log('✅ Cashfree order created successfully:', {
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
        payment_url: result.data.payment_url,
        is_mock: false,
        supported_payment_methods: ["phonepe", "googlepay", "paytm", "bhim", "upi", "netbanking", "card"],
        message: "Order created successfully. User can pay using any UPI app or payment method."
      }
    });

  } catch (error) {
    console.error('❌ Cashfree UPI order creation failed:', error);
    
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

    // Return mock response for development when Cashfree fails
    console.log('⚠️ Returning mock response due to Cashfree error');
    const orderId = `mock_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockPaymentUrl = `https://sandbox.cashfree.com/pg/view/payment/mock_session_${orderId}`;
    
    res.json({
      success: true,
      data: {
        order_id: orderId,
        payment_session_id: `mock_session_${orderId}`,
        order_status: "ACTIVE",
        payment_url: mockPaymentUrl,
        is_mock: true,
        message: "Mock payment session created due to Cashfree error",
        supported_payment_methods: ["phonepe", "googlepay", "paytm", "bhim", "upi"]
      }
    });
  }
});

// Enhanced UPI URL generation for specific payment methods
router.post('/get-upi-url', async (req, res) => {
  try {
    const { orderAmount, customerId, customerPhone, customerEmail, paymentMethod } = req.body;

    console.log('🎯 Getting UPI URL for:', {
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
    
    // Create UPI URL based on payment method
    let upiUrl;
    let appName = 'ExpressAid';
    
    switch (paymentMethod) {
      case 'phonepe':
        upiUrl = `upi://pay?pa=${businessUpiId}&pn=${appName}&am=${amount}&tr=${transactionRef}&tn=ExpressAid Payment - ${transactionRef}&cu=INR&app=phonepe`;
        break;
      case 'googlepay':
        upiUrl = `upi://pay?pa=${businessUpiId}&pn=${appName}&am=${amount}&tr=${transactionRef}&tn=ExpressAid Payment - ${transactionRef}&cu=INR&app=googlepay`;
        break;
      case 'paytm':
        upiUrl = `upi://pay?pa=${businessUpiId}&pn=${appName}&am=${amount}&tr=${transactionRef}&tn=ExpressAid Payment - ${transactionRef}&cu=INR&app=paytm`;
        break;
      case 'bhim':
        upiUrl = `upi://pay?pa=${businessUpiId}&pn=${appName}&am=${amount}&tr=${transactionRef}&tn=ExpressAid Payment - ${transactionRef}&cu=INR&app=bhim`;
        break;
      default:
        upiUrl = `upi://pay?pa=${businessUpiId}&pn=${appName}&am=${amount}&tr=${transactionRef}&tn=ExpressAid Payment - ${transactionRef}&cu=INR`;
    }
    
    console.log('📱 Generated UPI URL:', {
      transactionRef,
      amount,
      customerId,
      customerPhone,
      paymentMethod,
      upiUrl: upiUrl.substring(0, 50) + '...' // Log partial URL for security
    });

    res.json({
      success: true,
      data: {
        upiUrl,
        transactionRef,
        amount,
        businessUpiId: businessUpiId.substring(0, 10) + '...', // Partial for security
        paymentMethod: paymentMethod || 'upi',
        supportedApps: ['phonepe', 'googlepay', 'paytm', 'bhim', 'any upi app'],
        message: `UPI URL generated for ${paymentMethod || 'any UPI app'}`
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

// New endpoint: Get Cashfree payment session for all UPI apps
router.post('/create-payment-session', async (req, res) => {
  try {
    const { orderAmount, customerId, customerPhone, customerEmail } = req.body;

    console.log('🎯 Creating Cashfree payment session for all UPI apps:', {
      orderAmount,
      customerId,
      customerPhone,
      customerEmail
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

    // Generate unique order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create order payload
    const orderPayload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerId,
        customer_name: customerId,
        customer_email: customerEmail || `${customerId}@expressaid.com`,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: "https://expressaid.com/payment-success",
        notify_url: "https://expressaid.centralus.cloudapp.azure.com:5000/api/cashfree/webhook"
      },
      order_note: "ExpressAid Healthcare Services - UPI Payment"
    };

    if (!cashfree) {
      // Mock response
      const mockPaymentUrl = `https://sandbox.cashfree.com/pg/view/payment/mock_session_${orderId}`;
      
      return res.json({
        success: true,
        data: {
          order_id: orderId,
          payment_session_id: `mock_session_${orderId}`,
          payment_url: mockPaymentUrl,
          is_mock: true,
          supported_payment_methods: [
            "phonepe", "googlepay", "paytm", "bhim", "upi", 
            "netbanking", "card", "wallet", "emi"
          ],
          message: "Mock payment session created. Supports all UPI apps and payment methods."
        }
      });
    }

    // Create order using Cashfree SDK
    const result = await cashfree.PGCreateOrder(orderPayload);
    
    console.log('✅ Cashfree payment session created successfully:', {
      orderId: result.data.order_id,
      sessionId: result.data.payment_session_id
    });

    res.json({
      success: true,
      data: {
        order_id: result.data.order_id,
        payment_session_id: result.data.payment_session_id,
        payment_url: result.data.payment_url,
        is_mock: false,
        supported_payment_methods: [
          "phonepe", "googlepay", "paytm", "bhim", "upi", 
          "netbanking", "card", "wallet", "emi"
        ],
        message: "Payment session created successfully. User can pay using any UPI app or payment method."
      }
    });

  } catch (error) {
    console.error('❌ Payment session creation failed:', error);
    
    // Return mock response for development
    const orderId = `mock_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockPaymentUrl = `https://sandbox.cashfree.com/pg/view/payment/mock_session_${orderId}`;
    
    res.json({
      success: true,
      data: {
        order_id: orderId,
        payment_session_id: `mock_session_${orderId}`,
        payment_url: mockPaymentUrl,
        is_mock: true,
        supported_payment_methods: [
          "phonepe", "googlepay", "paytm", "bhim", "upi", 
          "netbanking", "card", "wallet", "emi"
        ],
        message: "Mock payment session created due to Cashfree error"
      }
    });
  }
});

// Legacy endpoint for backward compatibility
router.post('/generate-upi-url', async (req, res) => {
  // Redirect to new endpoint
  req.url = '/get-upi-url';
  return router.handle(req, res);
});

// Legacy endpoint for backward compatibility
router.post('/upi-payment', async (req, res) => {
  // Redirect to new endpoint
  req.url = '/get-upi-url';
  return router.handle(req, res);
});

// Legacy Cashfree order creation endpoint
router.post('/cashfree/create-order', async (req, res) => {
  // Redirect to new UPI order endpoint
  req.url = '/create-upi-order';
  return router.handle(req, res);
});

// Enhanced webhook endpoint for Cashfree notifications
router.post('/webhook', async (req, res) => {
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
    
    // Log payment method used
    if (paymentMode) {
      console.log(`💳 Payment completed via: ${paymentMode}`);
    }
    
    res.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      orderId,
      status: orderStatus
    });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Test endpoint to verify Cashfree credentials
router.get('/test-credentials', async (req, res) => {
  try {
    console.log('🧪 Testing Cashfree credentials...');
    
    if (!cashfree) {
      return res.json({
        success: false,
        error: 'Cashfree SDK not initialized',
        details: 'Check your credentials and SDK installation'
      });
    }

    // Test with minimal order
    const testOrder = {
      order_id: `test_${Date.now()}`,
      order_amount: 1,
      order_currency: "INR",
      customer_details: {
        customer_id: "test_customer",
        customer_name: "Test Customer",
        customer_email: "test@example.com",
        customer_phone: "9999999999",
      },
      order_note: "Test order"
    };

    const result = await cashfree.PGCreateOrder(testOrder);
    
    res.json({
      success: true,
      message: 'Credentials are working!',
      data: {
        order_id: result.data.order_id,
        session_id: result.data.payment_session_id,
        supported_payment_methods: [
          "phonepe", "googlepay", "paytm", "bhim", "upi", 
          "netbanking", "card", "wallet", "emi"
        ]
      }
    });

  } catch (error) {
    console.error('❌ Credential test failed:', error);
    
    res.json({
      success: false,
      error: 'Credentials test failed',
      details: error.response?.data || error.message,
      recommendation: 'Check your App ID and Secret Key in the Cashfree merchant dashboard'
    });
  }
});

module.exports = router;