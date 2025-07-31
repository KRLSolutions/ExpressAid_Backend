require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-here',
  environment: process.env.NODE_ENV || 'development',
  
  // AWS SNS Configuration
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1'
  },
  
  // MongoDB Configuration
  mongodb: {
       uri: process.env.MONGODB_URI || ''
  },
  
  // SMS Service
  SMS_SERVICE: process.env.SMS_SERVICE || 'twilio', // console, aws-sns, twilio
  
  // Twilio Config
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || ''
  },
  
  // Cashfree Configuration
  cashfree: {
    appId: process.env.CASHFREE_CLIENT_ID || '',
    secretKey: process.env.CASHFREE_CLIENT_SECRET || '',
    environment: process.env.CASHFREE_ENV || 'TEST'
  }
};

module.exports = config; 