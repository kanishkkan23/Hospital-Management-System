import express from 'express';
import { billingController } from '../controllers/billingController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validateBillCreation } from '../validators/hmsValidators.js';

const router = express.Router();

router.get('/', authenticate, billingController.getAll);
router.get('/:id', authenticate, billingController.getById);
router.post('/', authenticate, requireRole(['Administrator', 'Receptionist']), validateBillCreation, billingController.create);
router.patch('/:id/status', authenticate, requireRole(['Administrator', 'Receptionist']), billingController.updateStatus);

export default router;
