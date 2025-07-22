class ConsoleSMSService {
  constructor() {
    this._isConfigured = true;
  }

  async sendSMS(phoneNumber, message) {
    try {
      console.log('\n' + '='.repeat(60));
      console.log('📱 SMS SENT (Console Mode)');
      console.log('='.repeat(60));
      console.log(`📞 To: ${phoneNumber}`);
      console.log(`💬 Message: ${message}`);
      console.log('='.repeat(60));
      console.log('⚠️  IMPORTANT: This is console mode - no real SMS sent');
      console.log('   For testing, use the OTP code shown above');
      console.log('='.repeat(60) + '\n');

      return { success: true, messageId: 'console-sms-' + Date.now() };

    } catch (error) {
      console.error('❌ Console SMS Error:', error);
      return { success: false, messageId: 'error', error: error.message };
    }
  }

  isConfigured() {
    return this._isConfigured;
  }
}

module.exports = new ConsoleSMSService(); 