const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Twilio Setup for ExpressAid');
console.log('==============================\n');

console.log('To use Twilio SMS service, you need:');
console.log('1. Twilio Account SID (starts with "AC")');
console.log('2. Twilio Auth Token');
console.log('3. Twilio Phone Number (format: +1234567890)\n');

console.log('You can get these from: https://console.twilio.com/\n');

rl.question('Enter your Twilio Account SID: ', (accountSid) => {
  rl.question('Enter your Twilio Auth Token: ', (authToken) => {
    rl.question('Enter your Twilio Phone Number (with +): ', (phoneNumber) => {
      
      // Validate inputs
      if (!accountSid.startsWith('AC')) {
        console.log('❌ Account SID must start with "AC"');
        rl.close();
        return;
      }
      
      if (!phoneNumber.startsWith('+')) {
        console.log('❌ Phone number must start with "+"');
        rl.close();
        return;
      }
      
      // Create .env content
      const envContent = `# Twilio Configuration
TWILIO_ACCOUNT_SID=${accountSid}
TWILIO_AUTH_TOKEN=${authToken}
TWILIO_PHONE_NUMBER=${phoneNumber}

# SMS Service Configuration
SMS_SERVICE=twilio

# Environment
NODE_ENV=production
`;
      
      // Write to .env file
      const envPath = path.join(__dirname, '.env');
      fs.writeFileSync(envPath, envContent);
      
      console.log('\n✅ Twilio credentials saved to .env file');
      console.log('📁 File location:', envPath);
      
      // Test the configuration
      console.log('\n🧪 Testing Twilio configuration...');
      
      // Load the new config
      require('dotenv').config();
      const config = require('./config');
      const SmsServiceFactory = require('./services/smsServiceFactory');
      
      console.log('📱 SMS Service:', config.SMS_SERVICE);
      console.log('🔑 Account SID:', config.twilio.accountSid ? '✅ Set' : '❌ Not set');
      console.log('🔐 Auth Token:', config.twilio.authToken ? '✅ Set' : '❌ Not set');
      console.log('📞 Phone Number:', config.twilio.phoneNumber ? '✅ Set' : '❌ Not set');
      
      const { service, provider } = SmsServiceFactory.getSmsService();
      console.log('🎯 Selected Provider:', provider);
      
      if (provider === 'twilio') {
        console.log('✅ Twilio is properly configured!');
        console.log('\n🚀 You can now test SMS by running:');
        console.log('node test-otp.js');
      } else {
        console.log('❌ Twilio is not properly configured');
        console.log('Please check your credentials and try again');
      }
      
      rl.close();
    });
  });
}); 