const axios = require('axios');

// Test Cashfree integration with your credentials
const CASHFREE_CLIENT_ID = 'TEST10393719a08909e07f6157a7221e91739301';
const CASHFREE_CLIENT_SECRET = 'cfsk_ma_test_5af67bb3f91343ed26f359e16120a172_fcdfbcea';
const CASHFREE_API_BASE = "https://sandbox.cashfree.com/pg";

async function testCashfreeOrder() {
  try {
    console.log('🧪 Testing Cashfree Order Creation...');
    console.log('📋 Using credentials:');
    console.log('   Client ID:', CASHFREE_CLIENT_ID);
    console.log('   Client Secret:', CASHFREE_CLIENT_SECRET.substring(0, 20) + '...');
    
    const orderPayload = {
      order_id: `test_order_${Date.now()}`,
      order_amount: 100,
      order_currency: "INR",
      customer_details: {
        customer_id: "TEST_USER_123",
        customer_email: "test@example.com",
        customer_phone: "9999999999",
      },
      order_meta: {
        return_url: "https://yourfrontend.com/payment-success",
      },
    };

    console.log('📦 Order payload:', JSON.stringify(orderPayload, null, 2));

    const response = await axios.post(
      `${CASHFREE_API_BASE}/orders`,
      orderPayload,
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": CASHFREE_CLIENT_ID,
          "x-client-secret": CASHFREE_CLIENT_SECRET,
          "x-api-version": "2022-09-01",
        },
      }
    );

    console.log('✅ Cashfree API Response:');
    console.log('   Status:', response.status);
    console.log('   Data:', JSON.stringify(response.data, null, 2));

    const { order_id, payment_session_id } = response.data;
    
    if (order_id && payment_session_id) {
      console.log('🎉 SUCCESS: Order created successfully!');
      console.log('   Order ID:', order_id);
      console.log('   Payment Session ID:', payment_session_id);
    } else {
      console.log('❌ ERROR: Missing order_id or payment_session_id');
    }

  } catch (error) {
    console.error('💥 Cashfree API Error:');
    console.error('   Status:', error.response?.status);
    console.error('   Message:', error.response?.data || error.message);
    console.error('   Headers sent:', {
      'x-client-id': CASHFREE_CLIENT_ID,
      'x-client-secret': CASHFREE_CLIENT_SECRET.substring(0, 20) + '...',
      'x-api-version': '2022-09-01'
    });
  }
}

// Run the test
testCashfreeOrder(); 