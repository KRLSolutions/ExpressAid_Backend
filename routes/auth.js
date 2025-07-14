const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const awsSnsService = require('../services/awsSnsService');
const router = express.Router();

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via SMS
router.post('/send-otp', async (req, res) => {
  console.log('--- /api/auth/send-otp called ---', req.body); // DEBUG LOG
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Find or create user
    let user = await User.findOne({ phoneNumber });
    
    if (!user) {
      user = new User({ phoneNumber });
    }

    // Update OTP
    user.otp = {
      code: otp,
      expiresAt: otpExpiry
    };
    user.isPhoneVerified = false;

    await user.save();

    // Send OTP via SMS
    const message = `Your ExpressAid verification code is: ${otp}. Valid for 10 minutes.`;
    const smsResult = await awsSnsService.sendSMS(phoneNumber, message);

    console.log(`📱 OTP sent to ${phoneNumber}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      phoneNumber: phoneNumber,
      smsProvider: smsResult.messageId.includes('console') ? 'console' : 'aws-sns'
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp, role } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.otp || !user.otp.code) {
      return res.status(400).json({ error: 'No OTP found. Please request a new OTP' });
    }

    if (user.otp.expiresAt < new Date()) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new OTP' });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Mark phone as verified
    user.isPhoneVerified = true;
    user.otp = null; // Clear OTP after successful verification
    if (role && ['customer', 'nurse'].includes(role)) {
      user.role = role;
    }
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId, phoneNumber: user.phoneNumber, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Phone number verified successfully',
      token: token,
      userId: user.userId,
      user: {
        userId: user.userId,
        phoneNumber: user.phoneNumber,
        name: user.name,
        sex: user.sex,
        age: user.age,
        profileImage: user.profileImage,
        isPhoneVerified: user.isPhoneVerified,
        hasProfile: !!(user.name && user.sex && user.age),
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { name, sex, age, profileImage } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findOne({ userId: decoded.userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update profile fields
    if (name) user.name = name;
    if (sex) user.sex = sex;
    if (age) user.age = parseInt(age);
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        userId: user.userId,
        phoneNumber: user.phoneNumber,
        name: user.name,
        sex: user.sex,
        age: user.age,
        profileImage: user.profileImage,
        isPhoneVerified: user.isPhoneVerified,
        hasProfile: !!(user.name && user.sex && user.age)
      }
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findOne({ userId: decoded.userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        userId: user.userId,
        phoneNumber: user.phoneNumber,
        name: user.name,
        sex: user.sex,
        age: user.age,
        profileImage: user.profileImage,
        isPhoneVerified: user.isPhoneVerified,
        hasProfile: !!(user.name && user.sex && user.age),
        addresses: user.addresses
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Get user by userId (for auto-login)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        userId: user.userId,
        phoneNumber: user.phoneNumber,
        name: user.name,
        sex: user.sex,
        age: user.age,
        profileImage: user.profileImage,
        isPhoneVerified: user.isPhoneVerified,
        hasProfile: !!(user.name && user.sex && user.age),
        addresses: user.addresses
      }
    });

  } catch (error) {
    console.error('Get user by userId error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

module.exports = router; 