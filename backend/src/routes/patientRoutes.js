import express from 'express';
import { patientController } from '../controllers/patientController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole, requireSelfOrStaff } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', authenticate, requireRole(['Administrator', 'Doctor', 'Receptionist', 'Lab Technician', 'Pharmacist']), patientController.getAll);
router.get('/:id', authenticate, requireSelfOrStaff('id'), patientController.getById);
router.post('/', authenticate, requireRole(['Administrator', 'Receptionist']), patientController.create);
router.put('/:id', authenticate, requireSelfOrStaff('id'), patientController.update);
router.get('/:id/appointments', authenticate, requireSelfOrStaff('id'), patientController.getAppointments);
router.get('/:id/prescriptions', authenticate, requireSelfOrStaff('id'), patientController.getPrescriptions);
router.get('/:id/lab-reports', authenticate, requireSelfOrStaff('id'), patientController.getLabReports);
router.get('/:id/bills', authenticate, requireSelfOrStaff('id'), patientController.getBills);

export default router;
