import express from 'express';
import { medicalRecordController } from '../controllers/medicalRecordController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validateMedicalRecordCreation } from '../validators/hmsValidators.js';

const router = express.Router();

router.get('/', authenticate, medicalRecordController.getAll);
router.get('/patient/:patientId', authenticate, medicalRecordController.getPatientHistory);
router.get('/:id', authenticate, medicalRecordController.getById);
router.post('/', authenticate, requireRole(['Administrator', 'Doctor']), validateMedicalRecordCreation, medicalRecordController.create);
router.put('/:id', authenticate, requireRole(['Administrator', 'Doctor']), medicalRecordController.update);

export default router;
