const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoDBService = require('./models/MongoDBService');
const awsSnsService = require('./services/awsSnsService');
const config = require('./config');
const bodyParser = require('body-parser');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://192.168.0.3:3000', 
    'exp://192.168.0.3:8081',
    'http://10.0.2.2:5000',  // Android emulator localhost
    'http://localhost:5000',  // Local development
    'exp://localhost:8081'    // Expo development
  ],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoDBService.getConnectionStatus();
  
  res.json({
    status: 'OK',
    message: 'ExpressAid Backend is running',
    environment: config.environment,
    database: {
      type: dbStatus.isConnected ? 'MongoDB Atlas' : 'In-Memory',
      status: dbStatus.isConnected ? 'Connected' : 'Fallback',
      host: dbStatus.host || 'Local'
    },
    sms: {
      provider: 'aws-sns',
      configured: awsSnsService.isConfigured()
    },
    timestamp: new Date().toISOString()
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'operational',
    services: {
      database: mongoDBService.isConnected() ? 'connected' : 'fallback',
      sms: awsSnsService.isConfigured() ? 'configured' : 'console-only',
      auth: 'active'
    },
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Add a test route to verify backend connectivity
app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.json({ ok: true });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/nurse-auth', require('./routes/nurseAuth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/places', require('./routes/places'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/maps', require('./routes/maps'));

// Import and use the Gemini chat route
const geminiChat = require('./routes/gemini');
app.use(geminiChat);

// Add a route to list available Gemini models for debugging
app.get('/api/gemini-models', async (req, res) => {
  const fetch = require('node-fetch');
  const GEMINI_API_KEY = 'AIzaSyB1FMtySEgCcfYDQHClv9M3Yj7e9JPJ5z4';
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Import and use the cashfree route
const cashfree = require('./routes/cashfree');
app.use('/api', cashfree);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Set your Gemini API key in the environment: process.env.GEMINI_API_KEY

const PORT = config.port;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; 