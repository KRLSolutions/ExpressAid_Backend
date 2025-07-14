require('dotenv').config();
const mongoose = require('mongoose');

console.log('🗄️ Testing MongoDB Atlas Connection...');
console.log('=====================================');

// Check if MONGODB_URI is set
if (!process.env.MONGODB_URI) {
  console.log('❌ MONGODB_URI not found in environment variables');
  console.log('📝 Please add your MongoDB Atlas connection string to .env file');
  process.exit(1);
}

console.log('✅ MONGODB_URI found in environment');

// Test connection
async function testConnection() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    console.log('⏳ This may take a few seconds...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log(`📍 Host: ${mongoose.connection.host}`);
    console.log(`🗃️  Database: ${mongoose.connection.name}`);
    console.log(`🔗 Ready State: ${mongoose.connection.readyState}`);

    // Test creating a collection
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    console.log('✅ Database write test successful');

    // Clean up test data
    await testCollection.deleteOne({ test: 'connection' });
    console.log('✅ Database cleanup successful');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
    console.log('');
    console.log('🎉 MongoDB Atlas connection test passed!');
    console.log('Your database is ready for production use.');

  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    console.error('Error Code:', error.code);
    console.error('Error Name:', error.name);
    
    if (error.message.includes('authentication failed')) {
      console.log('');
      console.log('🔐 Authentication Error - Possible solutions:');
      console.log('1. Check your username and password in the connection string');
      console.log('2. Make sure the database user has read/write permissions');
      console.log('3. Try URL encoding special characters in password (@ = %40)');
      console.log('4. Verify the connection string format');
    }
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
      console.log('');
      console.log('🌐 Network Error - Possible solutions:');
      console.log('1. Check your internet connection');
      console.log('2. Verify the cluster is running in MongoDB Atlas');
      console.log('3. Check if your IP is whitelisted in Network Access');
      console.log('4. Go to MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere');
    }
    
    if (error.message.includes('MongoServerSelectionError')) {
      console.log('');
      console.log('🔍 Server Selection Error - Possible solutions:');
      console.log('1. Check if your cluster is active in MongoDB Atlas');
      console.log('2. Verify the cluster name in your connection string');
      console.log('3. Make sure you have network access configured');
    }
    
    console.log('');
    console.log('📋 Your current connection string (password hidden):');
    const uri = process.env.MONGODB_URI;
    const maskedUri = uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.log(maskedUri);
    
    process.exit(1);
  }
}

testConnection(); 