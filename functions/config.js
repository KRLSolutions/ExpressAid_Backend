require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  jwtSecret: '057bed89eb41d8de095d6419121b9edc5685025a154893bb26c2dc41b65e67c7254cbe8202c4654deef8514fc158404ef6952736b54953ce0b4b2f484267853f',
  environment: 'production',
  
  // AWS SNS Configuration
  aws: {
    accessKeyId: 'AKIAX2GA5I6XGINGEPWR',
    secretAccessKey: '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',
    region: 'us-east-1'
  },
  
  // MongoDB Configuration
  mongodb: {
    uri: 'mongodb+srv://admin:LHONNmuaD6FzhAGO@cluster0.hibzkks.mongodb.net/expressaid?retryWrites=true&w=majority'
  },
  
  // SMS Service
  SMS_SERVICE: 'twilio',
  
  // Twilio Config
  twilio: {
    accountSid: 'AC886ff90ff2593fc4cd2147564ecec0ab',
    authToken: '80859cfbb89d834cfd03591026647ed7',
    phoneNumber: '+19404882809'
  },
  
  // Cashfree Configuration
  cashfree: {
    appId: 'TEST10393719a08909e07f6157a7221e91739301',
    secretKey: 'cfsk_ma_test_5af67bb3f91343ed26f359e16120a172_fcdfbcea',
    environment: 'TEST'
  }
};

module.exports = config; 