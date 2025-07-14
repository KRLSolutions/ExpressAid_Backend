const awsSnsService = require('./services/awsSnsService');
const config = require('./config');

console.log('🔧 AWS SNS Configuration Test & Fix');
console.log('====================================');

// Test current configuration
console.log('\n📋 Current Configuration:');
console.log('AWS Access Key ID:', config.aws.accessKeyId ? '✅ Set' : '❌ Not set');
console.log('AWS Secret Access Key:', config.aws.secretAccessKey ? '✅ Set' : '❌ Not set');
console.log('AWS Region:', config.aws.region);
console.log('SMS Service:', config.SMS_SERVICE);

// Test with real phone number
async function testRealSMS() {
  console.log('\n📱 Testing SMS with real phone number...');
  
  // Test phone number (replace with your actual number)
  const testPhoneNumber = '+919346048610'; // Your number
  
  try {
    const result = await awsSnsService.sendSMS(testPhoneNumber, 'Test message from ExpressAid - AWS SNS is working!');
    
    if (result.success) {
      console.log('✅ SMS sent successfully!');
      console.log('Message ID:', result.messageId);
      
      if (result.messageId === 'console-log') {
        console.log('⚠️  SMS logged to console (AWS SNS not configured properly)');
      } else if (result.messageId === 'fallback-console') {
        console.log('⚠️  SMS sent to console (AWS SNS failed, using fallback)');
        console.log('Error:', result.error);
      } else {
        console.log('🎉 SMS sent via AWS SNS!');
      }
    } else {
      console.log('❌ SMS failed to send');
    }
    
  } catch (error) {
    console.error('❌ Error testing SMS:', error.message);
  }
}

// Test AWS SNS configuration
async function testAWSSNS() {
  console.log('\n🔍 Testing AWS SNS Configuration...');
  
  const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
  
  const snsClient = new SNSClient({
    region: config.aws.region,
    credentials: {
      accessKeyId: config.aws.accessKeyId,
      secretAccessKey: config.aws.secretAccessKey
    }
  });

  try {
    // Test with a valid US number (AWS SNS works best with US numbers)
    const testParams = {
      Message: 'Test message from ExpressAid - AWS SNS configuration test',
      PhoneNumber: '+1234567890', // Test number
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional'
        }
      }
    };

    const command = new PublishCommand(testParams);
    const result = await snsClient.send(command);
    
    console.log('✅ AWS SNS configuration is working!');
    console.log('Message ID:', result.MessageId);
    
  } catch (error) {
    console.error('❌ AWS SNS configuration error:', error.message);
    console.error('Error Code:', error.Code);
    console.error('Error Type:', error.name);
    
    if (error.Code === 'InvalidParameter') {
      console.log('\n💡 This might be because the phone number format is invalid for AWS SNS');
    } else if (error.Code === 'InvalidClientTokenId') {
      console.log('\n💡 AWS credentials are invalid. Please check your AWS Access Key and Secret Key');
    } else if (error.Code === 'UnauthorizedOperation') {
      console.log('\n💡 AWS credentials don\'t have permission to send SMS. Please check IAM permissions');
    }
  }
}

// Check AWS SNS spending limits
async function checkSpendingLimits() {
  console.log('\n💰 Checking AWS SNS Spending Limits...');
  
  console.log('📋 To set up AWS SNS spending limits:');
  console.log('1. Go to AWS SNS Console');
  console.log('2. Navigate to Text messaging (SMS)');
  console.log('3. Set monthly spending limit (recommended: $10)');
  console.log('4. Verify your phone number');
  console.log('5. Request production access if needed');
}

// Main test function
async function runTests() {
  console.log('🚀 Starting AWS SNS Tests...\n');
  
  // Test 1: Configuration
  await testAWSSNS();
  
  // Test 2: Real SMS (commented out for safety)
  // await testRealSMS();
  
  // Test 3: Spending limits info
  checkSpendingLimits();
  
  console.log('\n📋 Next Steps:');
  console.log('1. Verify AWS credentials are correct');
  console.log('2. Set up AWS SNS spending limits');
  console.log('3. Test with real phone number');
  console.log('4. Deploy to Azure with proper environment variables');
}

// Run tests
runTests().catch(console.error); 