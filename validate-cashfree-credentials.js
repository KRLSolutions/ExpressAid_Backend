const { Cashfree } = require('cashfree-pg');
const config = require('./config');

console.log('🔍 Cashfree Credentials Validator\n');

// Function to validate credential format
function validateCredentialFormat(appId, secretKey) {
  console.log('📋 Validating credential format...');
  
  const errors = [];
  
  // Check App ID format
  if (!appId) {
    errors.push('❌ App ID is missing');
  } else if (!appId.startsWith('TEST')) {
    errors.push('❌ App ID should start with "TEST" for sandbox');
  } else if (appId.length < 30) {
    errors.push('❌ App ID seems too short');
  } else {
    console.log('✅ App ID format is correct');
  }
  
  // Check Secret Key format
  if (!secretKey) {
    errors.push('❌ Secret Key is missing');
  } else if (!secretKey.startsWith('cfsk_ma_test_')) {
    errors.push('❌ Secret Key should start with "cfsk_ma_test_" for sandbox');
  } else if (secretKey.length < 50) {
    errors.push('❌ Secret Key seems too short');
  } else {
    console.log('✅ Secret Key format is correct');
  }
  
  return errors;
}

// Function to test credentials with Cashfree API
async function testCredentials(appId, secretKey) {
  console.log('\n🚀 Testing credentials with Cashfree API...');
  
  try {
    const cashfree = new Cashfree({
      clientId: appId,
      clientSecret: secretKey,
      environment: 'TEST'
    });
    
    // Create a minimal test order
    const testOrder = {
      orderId: 'test_' + Date.now(),
      orderAmount: 1,
      orderCurrency: 'INR',
      customerDetails: {
        customerId: 'test_user',
        customerPhone: '9999999999',
        customerEmail: 'test@example.com'
      }
    };
    
    console.log('📤 Sending test order to Cashfree...');
    const result = await cashfree.PGCreateOrder(testOrder);
    
    console.log('✅ SUCCESS! Credentials are working!');
    console.log('📊 Response:', JSON.stringify(result, null, 2));
    return true;
    
  } catch (error) {
    console.log('❌ Credentials test failed');
    console.log('📋 Error:', error.message);
    
    if (error.response?.data) {
      console.log('📊 Error Details:', JSON.stringify(error.response.data, null, 2));
      
      // Provide specific guidance based on error
      const errorData = error.response.data;
      if (errorData.type === 'authentication_error') {
        console.log('\n💡 Possible solutions:');
        console.log('   1. Check if your account is activated');
        console.log('   2. Verify you copied the credentials correctly');
        console.log('   3. Make sure you\'re using sandbox credentials');
        console.log('   4. Try regenerating the API keys');
      }
    }
    
    return false;
  }
}

// Main validation function
async function validateCredentials() {
  const appId = config.cashfree.appId;
  const secretKey = config.cashfree.secretKey;
  
  console.log('📋 Current Configuration:');
  console.log('   App ID:', appId);
  console.log('   Secret Key:', secretKey.substring(0, 20) + '...');
  console.log('   Environment:', config.cashfree.environment);
  console.log('');
  
  // Step 1: Validate format
  const formatErrors = validateCredentialFormat(appId, secretKey);
  
  if (formatErrors.length > 0) {
    console.log('\n❌ Format validation failed:');
    formatErrors.forEach(error => console.log('   ' + error));
    console.log('\n💡 Please check your credentials format.');
    return false;
  }
  
  console.log('\n✅ Format validation passed!');
  
  // Step 2: Test with API
  const apiTestResult = await testCredentials(appId, secretKey);
  
  if (apiTestResult) {
    console.log('\n🎉 All tests passed! Your credentials are working correctly.');
    console.log('✅ You can now use real payments in your application.');
  } else {
    console.log('\n⚠️ API test failed. Check the error details above.');
    console.log('💡 You can still use the mock mode for development.');
  }
  
  return apiTestResult;
}

// Run validation if this file is executed directly
if (require.main === module) {
  validateCredentials().catch(console.error);
}

module.exports = {
  validateCredentials,
  validateCredentialFormat,
  testCredentials
}; 