const jwt = require('jsonwebtoken');
const config = require('./config');
const User = require('./models/User');

async function testCart() {
  console.log('🛒 Testing Cart Functionality...\n');
  
  try {
    // Test 1: Check if there are any users in the database
    console.log('1. Checking for users in database:');
    const users = await User.model.find({}).limit(5);
    console.log(`   Found ${users.length} users in database`);
    
    if (users.length === 0) {
      console.log('   ❌ No users found. Creating a test user...');
      
      // Create a test user
      const testUser = new User({
        userId: 'TEST_USER_' + Date.now(),
        phoneNumber: '+919876543210',
        role: 'customer',
        isPhoneVerified: true,
        cart: []
      });
      
      await testUser.save();
      console.log('   ✅ Test user created successfully');
      console.log('   User ID:', testUser.userId);
      console.log('   User _id:', testUser._id);
    } else {
      const testUser = users[0];
      console.log('   ✅ Using existing user:', testUser.userId);
      console.log('   User _id:', testUser._id);
    }
    
    // Test 2: Generate a token for the test user
    console.log('\n2. Generating test token:');
    const testUser = users.length > 0 ? users[0] : await User.findOne({ phoneNumber: '+919876543210' });
    
    if (!testUser) {
      console.log('   ❌ No test user available');
      return;
    }
    
    const token = jwt.sign(
      { 
        userId: testUser.userId, 
        phoneNumber: testUser.phoneNumber, 
        role: testUser.role 
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    );
    console.log('   ✅ Token generated successfully');
    
    // Test 3: Test the cart endpoint
    console.log('\n3. Testing cart endpoint:');
    const fetch = require('node-fetch');
    
    // Test cart data
    const testCart = [
      {
        productId: 'test_product_1',
        name: 'Test Product 1',
        price: 100,
        quantity: 2,
        image: '🩺'
      },
      {
        productId: 'test_product_2',
        name: 'Test Product 2',
        price: 150,
        quantity: 1,
        image: '💊'
      }
    ];
    
    console.log('   Sending cart data:', testCart);
    
    const response = await fetch('http://expressaid.centralus.cloudapp.azure.com:5000/api/users/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ cart: testCart })
    });
    
    console.log('   Response status:', response.status);
    const responseData = await response.json();
    console.log('   Response data:', responseData);
    
    if (response.ok) {
      console.log('   ✅ Cart updated successfully!');
      
      // Test 4: Get the cart to verify it was saved
      console.log('\n4. Verifying cart was saved:');
      const getResponse = await fetch('http://expressaid.centralus.cloudapp.azure.com:5000/api/users/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('   Get response status:', getResponse.status);
      const getData = await getResponse.json();
      console.log('   Retrieved cart:', getData);
      
    } else {
      console.log('   ❌ Cart update failed');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
testCart(); 