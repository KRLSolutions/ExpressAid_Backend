const axios = require('axios');

// Production backend URL
const PRODUCTION_URL = 'https://expressaid-backend.azurewebsites.net';

// Test phone number (replace with your actual number)
const TEST_PHONE_NUMBER = '+919346048610';

async function testProductionSMS() {
  console.log('🧪 Testing SMS in Production Environment');
  console.log('=========================================');
  console.log(`🌐 Backend URL: ${PRODUCTION_URL}`);
  console.log(`📱 Test Phone: ${TEST_PHONE_NUMBER}`);
  console.log('');

  try {
    // Test 1: Health Check
    console.log('📊 Testing Health Check...');
    const healthResponse = await axios.get(`${PRODUCTION_URL}/api/health`);
    console.log('✅ Health Check Passed');
    console.log('Response:', healthResponse.data);
    console.log('');

    // Test 2: Status Check
    console.log('📋 Testing Status Check...');
    const statusResponse = await axios.get(`${PRODUCTION_URL}/api/status`);
    console.log('✅ Status Check Passed');
    console.log('Response:', statusResponse.data);
    console.log('');

    // Test 3: Send OTP
    console.log('📱 Testing SMS/OTP Send...');
    const otpResponse = await axios.post(`${PRODUCTION_URL}/api/auth/send-otp`, {
      phoneNumber: TEST_PHONE_NUMBER
    });
    console.log('✅ OTP Sent Successfully');
    console.log('Response:', otpResponse.data);
    console.log('');

    // Test 4: Test with different phone number format
    console.log('📱 Testing with different phone format...');
    const otpResponse2 = await axios.post(`${PRODUCTION_URL}/api/auth/send-otp`, {
      phoneNumber: '919346048610' // Without + prefix
    });
    console.log('✅ OTP Sent with different format');
    console.log('Response:', otpResponse2.data);
    console.log('');

    console.log('🎉 All tests passed! SMS functionality is working in production.');
    console.log('');
    console.log('📋 Summary:');
    console.log('- Backend is running and healthy');
    console.log('- SMS service is configured and working');
    console.log('- OTP sending is functional');
    console.log('');
    console.log('🔧 Next Steps:');
    console.log('1. Test with your actual phone number');
    console.log('2. Verify OTP delivery');
    console.log('3. Test complete authentication flow');
    console.log('4. Monitor AWS SNS costs');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Check if Azure deployment is complete');
    console.log('2. Verify AWS SNS credentials');
    console.log('3. Check AWS SNS spending limits');
    console.log('4. Verify phone number format');
  }
}

// Run the test
testProductionSMS(); 