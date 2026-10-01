import { patientService } from '../services/patientService.js';
import { sendSuccess, sendNotFound } from '../utils/response.js';

export const patientController = {
  getAll: async (req, res, next) => {
    try {
      const patients = await patientService.getAll();
      return sendSuccess(res, 200, 'Patients retrieved successfully', patients);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const patient = await patientService.getById(req.params.id);
      if (!patient) return sendNotFound(res, 'Patient not found');
      return sendSuccess(res, 200, 'Patient retrieved', patient);
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const created = await patientService.create(req.body);
      return sendSuccess(res, 201, 'Patient registered successfully', created);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const updated = await patientService.update(req.params.id, req.body);
      if (!updated) return sendNotFound(res, 'Patient not found');
      return sendSuccess(res, 200, 'Patient updated successfully', updated);
    } catch (err) {
      next(err);
    }
  },

  getAppointments: async (req, res, next) => {
    try {
      const appointments = await patientService.getAppointments(req.params.id);
      return sendSuccess(res, 200, 'Patient appointments retrieved', appointments);
    } catch (err) {
      next(err);
    }
  },

  getPrescriptions: async (req, res, next) => {
    try {
      const prescriptions = await patientService.getPrescriptions(req.params.id);
      return sendSuccess(res, 200, 'Patient prescriptions retrieved', prescriptions);
    } catch (err) {
      next(err);
    }
  },

  getLabReports: async (req, res, next) => {
    try {
      const reports = await patientService.getLabReports(req.params.id);
      return sendSuccess(res, 200, 'Patient lab reports retrieved', reports);
    } catch (err) {
      next(err);
    }
  },

  getBills: async (req, res, next) => {
    try {
      const bills = await patientService.getBills(req.params.id);
      return sendSuccess(res, 200, 'Patient bills retrieved', bills);
    } catch (err) {
      next(err);
    }
  }
};
