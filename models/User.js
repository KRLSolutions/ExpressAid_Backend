const mongoose = require('mongoose');
const inMemoryDB = require('./InMemoryDB');
const mongoDBService = require('./MongoDBService');

// Check if MongoDB is available
const isMongoAvailable = () => {
  return mongoDBService.isConnected();
};

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    default: () => 'USER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['customer', 'nurse'],
    default: 'customer',
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [lng, lat]
      default: [0, 0]
    }
  },
  name: {
    type: String,
    trim: true
  },
  sex: {
    type: String,
    enum: ['male', 'female', 'other'],
    trim: true
  },
  age: {
    type: Number,
    min: 1,
    max: 120
  },
  profileImage: {
    type: String, // Base64 encoded image or URL
    trim: true
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    address: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    latitude: Number,
    longitude: Number,
    houseNumber: String,
    floor: String,
    block: String,
    landmark: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  cart: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    image: { type: String },
    // Add more fields as needed
  }],
  healthProfile: {
    currentSteps: { type: Number, default: 0 },
    sleepHours: { type: Number, default: 7, min: 0, max: 24 },
    waterIntake: { type: Number, default: 2.5, min: 0, max: 10 }, // in liters
    conditions: [{ type: String }],
    medications: [{ type: String }],
    allergies: [{ type: String }],
    lastUpdated: { type: Date, default: Date.now }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

userSchema.index({ location: '2dsphere' });

// Create the model
const UserModel = mongoose.model('User', userSchema);

// Simple User class for in-memory operations
class User {
  constructor(data = {}) {
    this.userId = data.userId || 'USER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    this.phoneNumber = data.phoneNumber;
    this.name = data.name;
    this.sex = data.sex;
    this.age = data.age;
    this.profileImage = data.profileImage;
    this.isPhoneVerified = data.isPhoneVerified || false;
    this.otp = data.otp;
    this.addresses = data.addresses || [];
    this.cart = data.cart || [];
    this.healthProfile = data.healthProfile || {
      currentSteps: 0,
      sleepHours: 7,
      waterIntake: 2.5,
      conditions: [],
      medications: [],
      allergies: [],
      lastUpdated: new Date()
    };
    this._id = data._id;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  async save() {
    if (isMongoAvailable()) {
      if (this._id) {
        return UserModel.findByIdAndUpdate(this._id, this, { new: true });
      } else {
        const userModel = new UserModel(this);
        return userModel.save();
      }
    } else {
      const result = await inMemoryDB.saveUser(this);
      // Update the current instance with the result
      Object.assign(this, result);
      return this;
    }
  }

  toObject() {
    return {
      userId: this.userId,
      phoneNumber: this.phoneNumber,
      name: this.name,
      sex: this.sex,
      age: this.age,
      profileImage: this.profileImage,
      isPhoneVerified: this.isPhoneVerified,
      otp: this.otp,
      addresses: this.addresses,
      cart: this.cart,
      healthProfile: this.healthProfile,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      _id: this._id
    };
  }
}

// Static methods
User.findOne = async function(query) {
  if (isMongoAvailable()) {
    return UserModel.findOne(query);
  } else {
    if (query.phoneNumber) {
      const result = await inMemoryDB.findUserByPhone(query.phoneNumber);
      return result ? new User(result) : null;
    }
    if (query.userId) {
      const result = await inMemoryDB.findUserByUserId(query.userId);
      return result ? new User(result) : null;
    }
    return null;
  }
};

User.findById = async function(id) {
  if (isMongoAvailable()) {
    return UserModel.findById(id);
  } else {
    const result = await inMemoryDB.findUserById(id);
    return result ? new User(result) : null;
  }
};

module.exports = User;
module.exports.model = UserModel; 