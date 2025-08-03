const mongoose = require('mongoose');
const User = require('./models/User');
const config = require('./config');

async function testCompleteFlow() {
  try {
    console.log('🔍 Testing complete authentication flow...');
    
    // Connect to MongoDB
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Connected to MongoDB');
    
    const phoneNumber = '+919346048610';
    
    // Test 1: Check if existing user is found
    console.log('\n📊 Test 1: Finding existing user...');
    const existingUser = await User.findOne({ phoneNumber });
    console.log('Existing user found:', existingUser ? 'Yes' : 'No');
    if (existingUser) {
      console.log('User details:', {
        userId: existingUser.userId,
        phoneNumber: existingUser.phoneNumber,
        name: existingUser.name,
        hasProfile: !!(existingUser.name && existingUser.sex && existingUser.age)
      });
    }
    
    // Test 2: Simulate OTP sending (should find existing user)
    console.log('\n📊 Test 2: Simulating OTP sending...');
    const otp = '123456';
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      console.log('Creating new user...');
      user = new User({ phoneNumber });
    } else {
      console.log('Found existing user, updating OTP...');
    }
    
    // Update OTP
    user.otp = {
      code: otp,
      expiresAt: otpExpiry
    };
    user.isPhoneVerified = false;
    
    await user.save();
    console.log('✅ OTP saved successfully');
    
    // Test 3: Simulate OTP verification
    console.log('\n📊 Test 3: Simulating OTP verification...');
    const verifyUser = await User.findOne({ phoneNumber });
    
    if (!verifyUser) {
      console.log('❌ User not found for verification');
      return;
    }
    
    if (!verifyUser.otp || !verifyUser.otp.code) {
      console.log('❌ No OTP found');
      return;
    }
    
    if (verifyUser.otp.code !== otp) {
      console.log('❌ Invalid OTP');
      return;
    }
    
    if (verifyUser.otp.expiresAt < new Date()) {
      console.log('❌ OTP expired');
      return;
    }
    
    // Mark as verified
    verifyUser.isPhoneVerified = true;
    verifyUser.otp = null;
    await verifyUser.save();
    
    console.log('✅ OTP verified successfully');
    console.log('User profile complete:', !!(verifyUser.name && verifyUser.sex && verifyUser.age));
    
    // Test 4: Check final user state
    console.log('\n📊 Test 4: Final user state...');
    const finalUser = await User.findOne({ phoneNumber });
    console.log('Final user state:', {
      userId: finalUser.userId,
      phoneNumber: finalUser.phoneNumber,
      name: finalUser.name,
      isPhoneVerified: finalUser.isPhoneVerified,
      hasProfile: !!(finalUser.name && finalUser.sex && finalUser.age),
      otp: finalUser.otp ? 'Present' : 'Cleared'
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testCompleteFlow(); 