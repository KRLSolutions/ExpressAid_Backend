const config = require('../config');
const twilioSmsService = require('./twilioSmsService');
const awsSnsService = require('./awsSnsService');
const consoleSmsService = require('./consoleSmsService');

class SmsServiceFactory {
  static getSmsService() {
    const serviceType = config.SMS_SERVICE || 'console';
    
    console.log(`📱 SMS Service Factory: Using ${serviceType} provider`);
    
    switch (serviceType.toLowerCase()) {
      case 'twilio':
        if (twilioSmsService.isConfigured()) {
          console.log('✅ Twilio SMS service is configured and ready');
          return {
            service: twilioSmsService,
            provider: 'twilio'
          };
        } else {
          console.log('⚠️ Twilio not configured, falling back to console');
          return {
            service: consoleSmsService,
            provider: 'console'
          };
        }
        
      case 'aws-sns':
        if (awsSnsService.isConfigured()) {
          console.log('✅ AWS SNS service is configured and ready');
          return {
            service: awsSnsService,
            provider: 'aws-sns'
          };
        } else {
          console.log('⚠️ AWS SNS not configured, falling back to console');
          return {
            service: consoleSmsService,
            provider: 'console'
          };
        }
        
      case 'console':
      default:
        console.log('📝 Using console SMS service (development mode)');
        return {
          service: consoleSmsService,
          provider: 'console'
        };
    }
  }
  
  static async sendSMS(phoneNumber, message) {
    const { service, provider } = this.getSmsService();
    
    try {
      let result;
      
      if (provider === 'console') {
        // For console service, we need to extract OTP from message
        const otpMatch = message.match(/(\d{6})/);
        const otp = otpMatch ? otpMatch[1] : '000000';
        result = await service.sendOTP(phoneNumber, otp);
        return {
          success: true,
          messageId: 'console-log',
          provider: 'console'
        };
      } else {
        // For Twilio and AWS SNS
        result = await service.sendSMS(phoneNumber, message);
        return {
          success: result.success,
          messageId: result.messageId,
          provider: provider
        };
      }
    } catch (error) {
      console.error(`❌ Error sending SMS via ${provider}:`, error);
      return {
        success: false,
        messageId: 'error',
        provider: provider,
        error: error.message
      };
    }
  }
}

module.exports = SmsServiceFactory; 