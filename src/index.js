const { app } = require('./server.js');
const dotenv = require ('dotenv');
const { databaseConnect } = require ('./database.js');

// Load environment variables
dotenv.config();

// Set port
const PORT = process.env.PORT || 5000;

// Connect to the database before starting the server
databaseConnect().then(() => {
    app.listen (PORT, () => {
    console.log(`Server is running on port ${PORT}!` )
    })
}).catch((error) => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); // Stop the server if the database fails to connect
})

