const fetch = require('node-fetch');

async function testServerStatus() {
  console.log('🔍 Testing Server Status...\n');
  
  try {
    // Test 1: Health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch('http://expressaid.centralus.cloudapp.azure.com:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('   Status:', healthData.status);
    console.log('   Database type:', healthData.database.type);
    console.log('   Database status:', healthData.database.status);
    console.log('   Environment:', healthData.environment);
    
    // Test 2: Test endpoint
    console.log('\n2. Testing basic API endpoint...');
    const testResponse = await fetch('http://expressaid.centralus.cloudapp.azure.com:5000/api/test');
    const testData = await testResponse.json();
    console.log('   Test response:', testData);
    
    // Test 3: Check if MongoDB service is connected
    console.log('\n3. Checking MongoDB service status...');
    const statusResponse = await fetch('http://expressaid.centralus.cloudapp.azure.com:5000/api/status');
    const statusData = await statusResponse.json();
    console.log('   Services status:', statusData.services);
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
testServerStatus(); 