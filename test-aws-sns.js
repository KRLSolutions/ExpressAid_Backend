const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const config = require('./config');

console.log('🔧 Testing AWS SNS Configuration...');
console.log('AWS Access Key ID:', config.aws.accessKeyId ? '✅ Set' : '❌ Not set');
console.log('AWS Secret Access Key:', config.aws.secretAccessKey ? '✅ Set' : '❌ Not set');
console.log('AWS Region:', config.aws.region);

const snsClient = new SNSClient({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
  }
});

async function testSNS() {
  try {
    console.log('\n📱 Testing SMS sending...');
    
    const params = {
      Message: 'Test message from ExpressAid - AWS SNS is working!',
      PhoneNumber: '+1234567890', // Test number
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional'
        }
      }
    };

    const command = new PublishCommand(params);
    const result = await snsClient.send(command);
    
    console.log('✅ SMS sent successfully!');
    console.log('Message ID:', result.MessageId);
    
  } catch (error) {
    console.error('❌ AWS SNS Error:', error.message);
    console.error('Error Code:', error.Code);
    console.error('Error Type:', error.name);
    
    if (error.Code === 'InvalidParameter') {
      console.log('\n💡 This might be because the phone number format is invalid for AWS SNS');
    }
  }
}

testSNS(); 