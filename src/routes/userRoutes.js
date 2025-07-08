const express = require('express');

const router = express.Router();

const { registerUser, loginUser } = require('../controllers/userController');

// Public Routes (No Authentication Required)
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
