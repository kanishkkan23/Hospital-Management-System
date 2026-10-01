import express from 'express';
import { prescriptionController } from '../controllers/prescriptionController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validatePrescriptionCreation } from '../validators/hmsValidators.js';

const router = express.Router();

router.get('/', authenticate, prescriptionController.getAll);
router.get('/:id', authenticate, prescriptionController.getById);
router.post('/', authenticate, requireRole(['Administrator', 'Doctor']), validatePrescriptionCreation, prescriptionController.create);
router.patch('/:id/dispense', authenticate, requireRole(['Administrator', 'Pharmacist']), prescriptionController.dispense);

export default router;
