import { medicalRecordService } from '../services/medicalRecordService.js';
import { sendSuccess, sendNotFound } from '../utils/response.js';

export const medicalRecordController = {
  getAll: async (req, res, next) => {
    try {
      const records = await medicalRecordService.getAll(req.query);
      return sendSuccess(res, 200, 'Medical records retrieved', records);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const record = await medicalRecordService.getById(req.params.id);
      if (!record) return sendNotFound(res, 'Medical record not found');
      return sendSuccess(res, 200, 'Medical record retrieved', record);
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const created = await medicalRecordService.create(req.body, req.user);
      return sendSuccess(res, 201, 'Medical consultation record created', created);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const updated = await medicalRecordService.update(req.params.id, req.body);
      if (!updated) return sendNotFound(res, 'Medical record not found');
      return sendSuccess(res, 200, 'Medical record updated', updated);
    } catch (err) {
      next(err);
    }
  },

  getPatientHistory: async (req, res, next) => {
    try {
      const history = await medicalRecordService.getPatientHistory(req.params.patientId);
      return sendSuccess(res, 200, 'Patient full medical history retrieved', history);
    } catch (err) {
      next(err);
    }
  }
};
