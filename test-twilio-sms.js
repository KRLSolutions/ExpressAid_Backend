const SmsServiceFactory = require('./services/smsServiceFactory');
const config = require('./config');

async function testTwilioSMS() {
  console.log('🧪 Testing Twilio SMS Service');
  console.log('=============================\n');
  
  // Check configuration
  console.log('📋 Configuration Check:');
  console.log('SMS Service:', config.SMS_SERVICE);
  console.log('Account SID:', config.twilio.accountSid ? '✅ Set' : '❌ Not set');
  console.log('Auth Token:', config.twilio.authToken ? '✅ Set' : '❌ Not set');
  console.log('Phone Number:', config.twilio.phoneNumber ? '✅ Set' : '❌ Not set');
  
  // Get SMS service
  const { service, provider } = SmsServiceFactory.getSmsService();
  console.log('\n🎯 Selected Provider:', provider);
  
  if (provider !== 'twilio') {
    console.log('❌ Twilio is not configured properly');
    console.log('Please run: node setup-twilio.js');
    return;
  }
  
  // Test phone number (you can change this)
  const testPhoneNumber = '+919346048610'; // Your phone number
  const testMessage = 'Test message from ExpressAid: Your verification code is 123456. Valid for 10 minutes.';
  
  console.log('\n📱 Sending Test SMS:');
  console.log('To:', testPhoneNumber);
  console.log('Message:', testMessage);
  
  try {
    const result = await SmsServiceFactory.sendSMS(testPhoneNumber, testMessage);
    
    console.log('\n📊 Result:');
    console.log('Success:', result.success);
    console.log('Provider:', result.provider);
    console.log('Message ID:', result.messageId);
    
    if (result.success && result.provider === 'twilio') {
      console.log('\n✅ SMS sent successfully via Twilio!');
      console.log('Check your phone for the message.');
    } else {
      console.log('\n❌ SMS failed or fell back to console');
      console.log('Error:', result.error || 'Unknown error');
    }
    
  } catch (error) {
    console.error('\n❌ Error sending SMS:', error.message);
  }
}

// Run the test
testTwilioSMS().catch(console.error); 