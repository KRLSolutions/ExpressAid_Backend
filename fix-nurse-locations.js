const mongoose = require('mongoose');
const Nurse = require('./models/Nurse');
const config = require('./config');

async function fixNurseLocations() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Bangalore area coordinates
    const bangaloreLocations = [
      { name: 'Nurse Alice', lat: 12.9716, lon: 77.5946 }, // MG Road area
      { name: 'Nurse Bob', lat: 12.9346, lon: 77.6246 },   // Whitefield area
      { name: 'Nurse Carol', lat: 12.9816, lon: 77.6846 }, // Electronic City area
      { name: 'Nurse Dave', lat: 12.9789, lon: 77.5917 },  // Koramangala area
    ];

    console.log('📍 Updating nurse locations to Bangalore area...');

    for (const location of bangaloreLocations) {
      const nurse = await Nurse.findOne({ name: location.name });
      if (nurse) {
        nurse.location = {
          type: 'Point',
          coordinates: [location.lon, location.lat]
        };
        nurse.currentAddress = `${location.name} Area, Bangalore`;
        await nurse.save();
        console.log(`✅ Updated ${location.name}: ${location.lat}, ${location.lon}`);
      } else {
        console.log(`❌ Nurse ${location.name} not found`);
      }
    }

    console.log('\n🔍 Verifying updated locations...');
    const allNurses = await Nurse.find({});
    allNurses.forEach((nurse) => {
      if (nurse.location && nurse.location.coordinates) {
        const [lon, lat] = nurse.location.coordinates;
        console.log(`${nurse.name}: ${lat}, ${lon}`);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

fixNurseLocations(); 