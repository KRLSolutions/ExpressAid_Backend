const twilio = require('twilio');
const config = require('../config');

class TwilioSMSService {
  constructor() {
    this._isConfigured = !!(config.twilio.accountSid && 
                           config.twilio.authToken && 
                           config.twilio.accountSid.startsWith('AC') &&
                           config.twilio.accountSid !== 'your_twilio_account_sid');
    
    if (this._isConfigured) {
      this.client = twilio(config.twilio.accountSid, config.twilio.authToken);
      this.fromNumber = config.twilio.phoneNumber;
    }
  }

  async sendSMS(phoneNumber, message) {
    try {
      if (!this._isConfigured) {
        console.log('📱 Twilio not configured, logging SMS to console:');
        console.log(`📞 To: ${phoneNumber}`);
        console.log(`💬 Message: ${message}`);
        return { success: true, messageId: 'console-log' };
      }

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: phoneNumber
      });

      console.log('✅ SMS sent via Twilio:', result.sid);
      return { success: true, messageId: result.sid };

    } catch (error) {
      console.error('❌ Twilio Error:', error);
      
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

module.exports = new TwilioSMSService(); 