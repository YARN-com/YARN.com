const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Security middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Prevent parameter pollution
app.use((req, res, next) => {
  // Simple parameter pollution prevention
  for (const key in req.query) {
    if (Array.isArray(req.query[key])) {
      req.query[key] = req.query[key][req.query[key].length - 1];
    }
  }
  next();
});

// Routes
const threadsRoutes = require('./routes/threads');
const strandsRoutes = require('./routes/strands');

app.use('/api/threads', threadsRoutes);
app.use('/api/strands', strandsRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to YARN.com - Community Story Threads API' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      message: 'Invalid JSON format',
      error: 'Malformed request body'
    });
  }
  
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      message: 'Request entity too large',
      error: 'Payload exceeds maximum size limit'
    });
  }
  
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yarn-community-threads';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
