import { departmentService } from '../services/departmentService.js';
import { sendSuccess, sendNotFound } from '../utils/response.js';

export const departmentController = {
  getAll: async (req, res, next) => {
    try {
      const departments = await departmentService.getAll();
      return sendSuccess(res, 200, 'Departments retrieved', departments);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const department = await departmentService.getById(req.params.id);
      if (!department) return sendNotFound(res, 'Department not found');
      return sendSuccess(res, 200, 'Department retrieved', department);
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const created = await departmentService.create(req.body);
      return sendSuccess(res, 201, 'Department created successfully', created);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const updated = await departmentService.update(req.params.id, req.body);
      if (!updated) return sendNotFound(res, 'Department not found');
      return sendSuccess(res, 200, 'Department updated successfully', updated);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const deleted = await departmentService.delete(req.params.id);
      if (!deleted) return sendNotFound(res, 'Department not found or cannot be deleted');
      return sendSuccess(res, 200, 'Department deleted successfully');
    } catch (err) {
      next(err);
    }
  }
};
