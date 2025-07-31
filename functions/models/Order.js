const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: String,
      name: String,
      quantity: Number,
      price: Number,
      image: String,
    }
  ],
  address: {
    type: new mongoose.Schema({
      type: { type: String },
      address: { type: String },
      houseNumber: { type: String },
      floor: { type: String },
      block: { type: String },
      landmark: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
      name: { type: String },
      isDefault: { type: Boolean },
    }, { _id: false }),
    required: true,
  },
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  cashfreeOrderId: { type: String }, // Store Cashfree order ID for reference
  status: { 
    type: String, 
    enum: ['searching', 'nurse_notified', 'nurse_assigned', 'in_progress', 'completed', 'finished', 'cancelled', 'timeout', 'no_nurses_available'], 
    default: 'searching' 
  },
  nurse: { type: mongoose.Schema.Types.ObjectId, ref: 'Nurse' },
  assignedNurse: {
    nurseId: String,
    name: String,
    phoneNumber: String,
    age: Number,
    sex: String,
    experience: Number,
    specializations: [String],
    rating: Number,
    totalOrders: Number,
    completedOrders: Number,
    currentAddress: String,
    distance: Number, // Distance in km from order location
    assignedAt: { type: Date, default: Date.now },
    estimatedArrival: Date,
  },
  notifiedNurses: [
    {
      nurseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nurse' },
      name: String,
      phoneNumber: String,
      distance: Number, // Distance in km
      notifiedAt: { type: Date, default: Date.now },
      status: { type: String, enum: ['pending', 'denied', 'accepted'], default: 'pending' },
    }
  ],
  nurseAcceptanceTimeout: { type: Date }, // 15-minute timeout for nurse acceptance
  acceptedAt: { type: Date }, // When nurse accepted the order
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema); 