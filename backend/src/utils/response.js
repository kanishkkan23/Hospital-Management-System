/**
 * Standardized API Response Utilities
 */

export const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

export const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

export const paginatedResponse = (res, message = 'Success', items = [], page = 1, limit = 10, total = 0) => {
  const totalPages = Math.ceil(total / limit) || 1;
  return res.status(200).json({
    success: true,
    statusCode: 200,
    message,
    data: items,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    },
    timestamp: new Date().toISOString()
  });
};

// Aliases for convenient controller usage
export const sendSuccess = successResponse;
export const sendError = errorResponse;
export const sendNotFound = (res, message = 'Resource not found') => errorResponse(res, 404, message);
export const sendUnauthorized = (res, message = 'Unauthorized access') => errorResponse(res, 401, message);
export const sendForbidden = (res, message = 'Forbidden: insufficient permissions') => errorResponse(res, 403, message);
export const sendBadRequest = (res, message = 'Bad request', errors = null) => errorResponse(res, 400, message, errors);
