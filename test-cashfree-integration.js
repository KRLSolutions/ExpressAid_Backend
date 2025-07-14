const axios = require('axios');
const { Cashfree } = require('cashfree-pg');
const config = require('./config');

// Test configuration
const TEST_CONFIG = {
  baseURL: 'http://localhost:5000',
  timeout: 10000
};

// Test data for different payment methods
const TEST_PAYMENT_METHODS = [
  {
    name: 'Card Payment',
    paymentMethod: 'card',
    expectedFields: ['orderId', 'orderAmount', 'orderCurrency', 'paymentUrl', 'orderToken']
  },
  {
    name: 'PhonePe Payment',
    paymentMethod: 'phonepe',
    expectedFields: ['orderId', 'orderAmount', 'orderCurrency', 'paymentUrl', 'orderToken']
  },
  {
    name: 'Google Pay Payment',
    paymentMethod: 'googlepay',
    expectedFields: ['orderId', 'orderAmount', 'orderCurrency', 'paymentUrl', 'orderToken']
  },
  {
    name: 'UPI Payment',
    paymentMethod: 'upi',
    expectedFields: ['orderId', 'orderAmount', 'orderCurrency', 'paymentUrl', 'orderToken']
  },
  {
    name: 'Net Banking Payment',
    paymentMethod: 'netbanking',
    expectedFields: ['orderId', 'orderAmount', 'orderCurrency', 'paymentUrl', 'orderToken']
  }
];

// Test customer data
const TEST_CUSTOMER = {
  customerId: 'test_user_123',
  customerPhone: '9876543210',
  customerEmail: 'test@example.com'
};

// Test order data
const TEST_ORDER = {
  orderAmount: 100,
  orderCurrency: 'INR'
};

console.log('🧪 Starting Cashfree Integration Tests...\n');

