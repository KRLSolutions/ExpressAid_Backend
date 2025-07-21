const jwt = require('jsonwebtoken');
const config = require('./config');
const User = require('./models/User');

async function testAuthFlow() {
  console.log('🔍 Testing Authentication Flow...\n');
  
  try {
    // Test 1: Check if JWT secret is configured
    console.log('1. Checking JWT Secret:');
    console.log('   JWT Secret exists:', !!config.jwtSecret);
    console.log('   JWT Secret length:', config.jwtSecret ? config.jwtSecret.length : 0);
    
    // Test 2: Find a test user
    console.log('\n2. Looking for test users:');
    const users = await User.model.find({}).limit(5);
    console.log(`   Found ${users.length} users in database`);
    
    if (users.length > 0) {
      const testUser = users[0];
      console.log('   Test user:', {
        userId: testUser.userId,
        phoneNumber: testUser.phoneNumber,
        role: testUser.role,
        isPhoneVerified: testUser.isPhoneVerified
      });
      
      // Test 3: Generate a token for the test user
      console.log('\n3. Generating test token:');
      const token = jwt.sign(
        { 
          userId: testUser.userId, 
          phoneNumber: testUser.phoneNumber, 
          role: testUser.role 
        },
        config.jwtSecret,
        { expiresIn: '7d' }
      );
      console.log('   Token generated successfully');
      console.log('   Token length:', token.length);
      
      // Test 4: Verify the token
      console.log('\n4. Verifying token:');
      const decoded = jwt.verify(token, config.jwtSecret);
      console.log('   Token decoded successfully:', {
        userId: decoded.userId,
        phoneNumber: decoded.phoneNumber,
        role: decoded.role,
        exp: new Date(decoded.exp * 1000).toISOString()
      });
      
      // Test 5: Look up user with decoded userId
      console.log('\n5. Looking up user with decoded userId:');
      const foundUser = await User.findOne({ userId: decoded.userId });
      if (foundUser) {
        console.log('   User found successfully');
        console.log('   User details:', {
          userId: foundUser.userId,
          phoneNumber: foundUser.phoneNumber,
          role: foundUser.role,
          _id: foundUser._id
        });
      } else {
        console.log('   ❌ User not found with decoded userId');
      }
      
      // Test 6: Test the active orders endpoint
      console.log('\n6. Testing active orders endpoint:');
      const fetch = require('node-fetch');
      const response = await fetch('http://expressaid.centralus.cloudapp.azure.com:5000/api/orders/active', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('   Response status:', response.status);
      const responseData = await response.json();
      console.log('   Response data:', responseData);
      
    } else {
      console.log('   ❌ No users found in database');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
testAuthFlow(); 