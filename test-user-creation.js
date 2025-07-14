const mongoose = require('mongoose');
const User = require('./models/User');
const config = require('./config');

async function testUserCreation() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if MongoDB is available
    const isMongoAvailable = mongoose.connection.readyState === 1;
    console.log('📊 MongoDB connection state:', mongoose.connection.readyState);
    console.log('🔗 MongoDB available:', isMongoAvailable);

    // Count existing users using the model
    const UserModel = User.model;
    const userCount = await UserModel.countDocuments();
    console.log(`👥 Total users in database: ${userCount}`);

    // List all users
    const allUsers = await UserModel.find({});
    console.log('👤 All users:');
    allUsers.forEach(user => {
      console.log(`  - ${user.phoneNumber}: ${user.name || 'No name'} (${user.userId})`);
    });

    // Create a test user
    console.log('➕ Creating test user...');
    const testUser = new User({
      phoneNumber: '+919999999999',
      name: 'Test User',
      isPhoneVerified: true,
      role: 'customer'
    });

    await testUser.save();
    console.log('✅ Test user created successfully!');
    console.log('User ID:', testUser._id);
    console.log('User userId:', testUser.userId);

    // Verify the user was saved
    const savedUser = await UserModel.findOne({ phoneNumber: '+919999999999' });
    if (savedUser) {
      console.log('✅ User found in database after save');
    } else {
      console.log('❌ User not found in database after save');
    }

    // Clean up - delete the test user
    await UserModel.findOneAndDelete({ phoneNumber: '+919999999999' });
    console.log('🧹 Test user cleaned up');

  } catch (error) {
    console.error('❌ Error testing user creation:', error);
    console.error('Error stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testUserCreation(); 