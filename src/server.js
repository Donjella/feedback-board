// server.js

import express from 'express';
import errorHandler from './middleware/errorHandler.js'
const app = express();

// Import routes
import userRoutes from './routes/userRoutes.js';

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

// 404 Handler for non-existent routes i.e.  Catch-all handler for routes not defined (404)
app.use((req, res) => {
  res.status(404).json(
    {
      success: false,
      message: `Route ${req.originalUrl} not found`,
    }
  )
});

app.use(errorHandler);

export { app };
