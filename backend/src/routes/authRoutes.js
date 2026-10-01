import express from 'express';
import { authController } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', authenticate, authController.getMe);
router.get('/profile', authenticate, authController.getProfile);
router.post('/logout', authController.logout);

export default router;
