import express from 'express';
import { labController } from '../controllers/labController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validateLabTestCreation, validateLabReportCompletion } from '../validators/hmsValidators.js';

const router = express.Router();

// Tests
router.get('/tests', authenticate, labController.getTests);
router.get('/tests/:id', authenticate, labController.getTestById);
router.post('/tests', authenticate, requireRole(['Administrator', 'Doctor']), validateLabTestCreation, labController.createTest);
router.patch('/tests/:id/start', authenticate, requireRole(['Administrator', 'Lab Technician']), labController.startTest);

// Reports
router.get('/reports', authenticate, labController.getReports);
router.post('/reports', authenticate, requireRole(['Administrator', 'Lab Technician']), validateLabReportCompletion, labController.completeReport);

export default router;
