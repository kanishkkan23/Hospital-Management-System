import { errorResponse } from '../utils/response.js';

/**
 * Centralized Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  const statusCode = err.statusCode || (err.status ? err.status : 500);
  const message = err.message || 'An unexpected internal server error occurred.';
  const errors = process.env.NODE_ENV === 'development' ? err.stack : null;

  return errorResponse(res, statusCode, message, errors);
};

/**
 * 404 Route Not Found Handler
 */
export const notFoundHandler = (req, res) => {
  return errorResponse(res, 404, `API Route not found: ${req.method} ${req.originalUrl}`);
};
