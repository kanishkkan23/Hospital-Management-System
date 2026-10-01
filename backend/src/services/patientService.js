import db from '../lib/db.js';

export const doctorService = {
  getAll: async () => db.getDoctors(),
  getById: async (id) => db.findDoctorById(id),
  create: async (data) => db.createDoctor(data),
  update: async (id, data) => db.updateDoctor(id, data),
  getAvailability: async (doctorId) => {
    const doc = await db.findDoctorById(doctorId);
    return {
      doctorId,
      doctorName: doc?.doctorName,
      availableDays: doc?.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableHours: doc?.availableHours || '09:00 AM - 02:00 PM',
      slots: [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:15 AM', '12:00 PM', '02:00 PM', '03:30 PM'
      ]
    };
  }
};

export const patientService = {
  getAll: async () => db.getPatients(),
  getById: async (id) => db.findPatientById(id),
  create: async (patientData) => db.createPatient(patientData),
  update: async (id, data) => db.updatePatient(id, data),
  delete: async (id) => db.deletePatient(id)
};
