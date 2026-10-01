import db from '../lib/db.js';

export const doctorAvailabilityService = {
  getAvailabilityByDoctor: async (doctorId) => {
    const doc = await db.findDoctorById(doctorId);
    if (!doc) return null;
    return {
      doctorId,
      doctorName: doc.doctorName,
      department: doc.department,
      availableDays: doc.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableHours: doc.availableHours || '09:00 AM - 02:00 PM',
      slots: [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:15 AM', '12:00 PM', '02:00 PM', '03:30 PM'
      ]
    };
  },

  getAllAvailabilities: async () => {
    const doctors = await db.getDoctors();
    return doctors.map(doc => ({
      doctorId: doc.id,
      doctorName: doc.doctorName,
      department: doc.department,
      availableDays: doc.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableHours: doc.availableHours || '09:00 AM - 02:00 PM',
      slots: [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:15 AM', '12:00 PM', '02:00 PM', '03:30 PM'
      ]
    }));
  },

  updateAvailability: async (doctorId, schedule) => {
    return db.updateDoctor(doctorId, schedule);
  }
};
