const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { seedIfEmpty } = require('./config/seedHelper');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/opportunities', require('./routes/opportunities'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/auth', require('./routes/auth'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Kursath Foundation API' });
});

const startServer = async () => {
  // 1. Connect to Database (with memory-server auto-startup)
  await connectDB();

  // 2. Perform Automatic Database Seeding if empty
  await seedIfEmpty();

  // 3. Start Server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
