import { doctorService } from '../services/doctorService.js';
import { sendSuccess, sendNotFound } from '../utils/response.js';

export const doctorController = {
  getAll: async (req, res, next) => {
    try {
      const doctors = await doctorService.getAll();
      return sendSuccess(res, 200, 'Doctors retrieved successfully', doctors);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const doctor = await doctorService.getById(req.params.id);
      if (!doctor) return sendNotFound(res, 'Doctor not found');
      return sendSuccess(res, 200, 'Doctor retrieved', doctor);
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const created = await doctorService.create(req.body);
      return sendSuccess(res, 201, 'Doctor created successfully', created);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const updated = await doctorService.update(req.params.id, req.body);
      if (!updated) return sendNotFound(res, 'Doctor not found');
      return sendSuccess(res, 200, 'Doctor updated successfully', updated);
    } catch (err) {
      next(err);
    }
  },

  getAvailability: async (req, res, next) => {
    try {
      const availability = await doctorService.getAvailability(req.params.id);
      return sendSuccess(res, 200, 'Doctor availability retrieved', availability);
    } catch (err) {
      next(err);
    }
  }
};
