require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  jwtSecret: '057bed89eb41d8de095d6419121b9edc5685025a154893bb26c2dc41b65e67c7254cbe8202c4654deef8514fc158404ef6952736b54953ce0b4b2f484267853f',
  environment: process.env.NODE_ENV || 'development',
  
  // AWS SNS Configuration - Hardcoded for testing
  aws: {
    accessKeyId: 'AKIAX2GA5I6XGINGEPWR',
    secretAccessKey: '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',
    region: 'us-east-1'
  },
  
  // MongoDB Configuration - Hardcoded for testing
  mongodb: {
       uri: 'mongodb+srv://admin:LHONNmuaD6FzhAGO@cluster0.hibzkks.mongodb.net/expressaid?retryWrites=true&w=majority'
  },
  
  // SMS Service
  SMS_SERVICE: 'aws-sns', // console, aws-sns, twilio
  
  // Twilio Config (alternative)
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  
  // Cashfree Configuration
  cashfree: {
    appId: process.env.CASHFREE_APP_ID || 'TEST10393719a08909e07f6157a7221e91739301',
    secretKey: process.env.CASHFREE_SECRET_KEY || 'cfsk_ma_test_d81a3c09420dcde848287e6b7aacfca5_3f2bf834',
    environment: process.env.CASHFREE_ENV || 'TEST'
  }
};

module.exports = config; 