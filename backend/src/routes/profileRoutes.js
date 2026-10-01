import express from 'express';
import { profileController } from '../controllers/profileController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', authenticate, requireRole(['Administrator']), profileController.getAll);
router.get('/staff', authenticate, requireRole(['Administrator', 'Receptionist']), profileController.getStaffUsers);
router.get('/:id', authenticate, profileController.getById);
router.put('/:id', authenticate, profileController.update);

export default router;
