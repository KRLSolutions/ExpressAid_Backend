const jwt = require('jsonwebtoken');
const config = require('./config');
const fetch = require('node-fetch');

async function testSpecificUser() {
  console.log('🧪 Testing with specific user from MongoDB...\n');
  
  try {
    // Use the exact user data from MongoDB
    const userData = {
      userId: "USER_1752524213749_9zsxkqj65",
      phoneNumber: "+919346048610",
      role: "customer"
    };
    
    console.log('1. User data:', userData);
    
    // Generate token for this specific user
    const token = jwt.sign(
      userData,
      config.jwtSecret,
      { expiresIn: '7d' }
    );
    console.log('2. Token generated successfully');
    console.log('   Token preview:', token.substring(0, 50) + '...');
    
    // Test cart data
    const testCart = [
      {
        productId: 'nursing_care',
        name: 'Nursing Care',
        price: 500,
        quantity: 1,
        image: '🩺'
      },
      {
        productId: 'medication_management',
        name: 'Medication Management',
        price: 300,
        quantity: 2,
        image: '💊'
      }
    ];
    
    console.log('3. Testing cart update with data:', testCart);
    
    const response = await fetch('http://expressaid.centralus.cloudapp.azure.com:5000/api/users/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ cart: testCart })
    });
    
    console.log('4. Response status:', response.status);
    console.log('5. Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseData = await response.json();
    console.log('6. Response data:', responseData);
    
    if (response.ok) {
      console.log('✅ Cart update successful!');
      
      // Test getting the cart
      console.log('\n7. Testing cart retrieval...');
      const getResponse = await fetch('http://expressaid.centralus.cloudapp.azure.com:5000/api/users/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('8. Get response status:', getResponse.status);
      const getData = await getResponse.json();
      console.log('9. Retrieved cart:', getData);
      
    } else {
      console.log('❌ Cart update failed');
      console.log('   Error details:', responseData);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
testSpecificUser(); 