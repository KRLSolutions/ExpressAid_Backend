const { Cashfree, CFEnvironment } = require('cashfree-pg');

// Test credentials from config
const config = {
  appId: 'TEST10393719a08909e07f6157a7221e91739301',
  secretKey: 'cfsk_ma_test_07ffbecee7c174a4d047a39fbfeebf89_558ecf63',
  environment: 'SANDBOX'
};

console.log('🔧 Testing Cashfree Credentials...');
console.log('📋 Config:', {
  environment: config.environment,
  appId: config.appId,
  secretKey: config.secretKey ? config.secretKey.substring(0, 10) + '...' : 'NOT SET'
});

async function testCashfreeCredentials() {
  try {
    // Initialize Cashfree SDK
    const cashfree = new Cashfree(
      CFEnvironment.SANDBOX,
      config.appId,
      config.secretKey
    );
    
    console.log('✅ Cashfree SDK initialized successfully');
    
    // Test order creation
    const testOrder = {
      order_amount: 1,
      order_currency: "INR",
      customer_details: {
        customer_id: "test_customer_123",
        customer_name: "Test Customer",
        customer_email: "test@example.com",
        customer_phone: "9999999999",
      },
      order_meta: {
        return_url: "https://example.com/return",
        notify_url: "https://example.com/webhook"
      },
      order_note: "Test order"
    };
    
    console.log('📤 Creating test order...');
    const result = await cashfree.PGCreateOrder(testOrder);
    
    console.log('✅ Test order created successfully!');
    console.log('📊 Order details:', {
      orderId: result.data.order_id,
      sessionId: result.data.payment_session_id,
      status: result.data.order_status
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    
    if (error.response) {
      console.error('📋 Error response:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    
    if (error.message) {
      console.error('📝 Error message:', error.message);
    }
    
    throw error;
  }
}

// Run the test
testCashfreeCredentials()
  .then(() => {
    console.log('🎉 Credential test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Credential test failed!');
    console.error('🔧 To fix this:');
    console.error('1. Check if credentials are correct');
    console.error('2. Verify credentials are not expired');
    console.error('3. Ensure you have proper permissions');
    console.error('4. Check if you\'re using the right environment (SANDBOX/PRODUCTION)');
    process.exit(1);
  }); 