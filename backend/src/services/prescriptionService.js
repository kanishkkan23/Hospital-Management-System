import db from '../lib/db.js';

export const prescriptionService = {
  getAll: async (filter = {}) => {
    let list = await db.getPrescriptions();
    if (filter.patientId) list = list.filter(p => p.patientId === filter.patientId || p.patientName === filter.patientName);
    if (filter.doctorId) list = list.filter(p => p.doctorId === filter.doctorId || p.doctorName === filter.doctorName);
    if (filter.status) list = list.filter(p => p.status === filter.status);
    return list;
  },

  getById: async (id) => db.findPrescriptionById(id),

  create: async (rxData, currentUser) => {
    const rx = await db.createPrescription({
      ...rxData,
      doctorName: rxData.doctorName || currentUser?.fullName,
      department: rxData.department || currentUser?.department || 'Clinical OPD'
    });

    await db.createNotification({
      targetRole: 'Pharmacist',
      title: 'New Prescription Queued',
      message: `Prescription ${rx.prescriptionCode} for ${rx.patientName} is ready for counter dispensing.`
    });

    await db.createNotification({
      profileId: rx.patientId,
      targetRole: 'Patient',
      title: 'New Prescription Issued',
      message: `Dr. ${rx.doctorName} issued prescription ${rx.prescriptionCode}.`
    });

    await db.createActivityLog('Prescription Issued', currentUser?.fullName || 'Doctor', `Rx ${rx.prescriptionCode} for ${rx.patientName}`);
    return rx;
  },

  dispense: async (id, dispensedBy) => {
    const rx = await db.findPrescriptionById(id);
    if (!rx) throw new Error(`Prescription ${id} not found.`);

    const allMeds = await db.getMedicines();
    for (const medItem of (rx.medicines || [])) {
      const match = allMeds.find(m => m.id === medItem.id || m.name.toLowerCase().includes(medItem.name.toLowerCase()));
      if (match) {
        const newStock = Math.max(0, match.stock - (medItem.quantity || 10));
        let status = 'Available';
        if (newStock === 0) status = 'Expired';
        else if (newStock <= (match.minThreshold || 30)) status = 'Low Stock';
        await db.updateMedicine(match.id, { stock: newStock, status });
      }
    }

    const updated = await db.updatePrescription(id, {
      status: 'Dispensed',
      dispensedDate: new Date().toISOString().split('T')[0],
      dispensedBy: dispensedBy || 'Central Pharmacy'
    });

    await db.createNotification({
      profileId: rx.patientId,
      targetRole: 'Patient',
      title: 'Prescription Dispensed',
      message: `Medicines for prescription ${rx.prescriptionCode} have been dispensed by the central pharmacy.`
    });

    await db.createActivityLog('Prescription Dispensed', dispensedBy || 'Pharmacist', `Fulfilled ${rx.prescriptionCode} for ${rx.patientName}`);
    return updated;
  }
};
