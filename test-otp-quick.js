const fetch = require('node-fetch');

async function testOTP() {
  console.log('🔐 Quick OTP Test...\n');
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch('http://192.168.0.9:5002/api/health');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check passed:', healthData);
    } else {
      console.log('❌ Health check failed');
      return;
    }
    
    // Test 2: Send OTP
    console.log('\n2️⃣ Testing OTP endpoint...');
    const otpResponse = await fetch('http://192.168.0.9:5002/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: '+919346048610' })
    });
    
    if (otpResponse.ok) {
      const otpData = await otpResponse.json();
      console.log('✅ OTP sent successfully:', otpData);
      console.log('📱 OTP Code:', otpData.otp);
    } else {
      console.log('❌ OTP request failed');
      const errorText = await otpResponse.text();
      console.log('Error:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure backend server is running');
    console.log('2. Check if port 5001 is accessible');
    console.log('3. Check Windows Firewall');
  }
}

testOTP(); 