const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const config = require('./config');

async function createTestOrder() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find any available user
    const testUser = await User.findOne({});
    if (!testUser) {
      console.log('❌ No users found in database');
      return;
    }
    console.log(`👤 Using user: ${testUser.name || testUser.phoneNumber}`);
    console.log(`📱 Phone: ${testUser.phoneNumber}`);

    // Check if user already has an active order
    const existingOrder = await Order.findOne({
      user: testUser._id,
      status: { $in: ['searching', 'nurse_notified', 'nurse_assigned', 'in_progress'] }
    });

    if (existingOrder) {
      console.log('⚠️ User already has an active order:', existingOrder._id);
      console.log('Order status:', existingOrder.status);
      return;
    }

    // Test order data
    const testOrder = {
      user: testUser._id,
      items: [
        {
          productId: '1',
          name: 'Home Nursing Care',
          quantity: 1,
          price: 999,
          image: '🏥'
        }
      ],
      address: {
        name: 'Test Address',
        latitude: 12.9716,
        longitude: 77.5946,
        address: 'Koramangala, Bangalore, Karnataka, India'
      },
      total: 999,
      paymentMethod: 'cash',
      status: 'searching'
    };

    console.log('📦 Creating test order...');
    console.log('Order data:', JSON.stringify(testOrder, null, 2));

    // Create the order
    const order = new Order(testOrder);
    await order.save();
    console.log('✅ Order created successfully!');
    console.log('Order ID:', order._id);
    console.log('Order status:', order.status);

    console.log('\n🎯 Next steps:');
    console.log('1. Go to the app and check if the order appears');
    console.log('2. The order should show in the Orders tab');
    console.log('3. You can test the complete flow from searching to completion');

  } catch (error) {
    console.error('❌ Error creating test order:', error);
    console.error('Error stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createTestOrder(); 