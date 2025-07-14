const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const config = require('../config');

class AWSSNSService {
  constructor() {
    this.client = new SNSClient({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey
      }
    });
    this._isConfigured = !!(config.aws.accessKeyId && config.aws.secretAccessKey);
  }

  async sendSMS(phoneNumber, message) {
    try {
      if (!this._isConfigured) {
        console.log('📱 AWS SNS not configured, logging SMS to console:');
        console.log(`📞 To: ${phoneNumber}`);
        console.log(`💬 Message: ${message}`);
        return { success: true, messageId: 'console-log' };
      }

      const params = {
        Message: message,
        PhoneNumber: phoneNumber,
        MessageAttributes: {
          'AWS.SNS.SMS.SMSType': {
            DataType: 'String',
            StringValue: 'Transactional'
          }
        }
      };

      const command = new PublishCommand(params);
      const result = await this.client.send(command);

      console.log('✅ SMS sent via AWS SNS:', result.MessageId);
      return { success: true, messageId: result.MessageId };

    } catch (error) {
      console.error('❌ AWS SNS Error:', error);
      
      // Fallback to console logging
      console.log('📱 Fallback: Logging SMS to console:');
      console.log(`📞 To: ${phoneNumber}`);
      console.log(`💬 Message: ${message}`);
      
      return { success: true, messageId: 'fallback-console', error: error.message };
    }
  }

  isConfigured() {
    return this._isConfigured;
  }
}

module.exports = new AWSSNSService(); 