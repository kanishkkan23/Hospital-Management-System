import { profileService } from '../services/profileService.js';
import { sendSuccess, sendNotFound, sendError } from '../utils/response.js';

export const profileController = {
  getAll: async (req, res, next) => {
    try {
      const profiles = await profileService.getAllProfiles();
      return sendSuccess(res, 200, 'Profiles retrieved successfully', profiles);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const profile = await profileService.getProfileById(req.params.id);
      if (!profile) return sendNotFound(res, 'Profile not found');
      return sendSuccess(res, 200, 'Profile retrieved', profile);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const updated = await profileService.updateProfile(req.params.id, req.body);
      if (!updated) return sendNotFound(res, 'Profile not found');
      return sendSuccess(res, 200, 'Profile updated successfully', updated);
    } catch (err) {
      next(err);
    }
  },

  getStaffUsers: async (req, res, next) => {
    try {
      const staff = await profileService.getStaffUsers();
      return sendSuccess(res, 200, 'Staff members retrieved', staff);
    } catch (err) {
      next(err);
    }
  }
};
