import express from 'express';
import { appointmentController } from '../controllers/appointmentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validateAppointmentCreation } from '../validators/hmsValidators.js';

const router = express.Router();

router.get('/', authenticate, appointmentController.getAll);
router.get('/:id', authenticate, appointmentController.getById);
router.post('/', authenticate, validateAppointmentCreation, appointmentController.create);
router.patch('/:id/status', authenticate, requireRole(['Administrator', 'Doctor', 'Receptionist']), appointmentController.updateStatus);
router.patch('/:id/reschedule', authenticate, requireRole(['Administrator', 'Receptionist', 'Doctor', 'Patient']), appointmentController.reschedule);
router.patch('/:id/cancel', authenticate, appointmentController.cancel);

export default router;
