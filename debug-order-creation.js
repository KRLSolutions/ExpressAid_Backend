const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const Nurse = require('./models/Nurse');
const config = require('./config');

async function debugOrderCreation() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find a test user
    const UserModel = User.model;
    const testUser = await UserModel.findOne({});
    if (!testUser) {
      console.log('❌ No users found in database');
      return;
    }
    console.log(`👤 Using test user: ${testUser.name || testUser.phoneNumber}`);
    console.log(`📋 User object:`, {
      _id: testUser._id,
      userId: testUser.userId,
      phoneNumber: testUser.phoneNumber
    });

    // Test order data - use ObjectId for user field
    const testOrder = {
      user: testUser._id, // Use MongoDB ObjectId, not userId string
      items: [
        {
          productId: '1',
          name: 'Test Product',
          price: 100,
          quantity: 1
        }
      ],
      address: {
        address: 'Test Address',
        latitude: 12.9816,
        longitude: 77.6846
      },
      total: 100,
      paymentMethod: 'Cash',
      status: 'searching',
      notifiedNurses: [],
      nurseAcceptanceTimeout: null,
    };

    console.log('📦 Creating test order with data:', testOrder);

    // Create order
    const order = new Order(testOrder);
    await order.save();
    console.log('✅ Order created successfully:', order._id);

    // Clean up
    await Order.findByIdAndDelete(order._id);
    console.log('🧹 Test order cleaned up');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

debugOrderCreation(); 