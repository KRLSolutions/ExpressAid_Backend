const mongoose = require('mongoose');
const inMemoryDB = require('./InMemoryDB');
const mongoDBService = require('./MongoDBService');

// Check if MongoDB is available
const isMongoAvailable = () => {
  return mongoDBService.isConnected();
};

const healthMetricsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  // Basic measurements
  height: {
    type: Number, // in cm
    min: 50,
    max: 300
  },
  weight: {
    type: Number, // in kg
    min: 10,
    max: 500
  },
  bmi: {
    type: Number,
    min: 10,
    max: 100
  },
  bmiCategory: {
    type: String,
    enum: ['Underweight', 'Normal weight', 'Overweight', 'Obese'],
    default: 'Normal weight'
  },
  
  // Vital signs
  bloodPressure: {
    systolic: { type: Number, min: 70, max: 200 }, // mmHg
    diastolic: { type: Number, min: 40, max: 130 }, // mmHg
    category: { type: String, enum: ['Normal', 'Elevated', 'High', 'Very High'] }
  },
  heartRate: {
    type: Number, // bpm
    min: 40,
    max: 200
  },
  temperature: {
    type: Number, // Celsius
    min: 35,
    max: 42
  },
  oxygenSaturation: {
    type: Number, // percentage
    min: 70,
    max: 100
  },
  
  // Additional health metrics
  bloodSugar: {
    type: Number, // mg/dL
    min: 50,
    max: 500
  },
  cholesterol: {
    total: { type: Number, min: 100, max: 400 },
    hdl: { type: Number, min: 20, max: 100 },
    ldl: { type: Number, min: 50, max: 300 },
    triglycerides: { type: Number, min: 50, max: 500 }
  },
  
  // Health goals and targets
  targetWeight: {
    type: Number,
    min: 10,
    max: 500
  },
  targetBMI: {
    type: Number,
    min: 18.5,
    max: 25
  },
  
  // Activity and lifestyle
  activityLevel: {
    type: String,
    enum: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extremely Active'],
    default: 'Sedentary'
  },
  dailySteps: {
    type: Number,
    min: 0,
    max: 50000
  },
  
  // Health history
  measurements: [{
    date: { type: Date, default: Date.now },
    weight: Number,
    bmi: Number,
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    heartRate: Number,
    temperature: Number,
    notes: String
  }],
  
  // Health conditions and medications
  conditions: [{
    name: String,
    diagnosedDate: Date,
    isActive: { type: Boolean, default: true },
    notes: String
  }],
  
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true },
    notes: String
  }],
  
  // Allergies
  allergies: [{
    allergen: String,
    severity: { type: String, enum: ['Mild', 'Moderate', 'Severe'] },
    notes: String
  }],
  
  // Emergency contacts
  emergencyContacts: [{
    name: String,
    relationship: String,
    phoneNumber: String,
    isPrimary: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

// Create the model
const HealthMetricsModel = mongoose.model('HealthMetrics', healthMetricsSchema);

// Simple HealthMetrics class for in-memory operations
class HealthMetrics {
  constructor(data = {}) {
    this.userId = data.userId;
    this.height = data.height;
    this.weight = data.weight;
    this.bmi = data.bmi;
    this.bmiCategory = data.bmiCategory;
    this.bloodPressure = data.bloodPressure;
    this.heartRate = data.heartRate;
    this.temperature = data.temperature;
    this.oxygenSaturation = data.oxygenSaturation;
    this.bloodSugar = data.bloodSugar;
    this.cholesterol = data.cholesterol;
    this.targetWeight = data.targetWeight;
    this.targetBMI = data.targetBMI;
    this.activityLevel = data.activityLevel;
    this.dailySteps = data.dailySteps;
    this.measurements = data.measurements || [];
    this.conditions = data.conditions || [];
    this.medications = data.medications || [];
    this.allergies = data.allergies || [];
    this.emergencyContacts = data.emergencyContacts || [];
    this._id = data._id;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Calculate BMI
  calculateBMI() {
    if (this.height && this.weight) {
      const heightInMeters = this.height / 100;
      this.bmi = Math.round((this.weight / (heightInMeters * heightInMeters)) * 10) / 10;
      this.bmiCategory = this.getBMICategory(this.bmi);
      return this.bmi;
    }
    return null;
  }

  // Get BMI category
  getBMICategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  // Get blood pressure category
  getBloodPressureCategory(systolic, diastolic) {
    if (systolic < 120 && diastolic < 80) return 'Normal';
    if (systolic < 130 && diastolic < 80) return 'Elevated';
    if (systolic < 140 || diastolic < 90) return 'High';
    return 'Very High';
  }

  // Add measurement to history
  addMeasurement(measurement) {
    this.measurements.push({
      date: new Date(),
      ...measurement
    });
    
    // Keep only last 30 measurements
    if (this.measurements.length > 30) {
      this.measurements = this.measurements.slice(-30);
    }
  }

  async save() {
    if (isMongoAvailable()) {
      if (this._id) {
        return HealthMetricsModel.findByIdAndUpdate(this._id, this, { new: true });
      } else {
        const healthMetricsModel = new HealthMetricsModel(this);
        return healthMetricsModel.save();
      }
    } else {
      const result = await inMemoryDB.saveHealthMetrics(this);
      Object.assign(this, result);
      return this;
    }
  }

  toObject() {
    return {
      userId: this.userId,
      height: this.height,
      weight: this.weight,
      bmi: this.bmi,
      bmiCategory: this.bmiCategory,
      bloodPressure: this.bloodPressure,
      heartRate: this.heartRate,
      temperature: this.temperature,
      oxygenSaturation: this.oxygenSaturation,
      bloodSugar: this.bloodSugar,
      cholesterol: this.cholesterol,
      targetWeight: this.targetWeight,
      targetBMI: this.targetBMI,
      activityLevel: this.activityLevel,
      dailySteps: this.dailySteps,
      measurements: this.measurements,
      conditions: this.conditions,
      medications: this.medications,
      allergies: this.allergies,
      emergencyContacts: this.emergencyContacts,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      _id: this._id
    };
  }
}

// Static methods
HealthMetrics.findOne = async function(query) {
  if (isMongoAvailable()) {
    return HealthMetricsModel.findOne(query);
  } else {
    if (query.userId) {
      const result = await inMemoryDB.findHealthMetricsByUserId(query.userId);
      return result ? new HealthMetrics(result) : null;
    }
    return null;
  }
};

HealthMetrics.findById = async function(id) {
  if (isMongoAvailable()) {
    return HealthMetricsModel.findById(id);
  } else {
    const result = await inMemoryDB.findHealthMetricsById(id);
    return result ? new HealthMetrics(result) : null;
  }
};

module.exports = HealthMetrics;
module.exports.model = HealthMetricsModel;