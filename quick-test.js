const express = require('express');
const app = express();

app.use(express.json());

// Simple OTP endpoint
app.post('/api/auth/send-otp', (req, res) => {
  console.log('📱 OTP request received:', req.body);
  res.json({
    success: true,
    message: 'OTP sent successfully',
    phoneNumber: req.body.phoneNumber,
    otp: '123456'
  });
});

// Simple Cashfree payment session endpoint
app.post('/api/cashfree/create-payment-session', (req, res) => {
  console.log('💳 Cashfree payment session request received:', req.body);
  res.json({
    success: true,
    message: 'Payment session created successfully',
    data: {
      payment_session_id: 'test_session_' + Date.now(),
      payment_url: 'https://sandbox.cashfree.com/pg/view/payment/test_session_' + Date.now(),
      order_id: 'test_order_' + Date.now()
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Quick test server running' });
});

const PORT = 5002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Quick test server running on port ${PORT}`);
  console.log(`🌐 Test URL: http://192.168.0.9:${PORT}/api/health`);
  console.log(`📱 OTP URL: http://192.168.0.9:${PORT}/api/auth/send-otp`);
}); 