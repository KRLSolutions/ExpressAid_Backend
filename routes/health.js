const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const HealthMetrics = require('../models/HealthMetrics');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Get user's health metrics
router.get('/metrics', authenticateToken, async (req, res) => {
  try {
    const healthMetrics = await HealthMetrics.findOne({ userId: req.user.userId });
    
    if (!healthMetrics) {
      return res.json({
        success: true,
        data: {
          hasData: false,
          message: 'No health data found. Start by adding your basic measurements.'
        }
      });
    }

    res.json({
      success: true,
      data: {
        hasData: true,
        ...healthMetrics.toObject()
      }
    });
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    res.status(500).json({ error: 'Failed to fetch health metrics' });
  }
});

// Update basic measurements (height, weight, BMI)
router.post('/basic-measurements', authenticateToken, async (req, res) => {
  try {
    const { height, weight } = req.body;
    
    if (!height || !weight) {
      return res.status(400).json({ error: 'Height and weight are required' });
    }

    if (height < 50 || height > 300) {
      return res.status(400).json({ error: 'Height must be between 50-300 cm' });
    }

    if (weight < 10 || weight > 500) {
      return res.status(400).json({ error: 'Weight must be between 10-500 kg' });
    }

    let healthMetrics = await HealthMetrics.findOne({ userId: req.user.userId });
    
    if (!healthMetrics) {
      healthMetrics = new HealthMetrics({ userId: req.user.userId });
    }

    healthMetrics.height = height;
    healthMetrics.weight = weight;
    healthMetrics.calculateBMI();

    // Add to measurement history
    healthMetrics.addMeasurement({
      weight: weight,
      bmi: healthMetrics.bmi
    });

    await healthMetrics.save();

    res.json({
      success: true,
      message: 'Basic measurements updated successfully',
      data: {
        height: healthMetrics.height,
        weight: healthMetrics.weight,
        bmi: healthMetrics.bmi,
        bmiCategory: healthMetrics.bmiCategory
      }
    });
  } catch (error) {
    console.error('Error updating basic measurements:', error);
    res.status(500).json({ error: 'Failed to update basic measurements' });
  }
});

// Update vital signs
router.post('/vitals', authenticateToken, async (req, res) => {
  try {
    const { 
      systolic, diastolic, heartRate, temperature, 
      oxygenSaturation, bloodSugar 
    } = req.body;

    let healthMetrics = await HealthMetrics.findOne({ userId: req.user.userId });
    
    if (!healthMetrics) {
      return res.status(400).json({ error: 'Please add basic measurements first' });
    }

    // Validate blood pressure
    if (systolic && diastolic) {
      if (systolic < 70 || systolic > 200 || diastolic < 40 || diastolic > 130) {
        return res.status(400).json({ error: 'Invalid blood pressure values' });
      }
      healthMetrics.bloodPressure = {
        systolic,
        diastolic,
        category: healthMetrics.getBloodPressureCategory(systolic, diastolic)
      };
    }

    // Validate heart rate
    if (heartRate !== undefined) {
      if (heartRate < 40 || heartRate > 200) {
        return res.status(400).json({ error: 'Heart rate must be between 40-200 bpm' });
      }
      healthMetrics.heartRate = heartRate;
    }

    // Validate temperature
    if (temperature !== undefined) {
      if (temperature < 35 || temperature > 42) {
        return res.status(400).json({ error: 'Temperature must be between 35-42°C' });
      }
      healthMetrics.temperature = temperature;
    }

    // Validate oxygen saturation
    if (oxygenSaturation !== undefined) {
      if (oxygenSaturation < 70 || oxygenSaturation > 100) {
        return res.status(400).json({ error: 'Oxygen saturation must be between 70-100%' });
      }
      healthMetrics.oxygenSaturation = oxygenSaturation;
    }

    // Validate blood sugar
    if (bloodSugar !== undefined) {
      if (bloodSugar < 50 || bloodSugar > 500) {
        return res.status(400).json({ error: 'Blood sugar must be between 50-500 mg/dL' });
      }
      healthMetrics.bloodSugar = bloodSugar;
    }

    // Add to measurement history
    healthMetrics.addMeasurement({
      bloodPressure: healthMetrics.bloodPressure,
      heartRate: healthMetrics.heartRate,
      temperature: healthMetrics.temperature
    });

    await healthMetrics.save();

    res.json({
      success: true,
      message: 'Vital signs updated successfully',
      data: {
        bloodPressure: healthMetrics.bloodPressure,
        heartRate: healthMetrics.heartRate,
        temperature: healthMetrics.temperature,
        oxygenSaturation: healthMetrics.oxygenSaturation,
        bloodSugar: healthMetrics.bloodSugar
      }
    });
  } catch (error) {
    console.error('Error updating vital signs:', error);
    res.status(500).json({ error: 'Failed to update vital signs' });
  }
});

