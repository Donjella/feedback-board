import express from 'express';
import {
  registerUser,
  loginUser,
  deleteOwnAccount,
  getUserProfile,
  updateOwnAccount
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes (No Authentication Required)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes (Only logged-in users)
router.get('/profile', protect, getUserProfile);
router.delete('/me', protect, deleteOwnAccount);
router.patch('/update', protect, updateOwnAccount);

export default router;
