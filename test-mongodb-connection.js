const mongoose = require('mongoose');
const config = require('./config');
const User = require('./models/User');

async function testMongoDBConnection() {
  console.log('🔌 Testing MongoDB Connection...\n');
  
  try {
    // Test 1: Check if MongoDB is available
    console.log('1. Checking MongoDB availability...');
    const isAvailable = require('./models/MongoDBService').isConnected();
    console.log('   MongoDB available:', isAvailable);
    
    // Test 2: Try to connect directly
    console.log('\n2. Testing direct connection...');
    try {
      await mongoose.connect(config.mongodb.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      console.log('   ✅ Direct connection successful');
      console.log('   Host:', mongoose.connection.host);
      console.log('   Database:', mongoose.connection.name);
      
      // Test 3: Find the specific user
      console.log('\n3. Looking for specific user...');
      const user = await User.model.findOne({ userId: "USER_1752524213749_9zsxkqj65" });
      
      if (user) {
        console.log('   ✅ User found in MongoDB');
        console.log('   User ID:', user.userId);
        console.log('   Phone:', user.phoneNumber);
        console.log('   Cart items:', user.cart ? user.cart.length : 0);
      } else {
        console.log('   ❌ User not found in MongoDB');
        
        // List all users
        console.log('\n4. Listing all users in database...');
        const allUsers = await User.model.find({}).limit(5);
        console.log(`   Found ${allUsers.length} users:`);
        allUsers.forEach((u, i) => {
          console.log(`   ${i + 1}. ${u.userId} - ${u.phoneNumber}`);
        });
      }
      
      // Test 4: Test the User.findOne method
      console.log('\n5. Testing User.findOne method...');
      const foundUser = await User.findOne({ userId: "USER_1752524213749_9zsxkqj65" });
      
      if (foundUser) {
        console.log('   ✅ User.findOne successful');
        console.log('   User ID:', foundUser.userId);
        console.log('   Phone:', foundUser.phoneNumber);
      } else {
        console.log('   ❌ User.findOne failed');
      }
      
    } catch (error) {
      console.log('   ❌ Direct connection failed:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    // Close connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\n🔌 Connection closed');
    }
  }
}

// Run the test
testMongoDBConnection(); 