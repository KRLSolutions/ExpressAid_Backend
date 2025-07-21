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
  SMS_SERVICE: 'twilio', // console, aws-sns, twilio
  
  // Twilio Config
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || 'your_twilio_account_sid',
    authToken: process.env.TWILIO_AUTH_TOKEN || 'your_twilio_auth_token',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '+1234567890'
  },
  
  // Cashfree Configuration - Updated with fresh test credentials
  cashfree: {
    appId: process.env.CASHFREE_APP_ID || 'TEST10393719a08909e07f6157a7221e91739301',
    secretKey: process.env.CASHFREE_SECRET_KEY || 'cfsk_ma_test_07ffbecee7c174a4d047a39fbfeebf89_558ecf63',
    environment: process.env.CASHFREE_ENV || 'SANDBOX'
  }
};

module.exports = config; 