import express from 'express';
import { doctorController } from '../controllers/doctorController.js';
import { authenticate, optionalAuthenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', optionalAuthenticate, doctorController.getAll);
router.get('/:id', optionalAuthenticate, doctorController.getById);
router.get('/:id/availability', optionalAuthenticate, doctorController.getAvailability);
router.post('/', authenticate, requireRole(['Administrator']), doctorController.create);
router.put('/:id', authenticate, requireRole(['Administrator', 'Doctor']), doctorController.update);

export default router;
