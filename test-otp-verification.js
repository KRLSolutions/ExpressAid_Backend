const axios = require('axios');

const BASE_URL = 'https://expressaid-p533i5eoca-uc.a.run.app/api';

async function testOTPVerification() {
  console.log('🧪 Testing OTP Verification Process');
  console.log('===================================\n');
  
  const phoneNumber = '+919346048610';
  
  try {
    // Step 1: Send OTP
    console.log('📱 Step 1: Sending OTP...');
    const sendOtpResponse = await axios.post(`${BASE_URL}/auth/send-otp`, {
      phoneNumber: phoneNumber
    });
    
    console.log('✅ OTP sent successfully');
    console.log('   Response:', sendOtpResponse.data);
    
    // Step 2: Verify OTP (using a test OTP)
    console.log('\n🔐 Step 2: Verifying OTP...');
    console.log('   Note: Using test OTP "123456" for demonstration');
    
    const verifyOtpResponse = await axios.post(`${BASE_URL}/auth/verify-otp`, {
      phoneNumber: phoneNumber,
      otp: '123456', // Test OTP
      role: 'customer'
    });
    
    console.log('✅ OTP verification response:');
    console.log('   Success:', verifyOtpResponse.data.success);
    console.log('   Message:', verifyOtpResponse.data.message);
    console.log('   User ID:', verifyOtpResponse.data.userId);
    console.log('   Token:', verifyOtpResponse.data.token ? 'Present' : 'Missing');
    
    // Check user details
    const user = verifyOtpResponse.data.user;
    console.log('\n👤 User Details:');
    console.log('   Name:', user.name || 'Not set');
    console.log('   Age:', user.age || 'Not set');
    console.log('   Sex:', user.sex || 'Not set');
    console.log('   Has Profile:', user.hasProfile);
    console.log('   Phone Verified:', user.isPhoneVerified);
    console.log('   Role:', user.role);
    
    // Navigation logic
    console.log('\n🧭 Navigation Logic:');
    if (user.hasProfile) {
      console.log('✅ User has complete profile → Should go to HOME page');
    } else {
      console.log('❌ User missing profile → Should go to PROFILE SETUP page');
    }
    
    // Full response for debugging
    console.log('\n📋 Full API Response:');
    console.log(JSON.stringify(verifyOtpResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testOTPVerification(); 