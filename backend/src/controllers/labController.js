import { labService } from '../services/labService.js';
import { sendSuccess, sendNotFound } from '../utils/response.js';

export const labController = {
  // Lab Tests
  getTests: async (req, res, next) => {
    try {
      const tests = await labService.getAllTests(req.query);
      return sendSuccess(res, 200, 'Lab tests retrieved', tests);
    } catch (err) {
      next(err);
    }
  },

  getTestById: async (req, res, next) => {
    try {
      const test = await labService.getTestById(req.params.id);
      if (!test) return sendNotFound(res, 'Lab test not found');
      return sendSuccess(res, 200, 'Lab test retrieved', test);
    } catch (err) {
      next(err);
    }
  },

  createTest: async (req, res, next) => {
    try {
      const created = await labService.createTest(req.body, req.user);
      return sendSuccess(res, 201, 'Lab test requested', created);
    } catch (err) {
      next(err);
    }
  },

  startTest: async (req, res, next) => {
    try {
      const updated = await labService.startTest(req.params.id);
      if (!updated) return sendNotFound(res, 'Lab test not found');
      return sendSuccess(res, 200, 'Lab test marked In Progress', updated);
    } catch (err) {
      next(err);
    }
  },

  // Lab Reports
  getReports: async (req, res, next) => {
    try {
      const reports = await labService.getAllReports(req.query);
      return sendSuccess(res, 200, 'Lab reports retrieved', reports);
    } catch (err) {
      next(err);
    }
  },

  completeReport: async (req, res, next) => {
    try {
      const report = await labService.createReport(req.body, req.user);
      return sendSuccess(res, 201, 'Lab report completed and test finalized', report);
    } catch (err) {
      next(err);
    }
  }
};
