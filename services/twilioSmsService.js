const twilio = require('twilio');
const config = require('../config');

class TwilioSMSService {
  constructor() {
    console.log('🔧 Twilio Configuration Check:');
    console.log('Account SID:', config.twilio.accountSid);
    console.log('Auth Token:', config.twilio.authToken ? 'Set' : 'Not set');
    console.log('Phone Number:', config.twilio.phoneNumber);
    
    this._isConfigured = !!(config.twilio.accountSid && 
                           config.twilio.authToken && 
                           config.twilio.accountSid.startsWith('AC') &&
                           config.twilio.accountSid !== 'your_twilio_account_sid');
    
    console.log('Twilio configured:', this._isConfigured);
    
    if (this._isConfigured) {
      this.client = twilio(config.twilio.accountSid, config.twilio.authToken);
      this.fromNumber = config.twilio.phoneNumber;
      console.log('✅ Twilio client initialized');
    } else {
      console.log('❌ Twilio not properly configured');
    }
  }

  async sendSMS(phoneNumber, message) {
    try {
      if (!this._isConfigured) {
        console.log('❌ Twilio not configured, cannot send SMS');
        throw new Error('Twilio not configured');
      }

      console.log('📱 Sending SMS via Twilio...');
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: phoneNumber
      });

      console.log('✅ SMS sent via Twilio:', result.sid);
      return { success: true, messageId: result.sid };

    } catch (error) {
      console.error('❌ Twilio Error:', error);
      throw error; // Don't fallback to console, throw the error
    }
  }

  isConfigured() {
    return this._isConfigured;
  }
}

module.exports = new TwilioSMSService(); 