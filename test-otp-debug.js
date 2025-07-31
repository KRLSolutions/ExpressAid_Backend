require('dotenv').config();
const mongoDBService = require('./models/MongoDBService');
const User = require('./models/User');
const SmsServiceFactory = require('./services/smsServiceFactory');
const config = require('./config');

async function debugOTP() {
  console.log('🔍 OTP Debug Test');
  console.log('==================\n');

  try {
    // Step 1: Initialize MongoDB
    console.log('1. Initializing MongoDB...');
    await mongoDBService.connect();
    console.log('   ✅ MongoDB connected');

    // Step 2: Check SMS Service Configuration
    console.log('\n2. Checking SMS Service Configuration...');
    console.log('   SMS_SERVICE:', config.SMS_SERVICE);
    console.log('   TWILIO_ACCOUNT_SID:', config.twilio.accountSid ? 'SET' : 'NOT SET');
    console.log('   TWILIO_AUTH_TOKEN:', config.twilio.authToken ? 'SET' : 'NOT SET');
    console.log('   TWILIO_PHONE_NUMBER:', config.twilio.phoneNumber ? 'SET' : 'NOT SET');
    console.log('   AWS_ACCESS_KEY_ID:', config.aws.accessKeyId ? 'SET' : 'NOT SET');
    console.log('   AWS_SECRET_ACCESS_KEY:', config.aws.secretAccessKey ? 'SET' : 'NOT SET');

    // Step 3: Test SMS Service Factory
    console.log('\n3. Testing SMS Service Factory...');
    const smsService = SmsServiceFactory.getSmsService();
    console.log('   Provider:', smsService.provider);
    console.log('   Service configured:', smsService.service ? 'YES' : 'NO');

    // Step 4: Test OTP Generation and Sending
    console.log('\n4. Testing OTP Generation and Sending...');
    const testPhone = '+919346048610'; // Your phone number
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const message = `Your ExpressAid verification code is: ${otp}. Valid for 10 minutes.`;
    
    console.log('   Test Phone:', testPhone);
    console.log('   Generated OTP:', otp);
    console.log('   Message:', message);

    // Step 5: Send Test SMS
    console.log('\n5. Sending Test SMS...');
    const smsResult = await SmsServiceFactory.sendSMS(testPhone, message);
    console.log('   SMS Result:', smsResult);

    // Step 6: Test User Creation with OTP
    console.log('\n6. Testing User Creation with OTP...');
    let user = await User.findOne({ phoneNumber: testPhone });
    
    if (!user) {
      console.log('   Creating new user...');
      user = new User({ phoneNumber: testPhone });
    } else {
      console.log('   Found existing user:', user.userId);
    }

    // Update OTP
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    };
    user.isPhoneVerified = false;

    await user.save();
    console.log('   ✅ User saved with OTP');

    // Step 7: Test OTP Verification
    console.log('\n7. Testing OTP Verification...');
    const verificationResult = await User.findOne({ phoneNumber: testPhone });
    
    if (verificationResult && verificationResult.otp) {
      console.log('   OTP in database:', verificationResult.otp.code);
      console.log('   OTP expires at:', verificationResult.otp.expiresAt);
      console.log('   Is expired:', verificationResult.otp.expiresAt < new Date());
      
      if (verificationResult.otp.code === otp) {
        console.log('   ✅ OTP matches!');
        
        // Mark as verified
        verificationResult.isPhoneVerified = true;
        verificationResult.otp = null;
        await verificationResult.save();
        console.log('   ✅ User marked as verified');
      } else {
        console.log('   ❌ OTP does not match');
      }
    } else {
      console.log('   ❌ No OTP found in database');
    }

    // Step 8: Check all users in database
    console.log('\n8. Checking all users in database...');
    const allUsers = await User.model.find({}).limit(5);
    console.log(`   Found ${allUsers.length} users:`);
    allUsers.forEach((u, i) => {
      console.log(`   ${i + 1}. ${u.phoneNumber} - ${u.userId} - Verified: ${u.isPhoneVerified}`);
    });

    console.log('\n🎉 OTP Debug Test Completed!');
    console.log('\n📱 If you\'re using console SMS service, check the console logs above for the OTP.');
    console.log('📱 If you\'re using Twilio/AWS, check your phone for the SMS.');

  } catch (error) {
    console.error('❌ OTP Debug Test Failed:', error.message);
    console.error('Error details:', error);
  } finally {
    await mongoDBService.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

debugOTP(); 