import { prescriptionService } from '../services/prescriptionService.js';
import { sendSuccess, sendNotFound } from '../utils/response.js';

export const prescriptionController = {
  getAll: async (req, res, next) => {
    try {
      const prescriptions = await prescriptionService.getAll(req.query);
      return sendSuccess(res, 200, 'Prescriptions retrieved', prescriptions);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const prescription = await prescriptionService.getById(req.params.id);
      if (!prescription) return sendNotFound(res, 'Prescription not found');
      return sendSuccess(res, 200, 'Prescription retrieved', prescription);
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const created = await prescriptionService.create(req.body, req.user);
      return sendSuccess(res, 201, 'Prescription created successfully', created);
    } catch (err) {
      next(err);
    }
  },

  dispense: async (req, res, next) => {
    try {
      const dispensed = await prescriptionService.dispense(req.params.id, req.user);
      return sendSuccess(res, 200, 'Prescription medicines dispensed and stock deducted', dispensed);
    } catch (err) {
      next(err);
    }
  }
};
