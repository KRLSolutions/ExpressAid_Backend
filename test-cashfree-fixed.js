const fetch = require('node-fetch');

async function testCashfreeFixed() {
  console.log('💳 Testing Cashfree Integration (Fixed)...\n');
  
  try {
    // Test data
    const testOrderData = {
      orderAmount: 500,
      customerId: 'USER_1752524213749_9zsxkqj65',
      customerPhone: '+919346048610',
      customerEmail: 'test@expressaid.com',
      returnUrl: 'https://expressaid.com/payment-success',
      paymentMethod: 'UPI'
    };
    
    console.log('1. Test order data:', testOrderData);
    
    // Test Cashfree order creation
    console.log('\n2. Testing Cashfree order creation...');
    const response = await fetch('http://expressaid.centralus.cloudapp.azure.com:5000/api/cashfree/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrderData)
    });
    
    console.log('3. Response status:', response.status);
    
    const responseData = await response.json();
    console.log('4. Response data:', responseData);
    
    if (response.ok) {
      console.log('✅ Cashfree order created successfully!');
      console.log('   Order ID:', responseData.data?.order_id);
      console.log('   Session ID:', responseData.data?.payment_session_id);
      console.log('   Is Mock:', responseData.data?.is_mock);
      
      if (responseData.data?.is_mock) {
        console.log('   📝 Note: Using mock payment due to authentication issues');
        console.log('   💡 To fix: Update Cashfree credentials in config.js');
      }
    } else {
      console.log('❌ Cashfree order creation failed');
      console.log('   Error:', responseData.error);
      console.log('   Details:', responseData.details);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
testCashfreeFixed(); 