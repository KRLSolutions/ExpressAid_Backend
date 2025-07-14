const User = require('./models/User');

async function debugTest() {
  try {
    console.log('Testing User model...');
    
    // Test creating a user
    const user = new User({ phoneNumber: '+1234567890' });
    console.log('User created:', user);
    
    // Test generating OTP
    const otp = user.generateOTP();
    console.log('OTP generated:', otp);
    console.log('User OTP:', user.otp);
    
    // Test saving user
    const savedUser = await user.save();
    console.log('User saved:', savedUser);
    
    // Test finding user by phone
    const foundUser = await User.findByPhone('+1234567890');
    console.log('User found:', foundUser);
    
    // Test verifying OTP
    const isValid = foundUser.verifyOTP(otp);
    console.log('OTP verification:', isValid);
    
  } catch (error) {
    console.error('Debug test failed:', error);
  }
}

debugTest(); 