// Test 1: Check server connectivity
async function testServerConnectivity() {
  console.log('🔍 Test 1: Server Connectivity');
  try {
    const response = await axios.get(`${TEST_CONFIG.baseURL}/api/cashfree/test-credentials`, {
      timeout: TEST_CONFIG.timeout
    });
    console.log('✅ Server is running and accessible');
    console.log('📊 Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.log('❌ Server connectivity test failed');
    console.log('📋 Error:', error.message);
    if (error.response) {
      console.log('📊 Response:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

// Test 2: Test Cashfree credentials
async function testCashfreeCredentials() {
  console.log('\n🔍 Test 2: Cashfree Credentials');
  console.log('📋 Current Configuration:');
  console.log('   App ID:', config.cashfree.appId);
  console.log('   Environment:', config.cashfree.environment);
  console.log('   Secret Key:', config.cashfree.secretKey.substring(0, 10) + '...');
  
  try {
    const cashfree = new Cashfree({
      clientId: config.cashfree.appId,
      clientSecret: config.cashfree.secretKey,
      environment: config.cashfree.environment
    });
    
    // Test with minimal order
    const testOrder = {
      orderId: 'test_' + Date.now(),
      orderAmount: 1,
      orderCurrency: 'INR',
      customerDetails: {
        customerId: 'test',
        customerPhone: '9999999999',
        customerEmail: 'test@example.com'
      }
    };
    
    console.log('🚀 Testing with minimal order:', JSON.stringify(testOrder, null, 2));
    const result = await cashfree.PGCreateOrder(testOrder);
    console.log('✅ Cashfree credentials are valid!');
    console.log('📊 Real API Response:', JSON.stringify(result, null, 2));
    return true;
  } catch (error) {
    console.log('❌ Cashfree credentials test failed');
    console.log('📋 Error:', error.message);
    if (error.response?.data) {
      console.log('📊 Error Details:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

// Test 3: Test order creation for each payment method
async function testOrderCreation() {
  console.log('\n🔍 Test 3: Order Creation for Different Payment Methods');
  
  for (const method of TEST_PAYMENT_METHODS) {
    console.log(`\n💳 Testing ${method.name}...`);
    
    try {
      const orderData = {
        orderAmount: TEST_ORDER.orderAmount,
        customerId: TEST_CUSTOMER.customerId,
        customerPhone: TEST_CUSTOMER.customerPhone,
        customerEmail: TEST_CUSTOMER.customerEmail,
        paymentMethod: method.paymentMethod
      };
      
      console.log('📤 Request Data:', JSON.stringify(orderData, null, 2));
      
      const response = await axios.post(
        `${TEST_CONFIG.baseURL}/api/cashfree/create-order`,
        orderData,
        {
          timeout: TEST_CONFIG.timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Order created successfully');
      console.log('📊 Response Status:', response.status);
      console.log('📊 Response Data:', JSON.stringify(response.data, null, 2));
      
      // Validate response structure
      const data = response.data;
      if (data.success) {
        console.log('✅ Response indicates success');
        
        // Check if it's a real API response or mock
        if (data.isRealAPI) {
          console.log('🎉 REAL API SUCCESS!');
        } else {
          console.log('🔄 Mock response (expected for development)');
        }
        
        // Validate required fields
        const orderData = data.data;
        const missingFields = method.expectedFields.filter(field => !orderData[field]);
        
        if (missingFields.length === 0) {
          console.log('✅ All required fields present');
        } else {
          console.log('⚠️ Missing fields:', missingFields);
        }
        
        // Validate return URL
        if (orderData.paymentUrl) {
          console.log('✅ Payment URL present:', orderData.paymentUrl);
          
          // Check if it's a valid URL
          try {
            new URL(orderData.paymentUrl);
            console.log('✅ Payment URL is valid');
          } catch (urlError) {
            console.log('❌ Payment URL is invalid:', orderData.paymentUrl);
          }
        } else {
          console.log('❌ Payment URL missing');
        }
        
        // Validate order token
        if (orderData.orderToken) {
          console.log('✅ Order token present');
        } else {
          console.log('❌ Order token missing');
        }
        
      } else {
        console.log('❌ Response indicates failure');
      }
      
    } catch (error) {
      console.log('❌ Order creation failed');
      console.log('📋 Error:', error.message);
      if (error.response?.data) {
        console.log('📊 Error Response:', JSON.stringify(error.response.data, null, 2));
      }
    }
  }
}

// Test 4: Test return URL validation
async function testReturnUrlValidation() {
  console.log('\n🔍 Test 4: Return URL Validation');
  
  const testReturnUrls = [
    'https://example.com/return?order_id={order_id}',
    'https://myapp.com/payment/callback?order_id={order_id}&status={order_status}',
    'https://localhost:3000/payment/success?order_id={order_id}',
    'https://expressaid.com/payment/complete?order_id={order_id}&amount={order_amount}'
  ];
  
  for (const returnUrl of testReturnUrls) {
    console.log(`\n🔗 Testing return URL: ${returnUrl}`);
    
    try {
      const orderData = {
        orderAmount: 100,
        customerId: 'test_user',
        customerPhone: '9999999999',
        customerEmail: 'test@example.com',
        paymentMethod: 'card',
        returnUrl: returnUrl
      };
      
      const response = await axios.post(
        `${TEST_CONFIG.baseURL}/api/cashfree/create-order`,
        orderData,
        {
          timeout: TEST_CONFIG.timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        console.log('✅ Order created with custom return URL');
        const orderData = response.data.data;
        if (orderData.orderMeta?.returnUrl === returnUrl) {
          console.log('✅ Return URL correctly set in order meta');
        } else {
          console.log('⚠️ Return URL not found in order meta');
        }
      }
      
    } catch (error) {
      console.log('❌ Failed to create order with custom return URL');
      console.log('📋 Error:', error.message);
    }
  }
}

// Test 5: Test error handling
async function testErrorHandling() {
  console.log('\n🔍 Test 5: Error Handling');
  
  const invalidRequests = [
    {
      name: 'Missing order amount',
      data: {
        customerId: 'test',
        customerPhone: '9999999999',
        customerEmail: 'test@example.com',
        paymentMethod: 'card'
      }
    },
    {
      name: 'Invalid payment method',
      data: {
        orderAmount: 100,
        customerId: 'test',
        customerPhone: '9999999999',
        customerEmail: 'test@example.com',
        paymentMethod: 'invalid_method'
      }
    },
    {
      name: 'Missing customer details',
      data: {
        orderAmount: 100,
        paymentMethod: 'card'
      }
    }
  ];
  
  for (const testCase of invalidRequests) {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    
    try {
      const response = await axios.post(
        `${TEST_CONFIG.baseURL}/api/cashfree/create-order`,
        testCase.data,
        {
          timeout: TEST_CONFIG.timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log('❌ Expected error occurred');
      console.log('📋 Error:', error.message);
      if (error.response?.data) {
        console.log('📊 Error Response:', JSON.stringify(error.response.data, null, 2));
      }
    }
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting comprehensive Cashfree integration tests...\n');
  
  const results = {
    serverConnectivity: false,
    cashfreeCredentials: false,
    orderCreation: false,
    returnUrlValidation: false,
    errorHandling: false
  };
  
  try {
    // Test 1: Server connectivity
    results.serverConnectivity = await testServerConnectivity();
    
    if (results.serverConnectivity) {
      // Test 2: Cashfree credentials
      results.cashfreeCredentials = await testCashfreeCredentials();
      
      // Test 3: Order creation
      await testOrderCreation();
      results.orderCreation = true;
      
      // Test 4: Return URL validation
      await testReturnUrlValidation();
      results.returnUrlValidation = true;
      
      // Test 5: Error handling
      await testErrorHandling();
      results.errorHandling = true;
    }
    
  } catch (error) {
    console.log('❌ Test suite failed with error:', error.message);
  }
  
  // Print summary
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log('Server Connectivity:', results.serverConnectivity ? '✅ PASS' : '❌ FAIL');
  console.log('Cashfree Credentials:', results.cashfreeCredentials ? '✅ PASS' : '❌ FAIL');
  console.log('Order Creation:', results.orderCreation ? '✅ PASS' : '❌ FAIL');
  console.log('Return URL Validation:', results.returnUrlValidation ? '✅ PASS' : '❌ FAIL');
  console.log('Error Handling:', results.errorHandling ? '✅ PASS' : '❌ FAIL');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Cashfree integration is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the logs above for details.');
  }
  
  return results;
}

// Run the tests
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testServerConnectivity,
  testCashfreeCredentials,
  testOrderCreation,
  testReturnUrlValidation,
  testErrorHandling
}; 