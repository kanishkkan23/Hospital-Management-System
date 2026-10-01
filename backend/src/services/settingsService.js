import db from '../lib/db.js';

export const settingsService = {
  getSettings: async () => db.getSettings(),
  updateSettings: async (data) => db.updateSettings(data),
  getActivityLogs: async () => db.getActivityLogs()
};
