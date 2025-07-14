const mongoose = require('mongoose');
const config = require('./config');

async function fixDatabase() {
  try {
    console.log('🔧 Fixing database schema issues...\n');
    
    // Connect to MongoDB
    await mongoose.connect(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Check existing indexes
    console.log('\n📋 Checking existing indexes...');
    const indexes = await usersCollection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));
    
    // Check if there's a problematic index on 'phone'
    const phoneIndex = indexes.find(idx => idx.key && idx.key.phone);
    if (phoneIndex) {
      console.log('\n❌ Found problematic index on "phone" field');
      console.log('Dropping index:', phoneIndex.name);
      await usersCollection.dropIndex(phoneIndex.name);
      console.log('✅ Dropped phone index');
    }
    
    // Check if there's a correct index on 'phoneNumber'
    const phoneNumberIndex = indexes.find(idx => idx.key && idx.key.phoneNumber);
    if (!phoneNumberIndex) {
      console.log('\n📝 Creating index on "phoneNumber" field');
      await usersCollection.createIndex({ phoneNumber: 1 }, { unique: true });
      console.log('✅ Created phoneNumber index');
    } else {
      console.log('\n✅ phoneNumber index already exists');
    }
    
    // Check sample documents to see field names
    console.log('\n📄 Checking sample documents...');
    const sampleDocs = await usersCollection.find({}).limit(3).toArray();
    if (sampleDocs.length > 0) {
      console.log('Sample document fields:', Object.keys(sampleDocs[0]));
    } else {
      console.log('No documents found in collection');
    }
    
    console.log('\n✅ Database fix completed!');
    
  } catch (error) {
    console.error('❌ Database fix failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixDatabase(); 