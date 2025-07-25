// Test OTP generation function
function generateOTP() {
  return '123456';
}

console.log('🔐 Testing OTP Generation...');
console.log('Generated OTP:', generateOTP());

// Test the condition
console.log('\n🔍 Environment Check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Should return 123456:', generateOTP() === '123456');

console.log('\n✅ OTP Generation Test Complete!');
console.log('📱 Use OTP code: 123456 for testing'); 