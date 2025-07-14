const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000/api';
const ORDER_ID = 'YOUR_ORDER_ID_HERE'; // Replace with actual order ID

// Function to update order status and nurse details
async function updateOrder(orderId, status, assignedNurse) {
  try {
    const response = await axios.patch(`${BASE_URL}/orders/${orderId}/admin-update`, {
      status,
      assignedNurse
    });
    
    console.log('✅ Order updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating order:', error.response?.data || error.message);
    throw error;
  }
}

// Example usage functions
async function setOrderFinished(orderId) {
  console.log(`🔄 Setting order ${orderId} to finished status...`);
  return await updateOrder(orderId, 'finished');
}

async function setOrderActive(orderId) {
  console.log(`🔄 Setting order ${orderId} to nurse_assigned status...`);
  return await updateOrder(orderId, 'nurse_assigned');
}

async function updateNurseDetails(orderId, nurseDetails) {
  console.log(`🔄 Updating nurse details for order ${orderId}...`);
  return await updateOrder(orderId, null, nurseDetails);
}

// Example nurse details
const exampleNurseDetails = {
  nurseId: "custom_nurse_001",
  name: "Dr. Sarah Johnson",
  phoneNumber: "+91 98765 43210",
  age: 32,
  sex: "Female",
  experience: 8,
  specializations: ["Emergency Care", "Pediatrics", "Wound Care"],
  rating: 4.8,
  totalOrders: 156,
  completedOrders: 142,
  currentAddress: "Koramangala, Bangalore",
  distance: 2.5,
  assignedAt: new Date(),
  estimatedArrival: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now
};

// Export functions for use
module.exports = {
  updateOrder,
  setOrderFinished,
  setOrderActive,
  updateNurseDetails,
  exampleNurseDetails
};

// If running directly, show usage examples
if (require.main === module) {
  console.log('🔧 Admin Order Update Tool');
  console.log('========================');
  console.log('');
  console.log('Usage examples:');
  console.log('');
  console.log('1. Set order to finished (hides confirmation screen):');
  console.log(`   await setOrderFinished('${ORDER_ID}');`);
  console.log('');
  console.log('2. Set order to active (shows confirmation screen):');
  console.log(`   await setOrderActive('${ORDER_ID}');`);
  console.log('');
  console.log('3. Update nurse details:');
  console.log(`   await updateNurseDetails('${ORDER_ID}', exampleNurseDetails);`);
  console.log('');
  console.log('4. Update both status and nurse details:');
  console.log(`   await updateOrder('${ORDER_ID}', 'nurse_assigned', exampleNurseDetails);`);
  console.log('');
  console.log('⚠️  Remember to replace ORDER_ID with an actual order ID from your database');
} 