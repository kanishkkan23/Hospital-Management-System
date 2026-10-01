import { medicineService } from '../services/medicineService.js';
import { sendSuccess, sendNotFound } from '../utils/response.js';

export const medicineController = {
  getAll: async (req, res, next) => {
    try {
      const medicines = await medicineService.getAll(req.query);
      return sendSuccess(res, 200, 'Medicines retrieved', medicines);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const medicine = await medicineService.getById(req.params.id);
      if (!medicine) return sendNotFound(res, 'Medicine not found');
      return sendSuccess(res, 200, 'Medicine retrieved', medicine);
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const created = await medicineService.create(req.body);
      return sendSuccess(res, 201, 'Medicine added to inventory', created);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const updated = await medicineService.update(req.params.id, req.body);
      if (!updated) return sendNotFound(res, 'Medicine not found');
      return sendSuccess(res, 200, 'Medicine updated successfully', updated);
    } catch (err) {
      next(err);
    }
  },

  updateStock: async (req, res, next) => {
    try {
      const { quantity, operation } = req.body;
      const updated = await medicineService.updateStock(req.params.id, quantity, operation);
      if (!updated) return sendNotFound(res, 'Medicine not found');
      return sendSuccess(res, 200, 'Medicine stock updated', updated);
    } catch (err) {
      next(err);
    }
  },

  getLowStock: async (req, res, next) => {
    try {
      const lowStock = await medicineService.getLowStock();
      return sendSuccess(res, 200, 'Low stock medicines retrieved', lowStock);
    } catch (err) {
      next(err);
    }
  }
};
