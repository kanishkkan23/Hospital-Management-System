import { appointmentService } from '../services/appointmentService.js';
import { sendSuccess, sendNotFound } from '../utils/response.js';

export const appointmentController = {
  getAll: async (req, res, next) => {
    try {
      const appointments = await appointmentService.getAll(req.query);
      return sendSuccess(res, 200, 'Appointments retrieved successfully', appointments);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const appointment = await appointmentService.getById(req.params.id);
      if (!appointment) return sendNotFound(res, 'Appointment not found');
      return sendSuccess(res, 200, 'Appointment retrieved', appointment);
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const appointment = await appointmentService.create(req.body, req.user);
      return sendSuccess(res, 201, 'Appointment booked successfully', appointment);
    } catch (err) {
      next(err);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const { status } = req.body;
      const updated = await appointmentService.updateStatus(req.params.id, status, req.user);
      if (!updated) return sendNotFound(res, 'Appointment not found');
      return sendSuccess(res, 200, `Appointment marked as ${status}`, updated);
    } catch (err) {
      next(err);
    }
  },

  reschedule: async (req, res, next) => {
    try {
      const { date, time } = req.body;
      const updated = await appointmentService.reschedule(req.params.id, date, time, req.user);
      if (!updated) return sendNotFound(res, 'Appointment not found');
      return sendSuccess(res, 200, 'Appointment rescheduled successfully', updated);
    } catch (err) {
      next(err);
    }
  },

  cancel: async (req, res, next) => {
    try {
      const { reason } = req.body;
      const cancelled = await appointmentService.cancel(req.params.id, reason, req.user);
      if (!cancelled) return sendNotFound(res, 'Appointment not found');
      return sendSuccess(res, 200, 'Appointment cancelled successfully', cancelled);
    } catch (err) {
      next(err);
    }
  }
};
