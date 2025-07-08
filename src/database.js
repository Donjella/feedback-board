const mongoose = require('mongoose');

async function databaseConnect(targetDatabaseURL = null) {
  console.log('Starting database connection');

  const actualDatabaseURL =
    targetDatabaseURL ||
    process.env.DATABASE_URL ||
    process.env.MONGO_URI ||
    'mongodb://localhost:27017/feedback_board_db';

  console.log(`Connecting to ${actualDatabaseURL}`);

  try {
    await mongoose.connect(actualDatabaseURL);
  } catch (error) {
    console.log('Database conection error', error);
    throw error;
  }
}

async function databaseDisconnect() {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    return true;
  } catch (error) {
    console.log('MongoDB disconnection error:', error);
    throw error;
  }
}

module.exports = { databaseConnect, databaseDisconnect };
