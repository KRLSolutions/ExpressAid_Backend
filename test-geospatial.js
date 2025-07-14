const mongoose = require('mongoose');
const Nurse = require('./models/Nurse');
const config = require('./config');

async function testGeospatialQuery() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Test coordinates (Bangalore area)
    const testCoordinates = {
      latitude: 12.9816,
      longitude: 77.6846
    };

    console.log(`📍 Testing geospatial query around: ${testCoordinates.latitude}, ${testCoordinates.longitude}`);

    // Check if nurses exist
    const totalNurses = await Nurse.countDocuments();
    console.log(`📊 Total nurses in database: ${totalNurses}`);

    // List all nurses
    const allNurses = await Nurse.find({});
    console.log('👥 All nurses:');
    allNurses.forEach(nurse => {
      console.log(`  - ${nurse.name}: ${nurse.location.coordinates[1]}, ${nurse.location.coordinates[0]} (${nurse.availability})`);
    });

    // Test the geospatial query
    const nearbyNurses = await Nurse.find({
      availability: 'available',
      isApproved: true,
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [testCoordinates.longitude, testCoordinates.latitude],
          },
          $maxDistance: 50000, // 50km radius
        },
      },
    }).limit(10);

    console.log(`🔍 Found ${nearbyNurses.length} nearby nurses:`);
    nearbyNurses.forEach(nurse => {
      const distance = calculateDistance(
        testCoordinates.latitude, testCoordinates.longitude,
        nurse.location.coordinates[1], nurse.location.coordinates[0]
      );
      console.log(`  - ${nurse.name}: ${distance.toFixed(2)}km away`);
    });

    // Check if geospatial index exists
    const indexes = await Nurse.collection.getIndexes();
    console.log('📋 Database indexes:');
    Object.keys(indexes).forEach(indexName => {
      console.log(`  - ${indexName}:`, indexes[indexName]);
    });

  } catch (error) {
    console.error('❌ Error testing geospatial query:', error);
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

testGeospatialQuery(); 