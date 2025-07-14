const mongoose = require('mongoose');
const Order = require('./models/Order');
const config = require('./config');

// Connect to MongoDB
mongoose.connect(config.mongodb.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateOrderStatus() {
  try {
    console.log('Connected to MongoDB');
    
    // Get all orders
    const orders = await Order.find({});
    console.log(`Found ${orders.length} orders:`);
    
    orders.forEach(order => {
      console.log(`Order ID: ${order._id}`);
      console.log(`Status: ${order.status}`);
      console.log(`Created: ${order.createdAt}`);
      console.log(`User: ${order.user}`);
      console.log('---');
    });
    
    // Example: Update a specific order to completed
    // Replace 'ORDER_ID_HERE' with the actual order ID you want to update
    const orderIdToUpdate = '6866cb85f12f263c066e4b83'; // Your order ID from the logs
    
    const updatedOrder = await Order.findByIdAndUpdate(
      orderIdToUpdate,
      { status: 'completed' },
      { new: true }
    );
    
    if (updatedOrder) {
      console.log(`✅ Order ${orderIdToUpdate} updated to status: ${updatedOrder.status}`);
    } else {
      console.log(`❌ Order ${orderIdToUpdate} not found`);
    }
    
    // Example: Update all nurse_assigned orders to completed (uncomment if needed)
    /*
    const result = await Order.updateMany(
      { status: 'nurse_assigned' },
      { status: 'completed' }
    );
    console.log(`Updated ${result.modifiedCount} orders to completed`);
    */
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
updateOrderStatus(); 