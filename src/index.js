// index.js

import { app } from './server.js';
import dotenv from 'dotenv';
import { databaseConnect } from './database.js';

// Load environment variables
dotenv.config();

// Set port
const PORT = process.env.PORT || 5000;

// Connect to the database before starting the server
databaseConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}!`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); // Stop the server if the database fails to connect
  });