// Update health goals
router.post('/goals', authenticateToken, async (req, res) => {
  try {
    const { targetWeight, targetBMI, activityLevel, dailySteps } = req.body;

    let healthMetrics = await HealthMetrics.findOne({ userId: req.user.userId });
    
    if (!healthMetrics) {
      healthMetrics = new HealthMetrics({ userId: req.user.userId });
    }

    if (targetWeight !== undefined) {
      if (targetWeight < 10 || targetWeight > 500) {
        return res.status(400).json({ error: 'Target weight must be between 10-500 kg' });
      }
      healthMetrics.targetWeight = targetWeight;
    }

    if (targetBMI !== undefined) {
      if (targetBMI < 18.5 || targetBMI > 25) {
        return res.status(400).json({ error: 'Target BMI must be between 18.5-25' });
      }
      healthMetrics.targetBMI = targetBMI;
    }

    if (activityLevel !== undefined) {
      healthMetrics.activityLevel = activityLevel;
    }

    if (dailySteps !== undefined) {
      if (dailySteps < 0 || dailySteps > 50000) {
        return res.status(400).json({ error: 'Daily steps must be between 0-50,000' });
      }
      healthMetrics.dailySteps = dailySteps;
    }

    await healthMetrics.save();

    res.json({
      success: true,
      message: 'Health goals updated successfully',
      data: {
        targetWeight: healthMetrics.targetWeight,
        targetBMI: healthMetrics.targetBMI,
        activityLevel: healthMetrics.activityLevel,
        dailySteps: healthMetrics.dailySteps
      }
    });
  } catch (error) {
    console.error('Error updating health goals:', error);
    res.status(500).json({ error: 'Failed to update health goals' });
  }
});

// Add emergency contact
router.post('/emergency-contacts', authenticateToken, async (req, res) => {
  try {
    const { name, relationship, phoneNumber, isPrimary } = req.body;

    if (!name || !relationship || !phoneNumber) {
      return res.status(400).json({ error: 'Name, relationship, and phone number are required' });
    }

    let healthMetrics = await HealthMetrics.findOne({ userId: req.user.userId });
    
    if (!healthMetrics) {
      healthMetrics = new HealthMetrics({ userId: req.user.userId });
    }

    const newContact = {
      name,
      relationship,
      phoneNumber,
      isPrimary: isPrimary || false
    };

    // If this is the primary contact, unset others
    if (isPrimary) {
      healthMetrics.emergencyContacts.forEach(contact => {
        contact.isPrimary = false;
      });
    }

    healthMetrics.emergencyContacts.push(newContact);
    await healthMetrics.save();

    res.json({
      success: true,
      message: 'Emergency contact added successfully',
      data: healthMetrics.emergencyContacts
    });
  } catch (error) {
    console.error('Error adding emergency contact:', error);
    res.status(500).json({ error: 'Failed to add emergency contact' });
  }
});

