require('dotenv').config();
const mongoose = require('mongoose');
const mongoDBService = require('./models/MongoDBService');
const User = require('./models/User');
const Order = require('./models/Order');
const Nurse = require('./models/Nurse');

async function testRealUserData() {
  console.log('🔍 Testing Real User Data');
  console.log('==========================\n');

  try {
    // Step 1: Initialize MongoDB Service
    console.log('1. Initializing MongoDB Service...');
    await mongoDBService.connect();
    console.log('   ✅ MongoDB Service initialized');
    console.log('   Connection status:', mongoDBService.getConnectionStatus());

    // Step 2: Test finding the real user
    console.log('\n2. Testing Real User Lookup...');
    const realUser = await User.findOne({ userId: "USER_1752524213749_9zsxkqj65" });
    
    if (realUser) {
      console.log('   ✅ Real user found successfully');
      console.log('   User ID:', realUser.userId);
      console.log('   Phone:', realUser.phoneNumber);
      console.log('   Name:', realUser.name);
      console.log('   Age:', realUser.age);
      console.log('   Sex:', realUser.sex);
      console.log('   Role:', realUser.role);
      console.log('   Phone Verified:', realUser.isPhoneVerified);
      console.log('   Addresses Count:', realUser.addresses ? realUser.addresses.length : 0);
      console.log('   Cart Items Count:', realUser.cart ? realUser.cart.length : 0);
      console.log('   Created At:', realUser.createdAt);
      console.log('   Updated At:', realUser.updatedAt);
    } else {
      console.log('   ❌ Real user not found');
    }

    // Step 3: Test finding user by phone number
    console.log('\n3. Testing User Lookup by Phone...');
    const userByPhone = await User.findOne({ phoneNumber: "+919346048610" });
    
    if (userByPhone) {
      console.log('   ✅ User found by phone number');
      console.log('   User ID:', userByPhone.userId);
      console.log('   Name:', userByPhone.name);
    } else {
      console.log('   ❌ User not found by phone number');
    }

    // Step 4: Test database counts
    console.log('\n4. Testing Database Counts...');
    
    // Count all users
    const userCount = await User.model.countDocuments();
    console.log('   Total users in database:', userCount);

    // Count all orders
    const orderCount = await Order.countDocuments();
    console.log('   Total orders in database:', orderCount);

    // Count all nurses
    const nurseCount = await Nurse.countDocuments();
    console.log('   Total nurses in database:', nurseCount);

    // Step 5: Test user addresses
    if (realUser && realUser.addresses) {
      console.log('\n5. Testing User Addresses...');
      console.log(`   User has ${realUser.addresses.length} addresses:`);
      realUser.addresses.forEach((address, index) => {
        console.log(`   Address ${index + 1}:`);
        console.log(`     Type: ${address.type}`);
        console.log(`     Name: ${address.name}`);
        console.log(`     Address: ${address.address}`);
        console.log(`     City: ${address.city}`);
        console.log(`     Pincode: ${address.pincode}`);
        console.log(`     Default: ${address.isDefault}`);
      });
    }

    // Step 6: Test user health profile
    if (realUser && realUser.healthProfile) {
      console.log('\n6. Testing User Health Profile...');
      console.log('   Current Steps:', realUser.healthProfile.currentSteps);
      console.log('   Sleep Hours:', realUser.healthProfile.sleepHours);
      console.log('   Water Intake:', realUser.healthProfile.waterIntake);
      console.log('   Conditions:', realUser.healthProfile.conditions ? realUser.healthProfile.conditions.length : 0);
      console.log('   Medications:', realUser.healthProfile.medications ? realUser.healthProfile.medications.length : 0);
      console.log('   Allergies:', realUser.healthProfile.allergies ? realUser.healthProfile.allergies.length : 0);
    }

    // Step 7: Test user cart
    if (realUser && realUser.cart) {
      console.log('\n7. Testing User Cart...');
      console.log(`   Cart has ${realUser.cart.length} items`);
      if (realUser.cart.length > 0) {
        realUser.cart.forEach((item, index) => {
          console.log(`   Item ${index + 1}:`);
          console.log(`     Product ID: ${item.productId}`);
          console.log(`     Name: ${item.name}`);
          console.log(`     Quantity: ${item.quantity}`);
          console.log(`     Price: ${item.price}`);
        });
      }
    }

    console.log('\n🎉 Real user data test completed successfully!');
    console.log('Database is working correctly with real data.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error details:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoDBService.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testRealUserData(); 