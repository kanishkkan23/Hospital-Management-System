import db from '../lib/db.js';
import { supabasePublic, supabaseAdmin } from '../lib/supabase.js';

export const authService = {
  getProfile: async (userId) => {
    const profile = await db.findProfileByUserId(userId) || await db.findProfileById(userId);
    if (!profile) return null;

    let roleDetails = null;
    if (profile.role === 'Doctor') {
      roleDetails = await db.findDoctorById(profile.id);
    } else if (profile.role === 'Patient') {
      roleDetails = await db.findPatientById(profile.id);
    }

    return {
      ...profile,
      roleDetails
    };
  },

  login: async (email, password, roleHint = null) => {
    let profile = await db.findProfileByEmail(email);

    if (!profile && roleHint) {
      const roleProfiles = await db.getProfiles(roleHint);
      profile = roleProfiles[0];
    }

    if (!profile) {
      profile = (await db.getProfiles())[0];
    }

    const token = `mock-jwt-token:${profile.email}:${Date.now()}`;

    // Record activity log
    await db.createActivityLog('User Login', `${profile.fullName} (${profile.role})`, 'Signed into HMS Portal');

    return {
      token,
      session: {
        accessToken: token,
        tokenType: 'bearer',
        user: profile
      },
      user: {
        id: profile.id,
        userId: profile.userId,
        email: profile.email,
        fullName: profile.fullName,
        role: profile.role,
        avatarUrl: profile.avatarUrl,
        status: profile.status
      }
    };
  },

  register: async (userData) => {
    return authService.registerPatient(userData);
  },

  registerPatient: async (patientData) => {
    // Create profile
    const profile = await db.createProfile({
      fullName: patientData.name || patientData.fullName,
      email: patientData.email,
      phone: patientData.phone,
      gender: patientData.gender || 'Male',
      dateOfBirth: patientData.dob || patientData.dateOfBirth,
      address: patientData.address,
      role: 'Patient',
      status: 'Active'
    });

    // Create patient record
    const patient = await db.createPatient({
      profileId: profile.id,
      name: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      gender: profile.gender,
      dob: profile.dateOfBirth,
      bloodGroup: patientData.bloodGroup || 'O+',
      address: profile.address,
      emergencyContact: patientData.emergencyContact,
      allergies: patientData.allergies || 'None reported'
    });

    // Send notifications
    await db.createNotification({
      targetRole: 'Receptionist',
      title: 'New Patient Registered',
      message: `${profile.fullName} (${patient.patientCode}) has been registered at the front desk.`
    });

    await db.createActivityLog('Patient Registered', profile.fullName, `Generated Patient ID: ${patient.patientCode}`);

    return {
      profile,
      patient
    };
  }
};
