const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');

let isFallback = false;
let mongoServer = null;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  
  // If MONGO_URI is explicitly provided (Production / Cloud Database)
  if (mongoURI) {
    try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(mongoURI);
      console.log('MongoDB: Connected to production database (MongoDB Atlas).');
      isFallback = false;
      return;
    } catch (err) {
      console.error('MongoDB production connection error:', err.message);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1); // Fail loud in production
      }
      console.log('Local Development: Falling back to local/in-memory database due to connection error...');
    }
  }
  
  // Local Development Fallback logic
  const localURI = 'mongodb://127.0.0.1:27017/kursath-foundation';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(localURI, {
      serverSelectionTimeoutMS: 1500 // Quick timeout to check if standard local MongoDB is up
    });
    console.log('MongoDB: Connected to local instance via Mongoose.');
    isFallback = false;
    return;
  } catch (err) {
    console.log('MongoDB: External instance not running. Starting in-memory local MongoDB server...');
  }

  // If standard MongoDB is not running, start mongodb-memory-server with a smaller binary version
  try {
    mongoServer = await MongoMemoryServer.create({
      binary: {
        version: '4.4.24' // Use 4.4.24 (approx 75MB download) instead of 8.x (approx 780MB download)
      },
      instance: {
        dbName: 'kursath-foundation',
        port: 27017 // Attempt standard port, or will auto-assign if blocked
      }
    });
    
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log(`MongoDB: Connected to self-contained in-memory database server at ${uri}`);
    isFallback = false;
  } catch (err) {
    console.error('MongoDB: In-memory local server failed to start:', err.message);
    console.log('WARNING: Falling back to local JSON file storage (data_fallback.json).');
    isFallback = true;
    
    // Ensure fallback file exists
    const fallbackPath = path.join(__dirname, '..', 'data_fallback.json');
    if (!fs.existsSync(fallbackPath)) {
      const initialData = {
        opportunities: [],
        volunteers: [],
        messages: [],
        users: []
      };
      fs.writeFileSync(fallbackPath, JSON.stringify(initialData, null, 2));
    }
  }
};

const getFallbackStatus = () => isFallback;

module.exports = { connectDB, getFallbackStatus };
