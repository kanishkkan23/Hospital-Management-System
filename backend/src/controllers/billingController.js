import { billingService } from '../services/billingService.js';
import { sendSuccess, sendNotFound } from '../utils/response.js';

export const billingController = {
  getAll: async (req, res, next) => {
    try {
      const bills = await billingService.getAll(req.query);
      return sendSuccess(res, 200, 'Bills retrieved', bills);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const bill = await billingService.getById(req.params.id);
      if (!bill) return sendNotFound(res, 'Bill not found');
      return sendSuccess(res, 200, 'Bill retrieved', bill);
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const created = await billingService.create(req.body, req.user);
      return sendSuccess(res, 201, 'Bill generated successfully', created);
    } catch (err) {
      next(err);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const { status } = req.body;
      const updated = await billingService.updateStatus(req.params.id, status, req.user);
      if (!updated) return sendNotFound(res, 'Bill not found');
      return sendSuccess(res, 200, `Bill status updated to ${status}`, updated);
    } catch (err) {
      next(err);
    }
  }
};
