const axios = require('axios');

const BACKEND_URL = 'https://expressaid-p533i5eoca-uc.a.run.app/api';
const phoneNumber = '+919346048610';

async function testLiveBackend() {
  try {
    console.log('🔍 Testing live backend authentication flow...');
    console.log(`📍 Backend URL: ${BACKEND_URL}`);
    console.log(`📱 Phone Number: ${phoneNumber}`);
    
    // Test 1: Check backend health
    console.log('\n📊 Test 1: Backend health check...');
    try {
      const healthResponse = await axios.get(`${BACKEND_URL}/health`);
      console.log('✅ Backend is healthy:', healthResponse.data);
    } catch (error) {
      console.log('❌ Backend health check failed:', error.message);
      return;
    }
    
    // Test 2: Send OTP
    console.log('\n📊 Test 2: Sending OTP...');
    try {
      const sendOtpResponse = await axios.post(`${BACKEND_URL}/auth/send-otp`, {
        phoneNumber: phoneNumber
      });
      console.log('✅ OTP sent successfully:', sendOtpResponse.data);
    } catch (error) {
      console.log('❌ OTP sending failed:', error.response?.data || error.message);
      return;
    }
    
    // Test 3: Verify OTP (using a test OTP)
    console.log('\n📊 Test 3: Verifying OTP...');
    try {
      // First, let's check what OTP was sent by looking at the response
      const verifyResponse = await axios.post(`${BACKEND_URL}/auth/verify-otp`, {
        phoneNumber: phoneNumber,
        otp: '123456' // This might not work, but let's try
      });
      console.log('✅ OTP verification response:', verifyResponse.data);
    } catch (error) {
      console.log('❌ OTP verification failed:', error.response?.data || error.message);
      
      // If OTP verification fails, let's check if it's because of wrong OTP
      if (error.response?.data?.error) {
        console.log('📝 Error details:', error.response.data);
      }
    }
    
    // Test 4: Check if user exists by trying to get user info
    console.log('\n📊 Test 4: Checking user existence...');
    try {
      // We'll need a valid token for this, so let's just check the OTP response
      console.log('📝 Note: To check user existence, we need a valid token from OTP verification');
    } catch (error) {
      console.log('❌ User check failed:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testLiveBackend(); 