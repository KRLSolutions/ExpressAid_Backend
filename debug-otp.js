const User = require('./models/User');
const awsSnsService = require('./services/awsSnsService');
const mongoose = require('mongoose');
const config = require('./config');

async function debugOTP() {
  try {
    console.log('🔍 Debugging OTP sending...\n');
    
    const phoneNumber = '+1234567890';
    console.log('1. Testing with phone number:', phoneNumber);
    
    // Test User.findOne
    console.log('\n2. Testing User.findOne...');
    let user = await User.findOne({ phoneNumber });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('3. Creating new user...');
      user = new User({ phoneNumber });
      console.log('User created:', user);
    }
    
    // Test OTP generation
    console.log('\n4. Generating OTP...');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    console.log('OTP:', otp);
    console.log('Expiry:', otpExpiry);
    
    // Test user save
    console.log('\n5. Updating user with OTP...');
    user.otp = {
      code: otp,
      expiresAt: otpExpiry
    };
    user.isPhoneVerified = false;
    
    console.log('6. Saving user...');
    try {
      const savedUser = await user.save();
      console.log('User saved successfully:', savedUser ? 'Yes' : 'No');
      console.log('Saved user details:', savedUser);
    } catch (saveError) {
      console.error('❌ User save failed:', saveError);
      console.error('Save error stack:', saveError.stack);
      return;
    }
    
    // Test SMS sending
    console.log('\n7. Testing SMS sending...');
    const message = `Your ExpressAid verification code is: ${otp}. Valid for 10 minutes.`;
    const smsResult = await awsSnsService.sendSMS(phoneNumber, message);
    console.log('SMS result:', smsResult);
    
    console.log('\n✅ OTP debug completed successfully!');
    
  } catch (error) {
    console.error('❌ OTP debug failed:', error);
    console.error('Error stack:', error.stack);
  }
}

// Script to insert 4 demo nurses with different locations near Bangalore
const UserModel = require('./models/User').model;

const nurses = [
  {
    userId: 'NURSE_1',
    phoneNumber: '+911111111111',
    role: 'nurse',
    isPhoneVerified: true,
    name: 'Nurse Alice',
    location: { type: 'Point', coordinates: [77.5946, 12.9716] }, // Bangalore City Center
    addresses: [],
    cart: []
  },
  {
    userId: 'NURSE_2',
    phoneNumber: '+922222222222',
    role: 'nurse',
    isPhoneVerified: true,
    name: 'Nurse Bob',
    location: { type: 'Point', coordinates: [77.6846, 12.9816] }, // Whitefield, Bangalore (5km away)
    addresses: [],
    cart: []
  },
  {
    userId: 'NURSE_3',
    phoneNumber: '+933333333333',
    role: 'nurse',
    isPhoneVerified: true,
    name: 'Nurse Carol',
    location: { type: 'Point', coordinates: [77.5046, 12.9616] }, // Electronic City, Bangalore (3km away)
    addresses: [],
    cart: []
  },
  {
    userId: 'NURSE_4',
    phoneNumber: '+944444444444',
    role: 'nurse',
    isPhoneVerified: true,
    name: 'Nurse Dave',
    location: { type: 'Point', coordinates: [77.5746, 12.9516] }, // Koramangala, Bangalore (2km away) - CLOSEST
    addresses: [],
    cart: []
  }
];

async function updateUserAddress() {
  await mongoose.connect(config.mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
  // Update user's address coordinates to actual Bangalore coordinates
  // Doddanakundi Industrial Area coordinates
  const bangaloreCoordinates = [77.6846, 12.9816]; // Near Doddanakundi
  
  await UserModel.updateMany(
    { 
      'addresses.address': { $regex: 'Doddanakundi', $options: 'i' } 
    },
    { 
      $set: { 
        'addresses.$.latitude': bangaloreCoordinates[1],
        'addresses.$.longitude': bangaloreCoordinates[0]
      } 
    }
  );
  
  console.log('Updated user address coordinates to Bangalore');
}

async function insertNurses() {
  for (const nurse of nurses) {
    await UserModel.findOneAndUpdate(
      { userId: nurse.userId },
      nurse,
      { upsert: true, new: true }
    );
    console.log(`Inserted/Updated: ${nurse.name}`);
  }
  console.log('Done!');
}

async function main() {
  await mongoose.connect(config.mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
  // Update user address coordinates
  await updateUserAddress();
  
  // Insert nurses
  await insertNurses();
  
  await mongoose.disconnect();
}

// Run the main function
main().catch(console.error);

// debugOTP(); 