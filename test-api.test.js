const axios = require('axios');
const request = require('supertest');
const app = require('./server'); // Corrected path for Express app
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('Testing ExpressAid Backend API...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log('');

    // Test send OTP
    console.log('2. Testing send OTP...');
    const sendOTPResponse = await axios.post(`${BASE_URL}/auth/send-otp`, {
      phoneNumber: '+1234567890'
    });
    console.log('✅ OTP sent successfully:', sendOTPResponse.data);
    console.log('');

    // Test verify OTP (using the OTP from the response)
    const otp = sendOTPResponse.data.otp;
    if (otp) {
      console.log('3. Testing verify OTP...');
      const verifyOTPResponse = await axios.post(`${BASE_URL}/auth/verify-otp`, {
        phoneNumber: '+1234567890',
        otp: otp
      });
      console.log('✅ OTP verified successfully:', verifyOTPResponse.data);
      
      const token = verifyOTPResponse.data.token;
      console.log('');

      // Test get current user
      console.log('4. Testing get current user...');
      const userResponse = await axios.get(`${BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ User data retrieved:', userResponse.data);
      console.log('');

      // Test update profile
      console.log('5. Testing update profile...');
      const updateProfileResponse = await axios.post(`${BASE_URL}/auth/update-profile`, {
        name: 'John Doe',
        dateOfBirth: '1990-01-01'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Profile updated successfully:', updateProfileResponse.data);
      console.log('');

      // Test add address
      console.log('6. Testing add address...');
      const addAddressResponse = await axios.post(`${BASE_URL}/users/addresses`, {
        type: 'home',
        address: '123 Main Street',
        landmark: 'Near Park',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
        isDefault: true
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Address added successfully:', addAddressResponse.data);
      console.log('');

      // Test get addresses
      console.log('7. Testing get addresses...');
      const getAddressesResponse = await axios.get(`${BASE_URL}/users/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Addresses retrieved:', getAddressesResponse.data);
      console.log('');

      console.log('🎉 All API tests passed successfully!');
    } else {
      console.log('⚠️ OTP not returned in response (check if NODE_ENV=development)');
    }

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

testAPI();

describe('User Cart and Address API', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Register or login a test user and get token
    // You may need to adjust this based on your auth flow
    const phoneNumber = '+910000000001';
    // Simulate OTP verification or use a test endpoint
    // For now, assume a test token is generated for userId 'testuser1'
    userId = 'testuser1';
    token = jwt.sign({ userId }, require('./config').jwtSecret);
    // Create user in DB if not exists
    let user = await User.findOne({ userId });
    if (!user) {
      user = new User({ userId, phoneNumber });
      await user.save();
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should save and retrieve cart', async () => {
    const cart = [
      { productId: 'p1', name: 'Test Product', quantity: 2, price: 100 },
      { productId: 'p2', name: 'Another Product', quantity: 1, price: 50 }
    ];
    // Save cart
    const saveRes = await request(app)
      .post('/api/users/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ cart });
    expect(saveRes.statusCode).toBe(200);
    expect(saveRes.body.cart.length).toBe(2);
    // Get cart
    const getRes = await request(app)
      .get('/api/users/cart')
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.cart.length).toBe(2);
    expect(getRes.body.cart[0].name).toBe('Test Product');
  });

  it('should save and retrieve addresses', async () => {
    const address = {
      type: 'home',
      address: '123 Test St',
      latitude: 12.34,
      longitude: 56.78,
      landmark: 'Near Park',
      city: 'Testville',
      state: 'TS',
      pincode: '123456',
      isDefault: true
    };
    // Save address
    const saveRes = await request(app)
      .post('/api/users/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send(address);
    expect(saveRes.statusCode).toBe(200);
    expect(saveRes.body.address.address).toBe('123 Test St');
    // Get addresses
    const getRes = await request(app)
      .get('/api/users/addresses')
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.addresses.length).toBeGreaterThan(0);
  });
}); 