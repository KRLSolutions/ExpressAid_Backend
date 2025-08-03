const mongoose = require('mongoose');
const User = require('./models/User');
const config = require('./config');

async function debugUserLookup() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Connected to MongoDB');

    const phoneNumber = '+919346048610';
    
    console.log(`🔍 Testing user lookup for phone: ${phoneNumber}`);
    
    // Test 1: Direct MongoDB query
    console.log('\n📊 Test 1: Direct MongoDB query');
    const UserModel = User.model;
    const directResult = await UserModel.findOne({ phoneNumber });
    console.log('Direct MongoDB result:', directResult ? 'Found' : 'Not found');
    if (directResult) {
      console.log('User details:', {
        userId: directResult.userId,
        phoneNumber: directResult.phoneNumber,
        name: directResult.name,
        hasProfile: !!(directResult.name && directResult.sex && directResult.age)
      });
    }

    // Test 2: Using User.findOne
    console.log('\n📊 Test 2: Using User.findOne');
    const userResult = await User.findOne({ phoneNumber });
    console.log('User.findOne result:', userResult ? 'Found' : 'Not found');
    if (userResult) {
      console.log('User details:', {
        userId: userResult.userId,
        phoneNumber: userResult.phoneNumber,
        name: userResult.name,
        hasProfile: !!(userResult.name && userResult.sex && userResult.age)
      });
    }

    // Test 3: Check all users with this phone number
    console.log('\n📊 Test 3: Check all users with this phone number');
    const allUsers = await UserModel.find({ phoneNumber });
    console.log(`Total users found with phone ${phoneNumber}:`, allUsers.length);
    allUsers.forEach((user, index) => {
      console.log(`User ${index + 1}:`, {
        _id: user._id,
        userId: user.userId,
        phoneNumber: user.phoneNumber,
        name: user.name,
        createdAt: user.createdAt
      });
    });

    // Test 4: Check phone number format
    console.log('\n📊 Test 4: Check phone number format');
    const allUsersWithPhone = await UserModel.find({});
    console.log('All users in database:');
    allUsersWithPhone.forEach((user, index) => {
      console.log(`User ${index + 1}:`, {
        _id: user._id,
        userId: user.userId,
        phoneNumber: user.phoneNumber,
        phoneNumberLength: user.phoneNumber ? user.phoneNumber.length : 0,
        name: user.name
      });
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

debugUserLookup(); 