const mongoose = require('mongoose');
const config = require('../config');

class MongoDBService {
  constructor() {
    this._isConnected = false;
    this.connectionString = config.mongodb.uri;
  }

  async connect() {
    try {
      if (this._isConnected) {
        console.log('MongoDB already connected');
        return;
      }

      if (!this.connectionString) {
        console.log('MongoDB URI not provided, using in-memory database');
        return;
      }

      console.log('🔌 Attempting to connect to MongoDB Atlas...');
      console.log('⏳ Connection string found, connecting...');

      await mongoose.connect(this.connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });

      this._isConnected = true;
      console.log('✅ Connected to MongoDB Atlas');
      console.log(`📍 Host: ${mongoose.connection.host}`);
      console.log(`🗃️  Database: ${mongoose.connection.name}`);

      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        this._isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
        this._isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected');
        this._isConnected = true;
      });

    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error.message);
      console.error('Error details:', error);
      this._isConnected = false;
    }
  }

  async disconnect() {
    try {
      if (this._isConnected) {
        await mongoose.disconnect();
        this._isConnected = false;
        console.log('MongoDB disconnected');
      }
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
    }
  }

  isConnected() {
    return this._isConnected && mongoose.connection.readyState === 1;
  }

  getConnectionStatus() {
    return {
      isConnected: this._isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    };
  }
}

module.exports = new MongoDBService(); 