const crypto = require('crypto');

// Generate a secure random JWT secret
const generateJWTSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Generate a secure secret
const jwtSecret = generateJWTSecret();

console.log('🔐 Generated JWT Secret:');
console.log('========================');
console.log(jwtSecret);
console.log('');
console.log('📝 Add this to your .env file:');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('');
console.log('⚠️  Keep this secret secure and never share it!'); 