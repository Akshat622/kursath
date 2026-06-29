const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Routes
app.use('/api/opportunities', require('./routes/opportunities'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/auth', require('./routes/auth'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Kursath Foundation API' });
});

module.exports = app;
