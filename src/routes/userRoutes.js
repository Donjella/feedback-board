const express = require('express');

const router = express.Router();

const { registerUser } = require('../controllers/userController');

// Public Routes (No Authentication Required)
router.post('/register', registerUser);

module.exports = router;
