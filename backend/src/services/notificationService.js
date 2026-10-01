import db from '../lib/db.js';

export const notificationService = {
  getNotifications: async (profileId, role) => {
    return db.getNotifications(profileId, role);
  },

  createNotification: async (data) => {
    return db.createNotification(data);
  },

  markAsRead: async (id) => {
    return db.markNotificationRead(id);
  },

  markAllAsRead: async (role) => {
    return db.markAllNotificationsRead(role);
  }
};
