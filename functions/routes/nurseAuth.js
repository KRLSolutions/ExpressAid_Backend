const express = require('express');
const router = express.Router();
const Nurse = require('../models/Nurse');
const jwt = require('jsonwebtoken');
const config = require('../config');
const SmsServiceFactory = require('../services/smsServiceFactory');

// Generate unique nurse ID
const generateNurseId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `NURSE_${timestamp}_${random}`;
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// POST /api/nurse-auth/send-otp
router.post('/send-otp', async (req, res) => {
  console.log('--- /api/nurse-auth/send-otp called ---', req.body);
  
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Format phone number to include country code if not present
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    
    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Check if nurse exists
    let nurse = await Nurse.findOne({ phoneNumber: formattedPhone });
    
    if (!nurse) {
      // Create new nurse
      nurse = new Nurse({
        nurseId: generateNurseId(),
        phoneNumber: formattedPhone,
        isPhoneVerified: false,
      });
    }

    // Update OTP
    nurse.otp = {
      code: otp,
      expiresAt: otpExpiry,
    };

    await nurse.save();

    // Send SMS
    try {
      const message = `Your ExpressAid verification code is: ${otp}. Valid for 10 minutes.`;
      const smsResult = await SmsServiceFactory.sendSMS(formattedPhone, message);
      console.log(`✅ SMS sent via ${smsResult.provider}:`, smsResult.messageId);
      console.log(`📱 OTP sent to ${formattedPhone}: ${otp}`);
    } catch (smsError) {
      console.error('SMS sending failed:', smsError);
      // For development, still return success
      console.log(`📱 OTP sent to ${formattedPhone}: ${otp}`);
    }

    res.json({
      success: true,
      message: 'OTP sent successfully',
      nurseId: nurse.nurseId,
      isNewUser: !nurse.name, // If no name, it's a new user
      isProfileComplete: !!(nurse.name && nurse.age && nurse.sex && nurse.licenseNumber),
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// POST /api/nurse-auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    
    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    
    // Check if nurse exists in MongoDB
    console.log(`🔍 [NURSE-AUTH] Looking for nurse with phone: ${formattedPhone}`);
    const nurse = await Nurse.findOne({ phoneNumber: formattedPhone });
    
    if (!nurse) {
      console.log(`❌ Nurse not found in MongoDB for phone: ${formattedPhone}`);
      return res.status(404).json({ error: 'Nurse not found. Please request a new OTP' });
    }

    console.log(`✅ Nurse found in MongoDB: ${nurse.nurseId} for phone: ${formattedPhone}`);

    // Check if OTP exists and is valid
    if (!nurse.otp || !nurse.otp.code || !nurse.otp.expiresAt) {
      return res.status(400).json({ error: 'No OTP found. Please request a new OTP.' });
    }

    // Check if OTP is expired
    if (new Date() > nurse.otp.expiresAt) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new OTP.' });
    }

    // Verify OTP
    if (nurse.otp.code !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Mark phone as verified
    nurse.isPhoneVerified = true;
    nurse.otp = null; // Clear OTP after successful verification
    await nurse.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: nurse._id, // Use MongoDB ObjectId instead of nurseId string
        phoneNumber: nurse.phoneNumber,
        role: 'nurse'
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'OTP verified successfully',
      token,
      isNewUser: !nurse.name, // If no name, it's a new user
      isProfileComplete: !!(nurse.name && nurse.age && nurse.sex && nurse.licenseNumber),
      nurse: {
        nurseId: nurse.nurseId,
        phoneNumber: nurse.phoneNumber,
        name: nurse.name,
        email: nurse.email,
        age: nurse.age,
        sex: nurse.sex,
        specializations: nurse.specializations,
        experience: nurse.experience,
        licenseNumber: nurse.licenseNumber,
        currentAddress: nurse.currentAddress,
        workingHours: nurse.workingHours,
        serviceRadius: nurse.serviceRadius,
        availability: nurse.availability,
        isActive: nurse.isActive,
        isApproved: nurse.isApproved,
        isPhoneVerified: nurse.isPhoneVerified,
        rating: nurse.rating,
        totalOrders: nurse.totalOrders,
        completedOrders: nurse.completedOrders,
        earnings: nurse.earnings,
        createdAt: nurse.createdAt,
      },
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// POST /api/nurse-auth/update-profile
router.post('/update-profile', async (req, res) => {
  try {
    const { 
      nurseId, 
      name, 
      age, 
      sex, 
      email, 
      specializations, 
      experience, 
      licenseNumber,
      currentAddress,
      workingHours,
      serviceRadius,
      availability,
      isActive,
      isApproved,
      role
    } = req.body;
    
    if (!nurseId) {
      return res.status(400).json({ error: 'Nurse ID is required' });
    }

    const nurse = await Nurse.findOne({ nurseId });
    
    if (!nurse) {
      return res.status(404).json({ error: 'Nurse not found' });
    }

    // Update basic fields
    if (name) nurse.name = name;
    if (age !== undefined) nurse.age = age;
    if (sex) nurse.sex = sex;
    if (email) nurse.email = email;
    if (specializations) nurse.specializations = specializations;
    if (experience !== undefined) nurse.experience = experience;
    if (licenseNumber) nurse.licenseNumber = licenseNumber;
    if (currentAddress) nurse.currentAddress = currentAddress;
    if (workingHours) nurse.workingHours = workingHours;
    if (serviceRadius !== undefined) nurse.serviceRadius = serviceRadius;
    if (availability) nurse.availability = availability;
    if (isActive !== undefined) nurse.isActive = isActive;
    if (isApproved !== undefined) nurse.isApproved = isApproved;
    if (role) nurse.role = role;

    await nurse.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      nurse: {
        nurseId: nurse.nurseId,
        name: nurse.name,
        phoneNumber: nurse.phoneNumber,
        age: nurse.age,
        sex: nurse.sex,
        email: nurse.email,
        specializations: nurse.specializations,
        experience: nurse.experience,
        licenseNumber: nurse.licenseNumber,
        currentAddress: nurse.currentAddress,
        workingHours: nurse.workingHours,
        serviceRadius: nurse.serviceRadius,
        availability: nurse.availability,
        isActive: nurse.isActive,
        isApproved: nurse.isApproved,
        isPhoneVerified: nurse.isPhoneVerified,
        rating: nurse.rating,
        totalOrders: nurse.totalOrders,
        completedOrders: nurse.completedOrders,
        earnings: nurse.earnings,
        createdAt: nurse.createdAt,
      },
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/nurse-auth/me
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const nurse = await Nurse.findOne({ nurseId: decoded.nurseId });
    
    if (!nurse) {
      return res.status(404).json({ error: 'Nurse not found' });
    }

    res.json({
      success: true,
      nurse: {
        nurseId: nurse.nurseId,
        name: nurse.name,
        phoneNumber: nurse.phoneNumber,
        age: nurse.age,
        sex: nurse.sex,
        email: nurse.email,
        profileImage: nurse.profileImage,
        specializations: nurse.specializations,
        experience: nurse.experience,
        licenseNumber: nurse.licenseNumber,
        location: nurse.location,
        currentAddress: nurse.currentAddress,
        rating: nurse.rating,
        totalOrders: nurse.totalOrders,
        completedOrders: nurse.completedOrders,
        earnings: nurse.earnings,
        availability: nurse.availability,
        isPhoneVerified: nurse.isPhoneVerified,
        isApproved: nurse.isApproved,
        isActive: nurse.isActive,
        workingHours: nurse.workingHours,
        serviceRadius: nurse.serviceRadius,
        createdAt: nurse.createdAt,
      },
    });

  } catch (error) {
    console.error('Get nurse profile error:', error);
    res.status(500).json({ error: 'Failed to get nurse profile' });
  }
});

// POST /api/nurse-auth/update-location
router.post('/update-location', async (req, res) => {
  try {
    const { nurseId, latitude, longitude, address } = req.body;
    
    if (!nurseId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Nurse ID, latitude, and longitude are required' });
    }

    const nurse = await Nurse.findOne({ nurseId });
    
    if (!nurse) {
      return res.status(404).json({ error: 'Nurse not found' });
    }

    // Update location
    nurse.location = {
      type: 'Point',
      coordinates: [longitude, latitude], // MongoDB expects [lng, lat]
    };
    
    if (address) {
      nurse.currentAddress = address;
    }

    await nurse.save();

    res.json({
      success: true,
      message: 'Location updated successfully',
      location: nurse.location,
      currentAddress: nurse.currentAddress,
    });

  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// POST /api/nurse-auth/update-availability
router.post('/update-availability', async (req, res) => {
  try {
    const { nurseId, availability } = req.body;
    
    if (!nurseId || !availability) {
      return res.status(400).json({ error: 'Nurse ID and availability are required' });
    }

    if (!['available', 'busy', 'offline'].includes(availability)) {
      return res.status(400).json({ error: 'Invalid availability status' });
    }

    const nurse = await Nurse.findOne({ nurseId });
    
    if (!nurse) {
      return res.status(404).json({ error: 'Nurse not found' });
    }

    nurse.availability = availability;
    await nurse.save();

    res.json({
      success: true,
      message: 'Availability updated successfully',
      availability: nurse.availability,
    });

  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
});

module.exports = router; 