require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_here',
  environment: process.env.NODE_ENV || 'development',
  
  // AWS SNS Configuration
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your_access_key_here',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your_secret_key_here',
    region: process.env.AWS_REGION || 'us-east-1'
  },
  
  // MongoDB Configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'your_mongodb_atlas_connection_string'
  },
  
  // SMS Service
  SMS_SERVICE: 'twilio', // console, aws-sns, twilio
  
  // Twilio Config
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || 'your_twilio_account_sid',
    authToken: process.env.TWILIO_AUTH_TOKEN || 'your_twilio_auth_token',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '+1234567890'
  },
  
  // Cashfree Configuration
  cashfree: {
    appId: process.env.CASHFREE_APP_ID || 'your_cashfree_app_id_here',
    secretKey: process.env.CASHFREE_SECRET_KEY || 'your_cashfree_secret_key_here',
    environment: process.env.CASHFREE_ENV || 'TEST'
  }
};

module.exports = config; 