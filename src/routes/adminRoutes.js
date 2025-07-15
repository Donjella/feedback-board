import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { getAllUsers, AdminDeleteUser } from '../controllers/userController.js';

const router = express.Router();

// Admin-only Routes
router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, AdminDeleteUser);

export default router;
