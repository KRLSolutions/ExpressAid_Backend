/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");

// Import Express app
const express = require('express');
const cors = require('cors');

// Import MongoDB service
const mongoDBService = require('./models/MongoDBService');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const nurseAuthRoutes = require('./routes/nurseAuth');
const placesRoutes = require('./routes/places');
const mapsRoutes = require('./routes/maps');
const cashfreeRoutes = require('./routes/cashfree');
const upiRoutes = require('./routes/upi');
const geminiRoutes = require('./routes/gemini');

const app = express();

// Initialize MongoDB connection
(async () => {
  try {
    await mongoDBService.connect();
    console.log('✅ MongoDB initialized in Firebase Functions');
  } catch (error) {
    console.error('❌ Failed to initialize MongoDB:', error);
  }
})();

// CORS configuration
app.use(cors({ origin: true }));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'ExpressAid Backend is running on Firebase Functions',
    environment: 'production',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    ok: true, 
    message: 'Firebase Functions is working!'
  });
});

// ===== ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/nurse', nurseAuthRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/maps', mapsRoutes);
app.use('/api/cashfree', cashfreeRoutes);
app.use('/api/upi', upiRoutes);
app.use('/api/gemini', geminiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export the Express app as a Firebase Function
exports.expressaid = functions.https.onRequest(app);
