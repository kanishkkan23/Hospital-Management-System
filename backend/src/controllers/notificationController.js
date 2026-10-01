import { notificationService } from '../services/notificationService.js';
import { sendSuccess, sendNotFound } from '../utils/response.js';

export const notificationController = {
  getAll: async (req, res, next) => {
    try {
      const profileId = req.user?.profileId;
      const role = req.user?.role;
      const notifications = await notificationService.getNotifications(profileId, role);
      return sendSuccess(res, 200, 'Notifications retrieved', notifications);
    } catch (err) {
      next(err);
    }
  },

  markAsRead: async (req, res, next) => {
    try {
      const notif = await notificationService.markAsRead(req.params.id);
      if (!notif) return sendNotFound(res, 'Notification not found');
      return sendSuccess(res, 200, 'Notification marked as read', notif);
    } catch (err) {
      next(err);
    }
  },

  markAllAsRead: async (req, res, next) => {
    try {
      const role = req.user?.role;
      await notificationService.markAllAsRead(role);
      return sendSuccess(res, 200, 'All notifications marked as read');
    } catch (err) {
      next(err);
    }
  }
};
