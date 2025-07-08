const express = require('express');
const app = express();

// Import routes
const userRoutes = require('./routes/userRoutes');

// Middleware to parse JSON request bodies
// Must be added BEFORE mounting API routes
// Otherwise, req.body will be undefined and destructuring will throw an error
app.use(express.json());

// Mount API routes
app.use('/users', userRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Hello, welcome to feedback station!',
  });
});

module.exports = { app };
