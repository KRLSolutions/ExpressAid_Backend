const mongoose = require('mongoose');

const NurseSchema = new mongoose.Schema({
  nurseId: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  age: {
    type: Number,
    required: false,
  },
  sex: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: false,
  },
  profileImage: {
    type: String,
    default: 'https://via.placeholder.com/150x150/007AFF/FFFFFF?text=Nurse',
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    code: String,
    expiresAt: Date,
  },
  role: {
    type: String,
    default: 'nurse',
    enum: ['nurse'],
  },
  // Nurse-specific fields
  availability: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'offline',
  },
  specializations: [{
    type: String,
    enum: [
      'General Nursing',
      'Emergency Care',
      'Pediatric Nursing',
      'Geriatric Care',
      'Wound Care',
      'IV Therapy',
      'Home Health Care',
      'Post-Surgery Care',
      'Chronic Disease Management',
      'Mental Health Support',
      'elderly_care',
      'iv_drip',
      'wound_dressing',
      'vaccination',
      'health_checkup',
      'emergency_care'
    ],
  }],
  experience: {
    type: Number, // Years of experience
    default: 0,
  },
  licenseNumber: {
    type: String,
    required: false,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0], // [longitude, latitude]
    },
  },
  currentAddress: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5,
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
  completedOrders: {
    type: Number,
    default: 0,
  },
  earnings: {
    type: Number,
    default: 0,
  },
  // Bank details for payments
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
  },
  // Documents
  documents: {
    idProof: String, // URL to document
    license: String, // URL to license
    certificates: [String], // Array of certificate URLs
  },
  // Working hours - Updated to support daily schedule
  workingHours: {
    monday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      isWorking: { type: Boolean, default: true }
    },
    tuesday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      isWorking: { type: Boolean, default: true }
    },
    wednesday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      isWorking: { type: Boolean, default: true }
    },
    thursday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      isWorking: { type: Boolean, default: true }
    },
    friday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      isWorking: { type: Boolean, default: true }
    },
    saturday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      isWorking: { type: Boolean, default: true }
    },
    sunday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      isWorking: { type: Boolean, default: false }
    }
  },
  // Service areas (radius in km)
  serviceRadius: {
    type: Number,
    default: 5, // 5km default
  },
  // Status
  isActive: {
    type: Boolean,
    default: true,
  },
  isApproved: {
    type: Boolean,
    default: false, // Admin approval required
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create geospatial index for location-based queries
NurseSchema.index({ location: '2dsphere' });

// Update the updatedAt field before saving
NurseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Nurse', NurseSchema); 