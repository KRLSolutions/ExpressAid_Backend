const mongoose = require('mongoose');
const Nurse = require('./models/Nurse');
const config = require('./config');

async function testNurseAuthentication() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find Nurse Bob
    const nurseBob = await Nurse.findOne({ name: 'Nurse Bob' });
    if (!nurseBob) {
      console.log('❌ Nurse Bob not found');
      return;
    }

    console.log('👤 Nurse Bob found:');
    console.log('  - ID:', nurseBob._id);
    console.log('  - Phone:', nurseBob.phoneNumber);
    console.log('  - Location:', nurseBob.location);
    console.log('  - Is Approved:', nurseBob.isApproved);
    console.log('  - Is Active:', nurseBob.isActive);

    // Test the available orders endpoint
    console.log('\n🔍 Testing available orders endpoint...');
    
    // Simulate a request to /api/orders/available for Nurse Bob
    const Order = require('./models/Order');
    
    const availableOrders = await Order.find({
      status: 'nurse_notified',
      'notifiedNurses.nurseId': nurseBob._id
    }).populate('user', 'name phoneNumber');

    console.log('📋 Available orders for Nurse Bob:', availableOrders.length);
    
    if (availableOrders.length > 0) {
      availableOrders.forEach((order, index) => {
        console.log(`\n📦 Order ${index + 1}:`);
        console.log('  - Order ID:', order._id);
        console.log('  - Customer:', order.user?.name || 'Unknown');
        console.log('  - Phone:', order.user?.phoneNumber || 'Unknown');
        console.log('  - Total:', order.total);
        console.log('  - Status:', order.status);
        console.log('  - Address:', order.address?.address);
      });
    } else {
      console.log('❌ No available orders found for Nurse Bob');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testNurseAuthentication(); 