const mongoose = require('mongoose');
const Order = require('./models/Order');
const Nurse = require('./models/Nurse');
const config = require('./config');

async function testNurseMatching() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find the latest order with status 'nurse_notified'
    const order = await Order.findOne({ status: 'nurse_notified' }).sort({ createdAt: -1 });
    if (!order) {
      console.log('❌ No orders with status "nurse_notified" found');
      return;
    }

    console.log(`📋 Found order: ${order._id}`);
    console.log(`📍 Order status: ${order.status}`);
    console.log(`👥 Notified nurses: ${order.notifiedNurses.length}`);

    // List all notified nurses
    order.notifiedNurses.forEach((nurse, index) => {
      console.log(`  ${index + 1}. Nurse ID: ${nurse.nurseId} (${typeof nurse.nurseId})`);
      console.log(`     Name: ${nurse.name}`);
      console.log(`     Phone: ${nurse.phoneNumber}`);
      console.log(`     Distance: ${nurse.distance}km`);
      console.log(`     Status: ${nurse.status}`);
    });

    // Find all nurses in the database
    const allNurses = await Nurse.find({});
    console.log(`\n🏥 Total nurses in database: ${allNurses.length}`);
    
    allNurses.forEach((nurse, index) => {
      console.log(`  ${index + 1}. Nurse ID: ${nurse._id} (${typeof nurse._id})`);
      console.log(`     Name: ${nurse.name}`);
      console.log(`     Phone: ${nurse.phoneNumber}`);
      console.log(`     Available: ${nurse.availability}`);
    });

    // Test the query that the nurse app uses
    console.log('\n🔍 Testing nurse app query...');
    const testNurseId = order.notifiedNurses[0]?.nurseId;
    if (testNurseId) {
      console.log(`Testing with nurse ID: ${testNurseId} (${typeof testNurseId})`);
      
      const query = {
        status: 'nurse_notified',
        'notifiedNurses.nurseId': testNurseId
      };
      
      const matchingOrders = await Order.find(query);
      console.log(`✅ Found ${matchingOrders.length} orders for this nurse`);
      
      if (matchingOrders.length > 0) {
        console.log('🎉 Nurse matching is working correctly!');
      } else {
        console.log('❌ Nurse matching is not working');
      }
    }

    console.log('\n✅ Test completed');

  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testNurseMatching(); 