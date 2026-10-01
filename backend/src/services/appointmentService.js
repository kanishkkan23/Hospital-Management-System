import db from '../lib/db.js';

export const appointmentService = {
  getAll: async (filter = {}) => {
    let list = await db.getAppointments();
    if (filter.patientId) list = list.filter(a => a.patientId === filter.patientId || a.patientName === filter.patientName);
    if (filter.doctorId) list = list.filter(a => a.doctorId === filter.doctorId || a.doctorName === filter.doctorName);
    if (filter.status) list = list.filter(a => a.status === filter.status);
    if (filter.date) list = list.filter(a => a.date === filter.date);
    return list;
  },

  getById: async (id) => db.findAppointmentById(id),

  create: async (data, currentUser) => {
    // Conflict detection: prevent booking if doctor is already booked for this date and time
    const existing = await db.getAppointments();
    const hasConflict = existing.some(
      a => (a.doctorId === data.doctorId || a.doctorName === data.doctorName) &&
           a.date === data.date &&
           a.time === data.time &&
           a.status === 'Scheduled'
    );

    if (hasConflict) {
      throw new Error(`Doctor is already booked for ${data.date} at ${data.time}. Please select another time slot.`);
    }

    const appt = await db.createAppointment({
      ...data,
      patientId: data.patientId || currentUser?.patientId,
      patientName: data.patientName || currentUser?.fullName
    });

    // Notify doctor and receptionist
    await db.createNotification({
      targetRole: 'Doctor',
      title: 'New Appointment Scheduled',
      message: `${appt.patientName} booked a consultation for ${appt.date} at ${appt.time}.`
    });

    await db.createNotification({
      targetRole: 'Receptionist',
      title: 'New OPD Booking',
      message: `Appointment ${appt.appointmentCode} registered for ${appt.patientName} with ${appt.doctorName}.`
    });

    await db.createActivityLog('Appointment Created', currentUser?.fullName || 'Patient', `${appt.appointmentCode}: ${appt.patientName} with ${appt.doctorName}`);

    return appt;
  },

  updateStatus: async (id, status, currentUser) => {
    const updated = await db.updateAppointment(id, { status });
    if (updated) {
      await db.createNotification({
        profileId: updated.patientId,
        targetRole: 'Patient',
        title: `Appointment ${status}`,
        message: `Your appointment with ${updated.doctorName} on ${updated.date} is now marked as ${status}.`
      });
      await db.createActivityLog('Appointment Status Updated', currentUser?.fullName || 'Staff', `${updated.appointmentCode} is now ${status}`);
    }
    return updated;
  },

  reschedule: async (id, date, time, currentUser) => {
    const updated = await db.updateAppointment(id, { date, time, status: 'Scheduled' });
    if (updated) {
      await db.createNotification({
        profileId: updated.patientId,
        targetRole: 'Patient',
        title: 'Appointment Rescheduled',
        message: `Your appointment with ${updated.doctorName} has been moved to ${date} at ${time}.`
      });
      await db.createActivityLog('Appointment Rescheduled', currentUser?.fullName || 'Staff', `${updated.appointmentCode} moved to ${date} ${time}`);
    }
    return updated;
  },

  cancel: async (id, currentUser) => {
    const updated = await db.updateAppointment(id, { status: 'Cancelled' });
    if (updated) {
      await db.createNotification({
        profileId: updated.patientId,
        targetRole: 'Patient',
        title: 'Appointment Cancelled',
        message: `Your appointment with ${updated.doctorName} on ${updated.date} has been cancelled.`
      });
      await db.createActivityLog('Appointment Cancelled', currentUser?.fullName || 'User', `${updated.appointmentCode} cancelled`);
    }
    return updated;
  }
};
