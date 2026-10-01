import { doctorAvailabilityService } from '../services/doctorAvailabilityService.js';
import { sendSuccess, sendNotFound } from '../utils/response.js';

export const doctorAvailabilityController = {
  getAll: async (req, res, next) => {
    try {
      const availabilities = await doctorAvailabilityService.getAllAvailabilities();
      return sendSuccess(res, 200, 'All doctor availabilities retrieved', availabilities);
    } catch (err) {
      next(err);
    }
  },

  getByDoctorId: async (req, res, next) => {
    try {
      const availability = await doctorAvailabilityService.getAvailabilityByDoctor(req.params.doctorId);
      if (!availability) return sendNotFound(res, 'Doctor availability not found');
      return sendSuccess(res, 200, 'Doctor availability retrieved', availability);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const updated = await doctorAvailabilityService.updateAvailability(req.params.doctorId, req.body);
      if (!updated) return sendNotFound(res, 'Doctor not found to update availability');
      return sendSuccess(res, 200, 'Doctor availability updated', updated);
    } catch (err) {
      next(err);
    }
  }
};
