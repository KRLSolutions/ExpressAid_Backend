const app = require('./server');
const config = require('./config');
const mongoDBService = require('./models/MongoDBService');

const server = app.listen(config.port, '0.0.0.0', async () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`🌍 Environment: ${config.environment}`);
  console.log(`📱 SMS Provider: aws-sns`);

  // Connect to MongoDB if URI is provided
  if (config.mongodb.uri) {
    console.log('🗄️ Connecting to MongoDB Atlas...');
    await mongoDBService.connect();
  }

  console.log(`🗄️ Database: ${mongoDBService.isConnected() ? 'MongoDB Atlas' : 'In-Memory'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
}); 