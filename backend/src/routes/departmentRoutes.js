import express from 'express';
import { departmentController } from '../controllers/departmentController.js';
import { authenticate, optionalAuthenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', optionalAuthenticate, departmentController.getAll);
router.get('/:id', optionalAuthenticate, departmentController.getById);
router.post('/', authenticate, requireRole(['Administrator']), departmentController.create);
router.put('/:id', authenticate, requireRole(['Administrator']), departmentController.update);
router.delete('/:id', authenticate, requireRole(['Administrator']), departmentController.delete);

export default router;
