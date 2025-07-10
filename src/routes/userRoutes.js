import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes (No Authentication Required)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes (Only logged-in users)
router.get('/profile', protect, getUserProfile);


export default router;
