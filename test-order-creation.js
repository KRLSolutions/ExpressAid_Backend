const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const Nurse = require('./models/Nurse');
const config = require('./config');

async function testOrderCreation() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find a test user
    const testUser = await User.findOne({});
    if (!testUser) {
      console.log('❌ No users found in database');
      return;
    }
    console.log(`👤 Using test user: ${testUser.name || testUser.phoneNumber}`);

    // Test order data
    const testOrder = {
      user: testUser._id,
      items: [
        {
          productId: '4',
          name: 'Elderly Care',
          quantity: 1,
          price: 799,
          image: '👴'
        }
      ],
      address: {
        latitude: 12.9816,
        longitude: 77.6846,
        address: 'Test Address'
      },
      total: 799,
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

    // Test finding nearby nurses
    console.log('🔍 Finding nearby nurses...');
    const nearbyNurses = await Nurse.find({
      availability: 'available',
      isApproved: true,
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [testOrder.address.longitude, testOrder.address.latitude],
          },
          $maxDistance: 50000, // 50km radius
        },
      },
    }).limit(10);

    console.log(`Found ${nearbyNurses.length} nearby nurses`);

    if (nearbyNurses.length > 0) {
      // Update order with notified nurses
      order.notifiedNurses = nearbyNurses.map((nurse) => {
        const distance = calculateDistance(
          testOrder.address.latitude, testOrder.address.longitude,
          nurse.location.coordinates[1], nurse.location.coordinates[0]
        );
        return {
          nurseId: nurse._id,
          name: nurse.name,
          phoneNumber: nurse.phoneNumber,
          distance: distance,
          notifiedAt: new Date(),
          status: 'pending',
        };
      });
      order.status = 'nurse_notified';
      order.nurseAcceptanceTimeout = new Date(Date.now() + 30 * 1000);
      await order.save();
      console.log('✅ Order updated with notified nurses');
    } else {
      order.status = 'no_nurses_available';
      await order.save();
      console.log('⚠️ No nurses available');
    }

    // Clean up - delete the test order
    await Order.findByIdAndDelete(order._id);
    console.log('🧹 Test order cleaned up');

  } catch (error) {
    console.error('❌ Error testing order creation:', error);
    console.error('Error stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Helper function to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

testOrderCreation(); 