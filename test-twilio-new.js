const twilio = require('twilio');
const config = require('./config');

console.log('🔧 Testing New Twilio Configuration...');
console.log('Account SID:', config.twilio.accountSid);
console.log('Auth Token:', config.twilio.authToken ? 'Set' : 'Not set');
console.log('Phone Number:', config.twilio.phoneNumber);

// Check if credentials are properly formatted
const isConfigured = !!(config.twilio.accountSid && 
                       config.twilio.authToken && 
                       config.twilio.accountSid.startsWith('AC') &&
                       config.twilio.accountSid !== 'your_twilio_account_sid');

console.log('Configuration valid:', isConfigured);

if (isConfigured) {
  try {
    const client = twilio(config.twilio.accountSid, config.twilio.authToken);
    console.log('✅ Twilio client created successfully');
    
    // Test sending a message
    const testPhone = '+919346048610'; // Your test phone number
    const testMessage = 'Test SMS from ExpressAid with new credentials - ' + new Date().toISOString();
    
    console.log('📱 Attempting to send test SMS...');
    console.log('To:', testPhone);
    console.log('From:', config.twilio.phoneNumber);
    console.log('Message:', testMessage);
    
    client.messages.create({
      body: testMessage,
      from: config.twilio.phoneNumber,
      to: testPhone
    })
    .then(message => {
      console.log('✅ Test SMS sent successfully!');
      console.log('Message SID:', message.sid);
      console.log('Status:', message.status);
      console.log('✅ Twilio is now working! You should receive SMS messages.');
    })
    .catch(error => {
      console.error('❌ Error sending test SMS:');
      console.error('Error Code:', error.code);
      console.error('Error Message:', error.message);
      console.error('More Info:', error.moreInfo);
    });
    
  } catch (error) {
    console.error('❌ Error creating Twilio client:', error);
  }
} else {
  console.log('❌ Twilio not properly configured');
} 