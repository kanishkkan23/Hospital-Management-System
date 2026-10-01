import { errorResponse } from '../utils/response.js';

/**
 * Role-Based Authorization Guard Middleware
 * Rejects requests if req.user.role is not included in allowedRoles.
 */
export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Unauthorized. Please sign in to access this resource.');
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `Access denied. Role '${req.user.role}' does not have permission to perform this operation. Allowed: ${roles.join(', ')}`
      );
    }

    next();
  };
};

/**
 * Ensures a patient can only access their own records unless accessed by authorized staff.
 */
export const requireSelfOrStaff = (paramKey = 'id', staffRoles = ['Administrator', 'Doctor', 'Receptionist']) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Unauthorized. Please sign in.');
    }

    if (staffRoles.includes(req.user.role)) {
      return next();
    }

    const targetId = req.params[paramKey] || req.body[paramKey];

    if (
      req.user.role === 'Patient' &&
      targetId &&
      targetId !== req.user.id &&
      targetId !== req.user.patientId &&
      targetId !== req.user.patientCode
    ) {
      return errorResponse(res, 403, 'Access denied. You can only view or manage your own patient records.');
    }

    next();
  };
};
