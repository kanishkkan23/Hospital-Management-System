import { settingsService } from '../services/settingsService.js';
import { sendSuccess } from '../utils/response.js';

export const settingsController = {
  getSettings: async (req, res, next) => {
    try {
      const settings = await settingsService.getSettings();
      return sendSuccess(res, 200, 'Hospital settings retrieved', settings);
    } catch (err) {
      next(err);
    }
  },

  updateSettings: async (req, res, next) => {
    try {
      const updated = await settingsService.updateSettings(req.body);
      return sendSuccess(res, 200, 'Hospital settings updated successfully', updated);
    } catch (err) {
      next(err);
    }
  },

  getActivityLogs: async (req, res, next) => {
    try {
      const logs = await settingsService.getActivityLogs();
      return sendSuccess(res, 200, 'System activity logs retrieved', logs);
    } catch (err) {
      next(err);
    }
  }
};
