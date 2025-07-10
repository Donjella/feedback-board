import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { getAllUsers } from '../controllers/userController.js'

const router = express.Router();

// Admin-only Routes
router.get('/users', protect, adminOnly, getAllUsers);


export default router;

