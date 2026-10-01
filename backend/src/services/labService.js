import db from '../lib/db.js';

export const labService = {
  getAllTests: async (filter = {}) => {
    let list = await db.getLabTests();
    if (filter.patientId) list = list.filter(t => t.patientId === filter.patientId || t.patientName === filter.patientName);
    if (filter.doctorId) list = list.filter(t => t.doctorId === filter.doctorId || t.doctorName === filter.doctorName);
    if (filter.status) list = list.filter(t => t.status === filter.status);
    return list;
  },

  getTestById: async (id) => db.findLabTestById(id),

  createTest: async (testData, currentUser) => {
    const test = await db.createLabTest({
      ...testData,
      doctorName: testData.doctorName || currentUser?.fullName,
      department: testData.department || currentUser?.department || 'Clinical Diagnostic'
    });

    await db.createNotification({
      targetRole: 'Lab Technician',
      title: 'New Lab Test Ordered',
      message: `${test.priority} order: ${test.testName || test.testType} requested for ${test.patientName}.`
    });

    await db.createActivityLog('Lab Test Ordered', currentUser?.fullName || 'Doctor', `Ordered ${test.testName || test.testType} for ${test.patientName}`);
    return test;
  },

  startTest: async (id, currentUser) => {
    const updated = await db.updateLabTest(id, { status: 'In Progress' });
    await db.createActivityLog('Lab Test Started', currentUser?.fullName || 'Lab Tech', `${updated.testCode} marked In Progress`);
    return updated;
  },

  updateTestStatus: async (id, status, currentUser) => {
    const updated = await db.updateLabTest(id, { status });
    await db.createActivityLog('Lab Test Status Updated', currentUser?.fullName || 'Lab Tech', `${updated.testCode} changed to ${status}`);
    return updated;
  },

  getAllReports: async (filter = {}) => {
    let list = await db.getLabReports();
    if (filter.patientId) list = list.filter(r => r.patientId === filter.patientId);
    if (filter.doctorId) list = list.filter(r => r.doctorId === filter.doctorId);
    return list;
  },

  createReport: async (reportData, currentUser) => {
    const report = await db.createLabReport({
      ...reportData,
      technicianName: reportData.technicianName || currentUser?.fullName || 'Dr. Priya Sharma'
    });

    // Notify doctor and patient
    await db.createNotification({
      profileId: report.doctorId,
      targetRole: 'Doctor',
      title: 'Lab Report Verified & Available',
      message: `Diagnostic report ${report.reportCode} (${report.testName || report.testType}) for ${report.patientName} is ready.`
    });

    await db.createNotification({
      profileId: report.patientId,
      targetRole: 'Patient',
      title: 'Laboratory Report Published',
      message: `Your results for ${report.testName || report.testType} have been verified by pathology.`
    });

    await db.createActivityLog('Lab Report Completed', currentUser?.fullName || 'Lab Tech', `Published ${report.reportCode} for ${report.patientName}`);
    return report;
  }
};
