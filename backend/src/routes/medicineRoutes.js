import express from 'express';
import { medicineController } from '../controllers/medicineController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', authenticate, medicineController.getAll);
router.get('/low-stock', authenticate, requireRole(['Administrator', 'Pharmacist']), medicineController.getLowStock);
router.get('/:id', authenticate, medicineController.getById);
router.post('/', authenticate, requireRole(['Administrator', 'Pharmacist']), medicineController.create);
router.put('/:id', authenticate, requireRole(['Administrator', 'Pharmacist']), medicineController.update);
router.patch('/:id/stock', authenticate, requireRole(['Administrator', 'Pharmacist']), medicineController.updateStock);

export default router;
