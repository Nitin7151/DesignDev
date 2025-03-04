import express from 'express';
import authRoutes from './authRoutes';
import aiRoutes from './aiRoutes';
import { protect } from '../middleware/auth';

const router = express.Router();

// Auth routes
router.use('/auth', authRoutes);

// AI routes
router.use('/ai', aiRoutes);

// Protected routes example
router.get('/protected', protect, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

export default router;
