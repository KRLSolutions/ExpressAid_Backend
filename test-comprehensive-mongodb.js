require('dotenv').config();
const mongoose = require('mongoose');
const mongoDBService = require('./models/MongoDBService');
const User = require('./models/User');
const Order = require('./models/Order');
const Nurse = require('./models/Nurse');

async function comprehensiveTest() {
  console.log('🔍 Comprehensive MongoDB Test');
  console.log('=============================\n');

  try {
    // Step 1: Initialize MongoDB Service
    console.log('1. Initializing MongoDB Service...');
    await mongoDBService.connect();
    console.log('   ✅ MongoDB Service initialized');
    console.log('   Connection status:', mongoDBService.getConnectionStatus());

    // Step 2: Test User Model
    console.log('\n2. Testing User Model...');
    const testUser = new User({
      phoneNumber: '+919876543212',
      name: 'Test User',
      sex: 'male',
      age: 25
    });

    const savedUser = await testUser.save();
    console.log('   ✅ User created successfully');
    console.log('   User ID:', savedUser.userId);
    console.log('   Phone:', savedUser.phoneNumber);

    // Step 3: Test User.findOne
    console.log('\n3. Testing User.findOne...');
    const foundUser = await User.findOne({ phoneNumber: '+919876543212' });
    if (foundUser) {
      console.log('   ✅ User found successfully');
      console.log('   User ID:', foundUser.userId);
    } else {
      console.log('   ❌ User not found');
    }

    // Step 4: Test Order Model
    console.log('\n4. Testing Order Model...');
    const testOrder = new Order({
      user: savedUser._id,
      items: [{
        productId: 'PROD_001',
        name: 'Test Product',
        quantity: 2,
        price: 100
      }],
      total: 200,
      paymentMethod: 'cash',
      address: {
        type: 'home',
        address: '123 Test Street',
        houseNumber: '123',
        floor: '1st Floor',
        block: 'A',
        landmark: 'Near Test Landmark',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        latitude: 12.9716,
        longitude: 77.5946,
        name: 'Test Address',
        isDefault: true
      },
      status: 'searching'
    });

    const savedOrder = await testOrder.save();
    console.log('   ✅ Order created successfully');
    console.log('   Order ID:', savedOrder.orderId);

    // Step 5: Test Nurse Model
    console.log('\n5. Testing Nurse Model...');
    const testNurse = new Nurse({
      nurseId: 'NURSE_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      phoneNumber: '+919876543213',
      name: 'Test Nurse',
      specializations: ['General Nursing'],
      location: {
        type: 'Point',
        coordinates: [77.5946, 12.9716] // Bangalore coordinates
      }
    });

    const savedNurse = await testNurse.save();
    console.log('   ✅ Nurse created successfully');
    console.log('   Nurse ID:', savedNurse.nurseId);

    // Step 6: Test Database Operations
    console.log('\n6. Testing Database Operations...');
    
    // Count users
    const userCount = await User.model.countDocuments();
    console.log('   Total users in database:', userCount);

    // Count orders
    const orderCount = await Order.model.countDocuments();
    console.log('   Total orders in database:', orderCount);

    // Count nurses
    const nurseCount = await Nurse.model.countDocuments();
    console.log('   Total nurses in database:', nurseCount);

    // Step 7: Cleanup Test Data
    console.log('\n7. Cleaning up test data...');
    await User.model.deleteOne({ phoneNumber: '+919876543212' });
    await Order.model.deleteOne({ orderId: savedOrder.orderId });
    await Nurse.model.deleteOne({ phoneNumber: '+919876543213' });
    console.log('   ✅ Test data cleaned up');

    console.log('\n🎉 All tests passed! MongoDB is working correctly.');
    console.log('Database is ready for Firebase deployment.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error details:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoDBService.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

comprehensiveTest(); 