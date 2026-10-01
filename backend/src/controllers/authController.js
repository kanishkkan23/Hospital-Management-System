import { authService } from '../services/authService.js';
import { sendSuccess, sendError, sendUnauthorized } from '../utils/response.js';

export const authController = {
  login: async (req, res, next) => {
    try {
      const { email, password, role } = req.body;
      const result = await authService.login(email, password, role);
      return sendSuccess(res, 200, 'Login successful', result);
    } catch (err) {
      next(err);
    }
  },

  register: async (req, res, next) => {
    try {
      const result = await authService.register(req.body);
      return sendSuccess(res, 201, 'Registration successful', result);
    } catch (err) {
      next(err);
    }
  },

  getMe: async (req, res, next) => {
    try {
      if (!req.user) {
        return sendUnauthorized(res, 'User not authenticated');
      }
      return sendSuccess(res, 200, 'Current user retrieved', req.user);
    } catch (err) {
      next(err);
    }
  },

  getProfile: async (req, res, next) => {
    try {
      if (!req.user) {
        return sendUnauthorized(res, 'User not authenticated');
      }
      return sendSuccess(res, 200, 'Profile retrieved', {
        user: req.user,
        profile: req.user.profile,
        roleData: req.user.roleData
      });
    } catch (err) {
      next(err);
    }
  },

  logout: async (req, res, next) => {
    try {
      return sendSuccess(res, 200, 'Logged out successfully');
    } catch (err) {
      next(err);
    }
  }
};
