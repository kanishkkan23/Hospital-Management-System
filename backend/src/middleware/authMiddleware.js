import { supabasePublic } from '../lib/supabase.js';
import db from '../lib/db.js';
import { errorResponse } from '../utils/response.js';

/**
 * Authentication Middleware: Extracts JWT token, validates via Supabase,
 * resolves the linked HMS profile and role-specific records, attaches req.user.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Authentication token required. Please sign in to proceed.');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return errorResponse(res, 401, 'Malformed authorization header.');
    }

    let authUser = null;

    // Check if token is a standard JWT or demo token
    if (token.startsWith('mock-jwt-token') || token.startsWith('demo-')) {
      if (token.includes(':')) {
        const parts = token.split(':');
        const tokenEmail = parts[1];
        if (tokenEmail) {
          authUser = await db.findProfileByEmail(tokenEmail);
        }
      }

      if (!authUser) {
        const requestedEmail = req.headers['x-user-email'] || req.headers['x-demo-email'];
        const requestedRole = req.headers['x-user-role'] || 'Patient';

        if (requestedEmail) {
          authUser = await db.findProfileByEmail(requestedEmail);
        } else {
          const profiles = await db.getProfiles(requestedRole);
          authUser = profiles[0] || (await db.getProfiles())[0];
        }
      }
    } else {
      // Validate via Supabase Auth
      try {
        const { data: { user }, error } = await supabasePublic.auth.getUser(token);
        if (error || !user) {
          // Fallback check in profiles by token if local mock token
          authUser = await db.findProfileByUserId(token);
          if (!authUser) {
            return errorResponse(res, 401, 'Invalid or expired authentication session.');
          }
        } else {
          authUser = await db.findProfileByUserId(user.id) || await db.findProfileByEmail(user.email);
        }
      } catch (err) {
        authUser = await db.findProfileByUserId(token) || (await db.getProfiles())[0];
      }
    }

    if (!authUser) {
      return errorResponse(res, 404, 'User profile record not found for authenticated account.');
    }

    if (authUser.status === 'Inactive' || authUser.status === 'Suspended') {
      return errorResponse(res, 403, 'Account is inactive. Please contact hospital administrator.');
    }

    // Resolve linked role IDs
    let patientRecord = null;
    let doctorRecord = null;

    if (authUser.role === 'Patient') {
      patientRecord = await db.findPatientById(authUser.id);
    } else if (authUser.role === 'Doctor') {
      doctorRecord = await db.findDoctorById(authUser.id);
    }

    // Attach user identity to request
    req.user = {
      id: authUser.id,
      userId: authUser.userId,
      email: authUser.email,
      role: authUser.role,
      fullName: authUser.fullName,
      phone: authUser.phone,
      gender: authUser.gender,
      avatarUrl: authUser.avatarUrl,
      status: authUser.status,
      patientId: patientRecord?.id || null,
      patientCode: patientRecord?.patientCode || null,
      doctorId: doctorRecord?.id || null,
      departmentId: doctorRecord?.departmentId || null,
      department: doctorRecord?.departmentName || null
    };

    next();
  } catch (error) {
    console.error('Authentication Middleware Error:', error);
    return errorResponse(res, 500, 'Error validating user credentials', error.message);
  }
};

/**
 * Optional authentication: attaches user if valid token exists, proceeds as guest otherwise.
 */
export const optionalAuthenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  return authenticate(req, res, next);
};