// Add health condition
router.post('/conditions', authenticateToken, async (req, res) => {
  try {
    const { name, diagnosedDate, notes } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Condition name is required' });
    }

    let healthMetrics = await HealthMetrics.findOne({ userId: req.user.userId });
    
    if (!healthMetrics) {
      healthMetrics = new HealthMetrics({ userId: req.user.userId });
    }

    const newCondition = {
      name,
      diagnosedDate: diagnosedDate ? new Date(diagnosedDate) : new Date(),
      notes: notes || ''
    };

    healthMetrics.conditions.push(newCondition);
    await healthMetrics.save();

    res.json({
      success: true,
      message: 'Health condition added successfully',
      data: healthMetrics.conditions
    });
  } catch (error) {
    console.error('Error adding health condition:', error);
    res.status(500).json({ error: 'Failed to add health condition' });
  }
});

// Add medication
router.post('/medications', authenticateToken, async (req, res) => {
  try {
    const { name, dosage, frequency, startDate, endDate, notes } = req.body;

    if (!name || !dosage || !frequency) {
      return res.status(400).json({ error: 'Name, dosage, and frequency are required' });
    }

    let healthMetrics = await HealthMetrics.findOne({ userId: req.user.userId });
    
    if (!healthMetrics) {
      healthMetrics = new HealthMetrics({ userId: req.user.userId });
    }

    const newMedication = {
      name,
      dosage,
      frequency,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      notes: notes || ''
    };

    healthMetrics.medications.push(newMedication);
    await healthMetrics.save();

    res.json({
      success: true,
      message: 'Medication added successfully',
      data: healthMetrics.medications
    });
  } catch (error) {
    console.error('Error adding medication:', error);
    res.status(500).json({ error: 'Failed to add medication' });
  }
});

// Add allergy
router.post('/allergies', authenticateToken, async (req, res) => {
  try {
    const { allergen, severity, notes } = req.body;

    if (!allergen) {
      return res.status(400).json({ error: 'Allergen name is required' });
    }

    let healthMetrics = await HealthMetrics.findOne({ userId: req.user.userId });
    
    if (!healthMetrics) {
      healthMetrics = new HealthMetrics({ userId: req.user.userId });
    }

    const newAllergy = {
      allergen,
      severity: severity || 'Mild',
      notes: notes || ''
    };

    healthMetrics.allergies.push(newAllergy);
    await healthMetrics.save();

    res.json({
      success: true,
      message: 'Allergy added successfully',
      data: healthMetrics.allergies
    });
  } catch (error) {
    console.error('Error adding allergy:', error);
    res.status(500).json({ error: 'Failed to add allergy' });
  }
});

// Get measurement history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const healthMetrics = await HealthMetrics.findOne({ userId: req.user.userId });
    
    if (!healthMetrics || !healthMetrics.measurements.length) {
      return res.json({
        success: true,
        data: {
          measurements: [],
          message: 'No measurement history found'
        }
      });
    }

    // Sort measurements by date (newest first)
    const sortedMeasurements = healthMetrics.measurements
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: {
        measurements: sortedMeasurements
      }
    });
  } catch (error) {
    console.error('Error fetching measurement history:', error);
    res.status(500).json({ error: 'Failed to fetch measurement history' });
  }
});

// Calculate BMI (utility endpoint)
router.post('/calculate-bmi', authenticateToken, async (req, res) => {
  try {
    const { height, weight } = req.body;
    
    if (!height || !weight) {
      return res.status(400).json({ error: 'Height and weight are required' });
    }

    const heightInMeters = height / 100;
    const bmi = Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
    
    let category;
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    res.json({
      success: true,
      data: {
        bmi,
        category,
        height,
        weight
      }
    });
  } catch (error) {
    console.error('Error calculating BMI:', error);
    res.status(500).json({ error: 'Failed to calculate BMI' });
  }
});

module.exports = router;