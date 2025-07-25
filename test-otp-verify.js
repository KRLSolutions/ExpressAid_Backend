const fetch = require('node-fetch');

async function testOTPVerification() {
  console.log('🔐 Testing OTP Verification with correct code...\n');
  
  const baseUrl = 'http://localhost:5000/api';
  
  try {
    // Test 1: Send OTP
    console.log('1️⃣ Sending OTP...');
    const sendOtpResponse = await fetch(`${baseUrl}/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: '+919346048610'
      })
    });
    
    const sendOtpData = await sendOtpResponse.json();
    console.log('Send OTP result:', sendOtpData);
    
    if (sendOtpData.success) {
      console.log('✅ OTP sent successfully!');
      
      // Test 2: Verify OTP with correct code (123456)
      console.log('\n2️⃣ Verifying OTP with code: 123456');
      const verifyOtpResponse = await fetch(`${baseUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: '+919346048610',
          otp: '123456'
        })
      });
      
      const verifyOtpData = await verifyOtpResponse.json();
      console.log('Verify OTP result:', verifyOtpData);
      
      if (verifyOtpData.success) {
        console.log('✅ OTP verification successful!');
        console.log('   Token received:', verifyOtpData.token ? 'Yes' : 'No');
        console.log('   User ID:', verifyOtpData.userId);
        console.log('   Phone verified:', verifyOtpData.user?.isPhoneVerified);
      } else {
        console.log('❌ OTP verification failed');
        console.log('   Error:', verifyOtpData.error);
      }
    }
    
    console.log('\n🎉 OTP Test Complete!');
    console.log('📱 For phone testing, use OTP code: 123456');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testOTPVerification(); 