import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

// Public Routes (No Authentication Required)
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
