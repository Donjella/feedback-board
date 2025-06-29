const { app } = require('./server.js');
const dotenv = require ('dotenv');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT;

app.listen (PORT, () => {
    console.log(`Server is running on port ${PORT}!` )
});