const mongoose = require('mongoose');
const User = require('./models/User');
const mongoDBService = require('./models/MongoDBService');
const config = require('./config');

async function testMongoDBConnection() {
  try {
    console.log('🔍 Testing MongoDB connection status...');
    
    // Check MongoDBService status
    console.log('\n📊 MongoDBService status:');
    console.log('isConnected():', mongoDBService.isConnected());
    console.log('getConnectionStatus():', mongoDBService.getConnectionStatus());
    
    // Connect to MongoDB directly
    console.log('\n📊 Connecting to MongoDB directly...');
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Direct MongoDB connection successful');
    console.log('Mongoose readyState:', mongoose.connection.readyState);
    
    // Test User.findOne after connection
    console.log('\n📊 Testing User.findOne after connection...');
    const phoneNumber = '+919346048610';
    const user = await User.findOne({ phoneNumber });
    console.log('User.findOne result:', user ? 'Found' : 'Not found');
    if (user) {
      console.log('User details:', {
        userId: user.userId,
        phoneNumber: user.phoneNumber,
        name: user.name
      });
    }
    
    // Test direct MongoDB query
    console.log('\n📊 Testing direct MongoDB query...');
    const UserModel = User.model;
    const directUser = await UserModel.findOne({ phoneNumber });
    console.log('Direct query result:', directUser ? 'Found' : 'Not found');
    if (directUser) {
      console.log('Direct user details:', {
        userId: directUser.userId,
        phoneNumber: directUser.phoneNumber,
        name: directUser.name
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testMongoDBConnection(); 