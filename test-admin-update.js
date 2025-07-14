const { updateOrder, setOrderFinished, setOrderActive, updateNurseDetails, exampleNurseDetails } = require('./admin-update-order');

// Test configuration
const TEST_ORDER_ID = '507f1f77bcf86cd799439011'; // Replace with a real order ID from your database

async function runTests() {
  console.log('🧪 Testing Admin Order Update Functionality');
  console.log('==========================================');
  console.log('');

  try {
    // Test 1: Update nurse details
    console.log('📋 Test 1: Updating nurse details...');
    await updateNurseDetails(TEST_ORDER_ID, exampleNurseDetails);
    console.log('✅ Nurse details updated successfully');
    console.log('');

    // Test 2: Set order to active (nurse_assigned)
    console.log('📋 Test 2: Setting order to active...');
    await setOrderActive(TEST_ORDER_ID);
    console.log('✅ Order set to active successfully');
    console.log('');

    // Wait 2 seconds
    console.log('⏳ Waiting 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('');

    // Test 3: Set order to finished
    console.log('📋 Test 3: Setting order to finished...');
    await setOrderFinished(TEST_ORDER_ID);
    console.log('✅ Order set to finished successfully');
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('');
    console.log('📱 Frontend Behavior:');
    console.log('   - When status is "nurse_assigned": User sees confirmation screen');
    console.log('   - When status is "finished": User is redirected to home with completion message');
    console.log('   - "Track your nurse" bar disappears for finished orders');
    console.log('');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('   1. Make sure your backend server is running on localhost:3000');
    console.log('   2. Replace TEST_ORDER_ID with a real order ID from your database');
    console.log('   3. Check that the order exists in your database');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests }; 