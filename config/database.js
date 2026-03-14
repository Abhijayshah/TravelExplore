const mongoose = require('mongoose');

// Cache the connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      return null;
    }
    console.log('⚠️  Using local MongoDB fallback for development');
  }

  const uri = mongoURI || 'mongodb://localhost:27017/travelexplore';

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    console.log('🔄 Connecting to MongoDB...');
    cached.promise = mongoose.connect(uri, options).then((mongoose) => {
      console.log(`🍃 MongoDB Connected: ${mongoose.connection.host}`);
      return mongoose;
    }).catch(err => {
      console.error('❌ MongoDB connection failed:', err.message);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

// Health check function
const checkDBHealth = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  return {
    status: states[state],
    host: mongoose.connection.host,
    name: mongoose.connection.name,
    collections: Object.keys(mongoose.connection.collections).length
  };
};

module.exports = {
  connectDB,
  checkDBHealth
};