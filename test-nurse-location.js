const mongoose = require('mongoose');
const Nurse = require('./models/Nurse');
const config = require('./config');

async function testNurseLocation() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Test coordinates (order location)
    const orderLocation = {
      latitude: 12.9816,
      longitude: 77.6846
    };

    console.log(`📍 Order location: ${orderLocation.latitude}, ${orderLocation.longitude}`);

    // Find all nurses
    const allNurses = await Nurse.find({});
    console.log(`🏥 Total nurses: ${allNurses.length}`);

    allNurses.forEach((nurse, index) => {
      console.log(`\n${index + 1}. ${nurse.name} (${nurse.phoneNumber})`);
      console.log(`   ID: ${nurse._id}`);
      console.log(`   Available: ${nurse.availability}`);
      console.log(`   Approved: ${nurse.isApproved}`);
      console.log(`   Active: ${nurse.isActive}`);
      
      if (nurse.location && nurse.location.coordinates) {
        const [lon, lat] = nurse.location.coordinates;
        console.log(`   Location: ${lat}, ${lon}`);
        
        // Calculate distance
        const distance = calculateDistance(
          orderLocation.latitude, orderLocation.longitude,
          lat, lon
        );
        console.log(`   Distance: ${distance.toFixed(2)}km`);
        
        // Check if within 50km
        if (distance <= 50) {
          console.log(`   ✅ Within range (50km)`);
        } else {
          console.log(`   ❌ Too far (50km limit)`);
        }
      } else {
        console.log(`   ❌ No location set`);
      }
    });

    // Test the geospatial query
    console.log('\n🔍 Testing geospatial query...');
    const nearbyNurses = await Nurse.find({
      availability: 'available',
      isApproved: true,
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [orderLocation.longitude, orderLocation.latitude],
          },
          $maxDistance: 50000, // 50km radius
        },
      },
    }).limit(10);

    console.log(`✅ Found ${nearbyNurses.length} nearby nurses:`);
    nearbyNurses.forEach((nurse, index) => {
      console.log(`  ${index + 1}. ${nurse.name} (${nurse.phoneNumber})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
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

testNurseLocation(); 