import express from 'express';
import { doctorAvailabilityController } from '../controllers/doctorAvailabilityController.js';
import { authenticate, optionalAuthenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', optionalAuthenticate, doctorAvailabilityController.getAll);
router.get('/:doctorId', optionalAuthenticate, doctorAvailabilityController.getByDoctorId);
router.put('/:doctorId', authenticate, requireRole(['Administrator', 'Doctor']), doctorAvailabilityController.update);

export default router;
