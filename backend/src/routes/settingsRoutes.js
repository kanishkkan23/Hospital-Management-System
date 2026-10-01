import express from 'express';
import { settingsController } from '../controllers/settingsController.js';
import { authenticate, optionalAuthenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', optionalAuthenticate, settingsController.getSettings);
router.put('/', authenticate, requireRole(['Administrator']), settingsController.updateSettings);
router.get('/activity-logs', authenticate, requireRole(['Administrator']), settingsController.getActivityLogs);

export default router;
