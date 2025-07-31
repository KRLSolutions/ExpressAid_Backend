const mongoDBService = require('./models/MongoDBService');
const User = require('./models/User');

async function testUserLookup() {
  console.log('🧪 Testing User Lookup in MongoDB');
  console.log('================================\n');
  
  try {
    // Connect to MongoDB
    await mongoDBService.connect();
    console.log('✅ MongoDB connected');
    
    // Test phone number
    const testPhoneNumber = '+919346048610';
    console.log(`🔍 Looking for user with phone: ${testPhoneNumber}`);
    
    // Find user
    const user = await User.findOne({ phoneNumber: testPhoneNumber });
    
    if (user) {
      console.log('✅ User found in database:');
      console.log('   User ID:', user.userId);
      console.log('   Name:', user.name || 'Not set');
      console.log('   Age:', user.age || 'Not set');
      console.log('   Sex:', user.sex || 'Not set');
      console.log('   Has Profile:', !!(user.name && user.sex && user.age));
      console.log('   Phone Verified:', user.isPhoneVerified);
    } else {
      console.log('❌ User not found in database');
      console.log('   This means the user will be redirected to profile creation');
    }
    
    // Check MongoDB connection status
    const status = mongoDBService.getConnectionStatus();
    console.log('\n📊 MongoDB Status:');
    console.log('   Connected:', status.isConnected);
    console.log('   Ready State:', status.readyState);
    console.log('   Host:', status.host);
    console.log('   Database:', status.name);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoDBService.disconnect();
  }
}

testUserLookup(); 