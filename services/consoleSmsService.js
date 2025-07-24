class ConsoleSmsService {
  async sendOTP(phoneNumber, otp) {
    console.log(`📱 [SMS] OTP sent to ${phoneNumber}: ${otp}`);
    console.log(`📱 [SMS] Message: "Your ExpressAid verification code is: ${otp}. Valid for 10 minutes."`);
    
    return {
      success: true,
      message: 'OTP logged to console (development mode)',
      provider: 'console'
    };
  }

  async sendWelcomeMessage(phoneNumber, userName) {
    console.log(`📱 [SMS] Welcome message sent to ${phoneNumber}`);
    console.log(`📱 [SMS] Message: "Welcome to ExpressAid, ${userName}! Your account has been successfully created."`);
    
    return {
      success: true,
      message: 'Welcome message logged to console (development mode)',
      provider: 'console'
    };
  }

  async sendOrderConfirmation(phoneNumber, orderDetails) {
    console.log(`📱 [SMS] Order confirmation sent to ${phoneNumber}`);
    console.log(`📱 [SMS] Message: "Your ExpressAid order #${orderDetails.orderId} has been confirmed. Total: ₹${orderDetails.total}. Expected delivery: ${orderDetails.estimatedDelivery}"`);
    
    return {
      success: true,
      message: 'Order confirmation logged to console (development mode)',
      provider: 'console'
    };
  }
}

module.exports = new ConsoleSmsService(); 