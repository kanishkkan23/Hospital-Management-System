import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_USERS,
  INITIAL_DEPARTMENTS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_MEDICINES,
  INITIAL_LAB_TESTS,
  INITIAL_LAB_REPORTS,
  INITIAL_BILLS,
  INITIAL_MEDICAL_HISTORY,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
  INITIAL_ACTIVITY_LOGS
} from '../mockData';

import {
  authService,
  departmentService,
  doctorService,
  patientService,
  appointmentService,
  medicalRecordService,
  prescriptionService,
  medicineService,
  labService,
  billingService,
  notificationService,
  settingsService
} from '../services/apiServices';

const HospitalContext = createContext(null);

const getStored = (key, fallback) => {
  try {
    const item = localStorage.getItem(`carepoint_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const ROLE_DEFAULT_EMAILS = {
  Administrator: 'admin@carepoint.com',
  Doctor: 'doctor@carepoint.com',
  Receptionist: 'reception@carepoint.com',
  Pharmacist: 'pharmacy@carepoint.com',
  'Lab Technician': 'lab@carepoint.com',
  Patient: 'patient@carepoint.com'
};

export const HospitalProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => getStored('settings', INITIAL_SETTINGS));
  const [users, setUsers] = useState(() => getStored('users', INITIAL_USERS));
  const [departments, setDepartments] = useState(() => getStored('departments', INITIAL_DEPARTMENTS));
  const [patients, setPatients] = useState(() => getStored('patients', INITIAL_PATIENTS));
  const [appointments, setAppointments] = useState(() => getStored('appointments', INITIAL_APPOINTMENTS));
  const [prescriptions, setPrescriptions] = useState(() => getStored('prescriptions', INITIAL_PRESCRIPTIONS));
  const [medicines, setMedicines] = useState(() => getStored('medicines', INITIAL_MEDICINES));
  const [labTests, setLabTests] = useState(() => getStored('labTests', INITIAL_LAB_TESTS));
  const [labReports, setLabReports] = useState(() => getStored('labReports', INITIAL_LAB_REPORTS));
  const [bills, setBills] = useState(() => getStored('bills', INITIAL_BILLS));
  const [medicalHistory, setMedicalHistory] = useState(() => getStored('medicalHistory', INITIAL_MEDICAL_HISTORY));
  const [notifications, setNotifications] = useState(() => getStored('notifications', INITIAL_NOTIFICATIONS));
  const [activityLogs, setActivityLogs] = useState(() => getStored('activityLogs', INITIAL_ACTIVITY_LOGS));
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Authenticated user
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = getStored('currentUser', null);
    return saved || INITIAL_USERS[0];
  });

  // Sync to local storage
  useEffect(() => { localStorage.setItem('carepoint_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('carepoint_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('carepoint_departments', JSON.stringify(departments)); }, [departments]);
  useEffect(() => { localStorage.setItem('carepoint_patients', JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem('carepoint_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('carepoint_prescriptions', JSON.stringify(prescriptions)); }, [prescriptions]);
  useEffect(() => { localStorage.setItem('carepoint_medicines', JSON.stringify(medicines)); }, [medicines]);
  useEffect(() => { localStorage.setItem('carepoint_labTests', JSON.stringify(labTests)); }, [labTests]);
  useEffect(() => { localStorage.setItem('carepoint_labReports', JSON.stringify(labReports)); }, [labReports]);
  useEffect(() => { localStorage.setItem('carepoint_bills', JSON.stringify(bills)); }, [bills]);
  useEffect(() => { localStorage.setItem('carepoint_medicalHistory', JSON.stringify(medicalHistory)); }, [medicalHistory]);
  useEffect(() => { localStorage.setItem('carepoint_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('carepoint_activityLogs', JSON.stringify(activityLogs)); }, [activityLogs]);
  useEffect(() => { localStorage.setItem('carepoint_currentUser', JSON.stringify(currentUser)); }, [currentUser]);

  // Fetch live backend data
  const refreshBackendData = useCallback(async () => {
    try {
      const [
        deptsRes,
        patientsRes,
        apptsRes,
        rxRes,
        medsRes,
        testsRes,
        repsRes,
        billsRes,
        settingsRes,
        logsRes
      ] = await Promise.allSettled([
        departmentService.getDepartments(),
        patientService.getPatients(),
        appointmentService.getAppointments(),
        prescriptionService.getPrescriptions(),
        medicineService.getMedicines(),
        labService.getLabTests(),
        labService.getLabReports(),
        billingService.getBills(),
        settingsService.getSettings(),
        settingsService.getActivityLogs()
      ]);

      if (deptsRes.status === 'fulfilled' && Array.isArray(deptsRes.value)) setDepartments(deptsRes.value);
      if (patientsRes.status === 'fulfilled' && Array.isArray(patientsRes.value)) setPatients(patientsRes.value);
      if (apptsRes.status === 'fulfilled' && Array.isArray(apptsRes.value)) setAppointments(apptsRes.value);
      if (rxRes.status === 'fulfilled' && Array.isArray(rxRes.value)) setPrescriptions(rxRes.value);
      if (medsRes.status === 'fulfilled' && Array.isArray(medsRes.value)) setMedicines(medsRes.value);
      if (testsRes.status === 'fulfilled' && Array.isArray(testsRes.value)) setLabTests(testsRes.value);
      if (repsRes.status === 'fulfilled' && Array.isArray(repsRes.value)) setLabReports(repsRes.value);
      if (billsRes.status === 'fulfilled' && Array.isArray(billsRes.value)) setBills(billsRes.value);
      if (settingsRes.status === 'fulfilled' && settingsRes.value) setSettings(settingsRes.value);
      if (logsRes.status === 'fulfilled' && Array.isArray(logsRes.value)) setActivityLogs(logsRes.value);

      setIsBackendConnected(true);
    } catch (err) {
      console.warn('Backend sync in background:', err.message);
    }
  }, []);

  useEffect(() => {
    refreshBackendData();
  }, [refreshBackendData]);

  // Log activity helper
  const addActivity = (action, user, details) => {
    const newLog = {
      id: 'LOG-' + Date.now().toString().slice(-4),
      action,
      user: user || (currentUser ? `${currentUser.fullName || currentUser.name} (${currentUser.role})` : 'System'),
      details,
      time: 'Just now'
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 19)]);
  };

  // Push notification helper
  const addNotification = (targetRole, targetUserId, title, message, type = 'info') => {
    const newNotif = {
      id: 'NOTIF-' + Date.now().toString().slice(-5),
      targetRole,
      targetUserId,
      title,
      message,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Authenticate user with backend Supabase Auth
  const login = async (role, customUser = null) => {
    if (customUser) {
      setCurrentUser(customUser);
      return;
    }

    const email = ROLE_DEFAULT_EMAILS[role] || `${role.toLowerCase().replace(/\s+/g, '')}@carepoint.com`;

    try {
      const loginRes = await authService.login(email, 'password123', role);
      if (loginRes?.user) {
        const userObj = {
          ...loginRes.user,
          name: loginRes.user.fullName,
          avatar: loginRes.user.avatarUrl
        };
        setCurrentUser(userObj);
        addActivity('User Login', `${userObj.name} (${role})`, 'Authenticated via Supabase Auth');
        refreshBackendData();
        return userObj;
      }
    } catch (e) {
      console.warn('Using local profile fallback for auth:', e.message);
    }

    // Fallback if backend offline
    const user = users.find(u => u.role === role) || {
      id: 'USR-' + Math.floor(100 + Math.random() * 900),
      name: `Demo ${role}`,
      fullName: `Demo ${role}`,
      email,
      role: role,
      status: 'Active'
    };
    setCurrentUser(user);
    addActivity('User Login', `${user.name} (${role})`, 'Logged into hospital portal');
    return user;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Ignore
    }
    if (currentUser) {
      addActivity('User Logout', `${currentUser.name || currentUser.fullName} (${currentUser.role})`, 'Logged out of system');
    }
    setCurrentUser(null);
  };

  // Patient Registration & Management
  const addPatient = async (patientData) => {
    const newId = 'PAT-' + (1000 + patients.length + 1);
    const newPatient = {
      ...patientData,
      id: newId,
      patientCode: newId,
      status: 'Active',
      registeredDate: new Date().toISOString().split('T')[0],
      lastVisit: 'Never'
    };
    setPatients(prev => [newPatient, ...prev]);

    // Backend call
    try {
      patientService.createPatient(patientData).catch(() => {});
    } catch (e) {}

    const newUser = {
      id: 'USR-' + (users.length + 1).toString().padStart(3, '0'),
      name: newPatient.name || newPatient.fullName,
      email: newPatient.email,
      role: 'Patient',
      status: 'Active',
      phone: newPatient.phone,
      patientId: newId,
      joinedDate: newPatient.registeredDate
    };
    setUsers(prev => [...prev, newUser]);
    addActivity('Patient Registered', null, `Registered ${newPatient.name || newPatient.fullName} (${newId})`);
    addNotification('Receptionist', null, 'New Patient Registered', `${newPatient.name || newPatient.fullName} (${newId}) has been registered.`, 'patient');
    return newPatient;
  };

  const updatePatient = (id, data) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    try { patientService.updatePatient(id, data).catch(() => {}); } catch (e) {}
    addActivity('Patient Updated', null, `Updated records for Patient ID: ${id}`);
  };

  const deletePatient = (id) => {
    const pat = patients.find(p => p.id === id);
    setPatients(prev => prev.filter(p => p.id !== id));
    addActivity('Patient Removed', null, `Removed patient ${pat?.name || id}`);
  };

  // Appointment Operations
  const addAppointment = (appointmentData) => {
    const newId = 'APT-2024-' + (appointments.length + 1).toString().padStart(2, '0');
    const newAppt = {
      ...appointmentData,
      id: newId,
      status: 'Scheduled'
    };
    setAppointments(prev => [newAppt, ...prev]);

    // Backend call
    try { appointmentService.createAppointment(appointmentData).catch(() => {}); } catch (e) {}

    addActivity('Appointment Scheduled', null, `${newAppt.patientName} with ${newAppt.doctorName} on ${newAppt.date}`);
    addNotification('Doctor', newAppt.doctorId, 'New Appointment Booked', `${newAppt.patientName} booked an appointment for ${newAppt.date} at ${newAppt.time}.`, 'appointment');
    addNotification('Patient', newAppt.patientId, 'Appointment Confirmed', `Your appointment with ${newAppt.doctorName} is confirmed for ${newAppt.date} at ${newAppt.time}.`, 'appointment');
    addNotification('Receptionist', null, 'New Appointment Created', `New appointment ${newId} scheduled for ${newAppt.patientName}.`, 'appointment');
    return newAppt;
  };

  const updateAppointmentStatus = (id, status) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    try { appointmentService.updateAppointmentStatus(id, status).catch(() => {}); } catch (e) {}
    const appt = appointments.find(a => a.id === id);
    if (appt) {
      addActivity('Appointment Status Updated', null, `${appt.id} changed to ${status}`);
      addNotification('Patient', appt.patientId, `Appointment ${status}`, `Your appointment with ${appt.doctorName} is now marked as ${status}.`, 'appointment');
    }
  };

  const rescheduleAppointment = (id, date, time) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, date, time, status: 'Scheduled' } : a));
    try { appointmentService.rescheduleAppointment(id, date, time).catch(() => {}); } catch (e) {}
    const appt = appointments.find(a => a.id === id);
    if (appt) {
      addActivity('Appointment Rescheduled', null, `${appt.id} moved to ${date} ${time}`);
      addNotification('Patient', appt.patientId, 'Appointment Rescheduled', `Your appointment has been rescheduled to ${date} at ${time}.`, 'appointment');
    }
  };

  // Prescription Operations
  const addPrescription = (prescriptionData) => {
    const newId = 'RX-' + (500 + prescriptions.length + 1);
    const newRx = {
      ...prescriptionData,
      id: newId,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setPrescriptions(prev => [newRx, ...prev]);
    try { prescriptionService.createPrescription(prescriptionData).catch(() => {}); } catch (e) {}
    addActivity('Prescription Created', null, `Created ${newId} for ${newRx.patientName}`);
    addNotification('Pharmacist', null, 'New Prescription Pending', `Prescription ${newId} for ${newRx.patientName} is waiting for dispensing.`, 'prescription');
    addNotification('Patient', newRx.patientId, 'New Prescription Issued', `Dr. ${newRx.doctorName} issued prescription ${newId}.`, 'prescription');
    return newRx;
  };

  const dispensePrescription = (id) => {
    setPrescriptions(prev => prev.map(rx => {
      if (rx.id === id) {
        rx.medicines?.forEach(medItem => {
          setMedicines(mList => mList.map(m => {
            if (m.id === medItem.id || m.name.toLowerCase().includes(medItem.name.toLowerCase())) {
              const updatedStock = Math.max(0, m.stock - (medItem.quantity || 10));
              let status = 'Available';
              if (updatedStock === 0) status = 'Expired';
              else if (updatedStock <= (m.minThreshold || 30)) status = 'Low Stock';
              return { ...m, stock: updatedStock, status };
            }
            return m;
          }));
        });
        return {
          ...rx,
          status: 'Dispensed',
          dispensedDate: new Date().toISOString().split('T')[0],
          dispensedBy: currentUser ? `${currentUser.name || currentUser.fullName} (${currentUser.role})` : 'Central Pharmacy'
        };
      }
      return rx;
    }));

    try { prescriptionService.dispensePrescription(id).catch(() => {}); } catch (e) {}

    const rx = prescriptions.find(r => r.id === id);
    if (rx) {
      addActivity('Prescription Dispensed', null, `Dispensed ${rx.id} for ${rx.patientName}`);
      addNotification('Patient', rx.patientId, 'Prescription Ready / Dispensed', `Your medicines for ${rx.id} have been dispensed by the pharmacy.`, 'prescription');
    }
  };

  // Medicine & Inventory Operations
  const addMedicine = (medicineData) => {
    const newId = 'MED-' + (100 + medicines.length + 1);
    const newMed = {
      ...medicineData,
      id: newId,
      status: medicineData.stock <= 0 ? 'Expired' : (medicineData.stock <= (medicineData.minThreshold || 30) ? 'Low Stock' : 'Available')
    };
    setMedicines(prev => [newMed, ...prev]);
    try { medicineService.createMedicine(medicineData).catch(() => {}); } catch (e) {}
    addActivity('Medicine Added', null, `Added ${newMed.name} (${newMed.stock} ${newMed.unit || 'Units'})`);
    return newMed;
  };

  const updateMedicine = (id, data) => {
    setMedicines(prev => prev.map(m => {
      if (m.id === id) {
        const updated = { ...m, ...data };
        if (updated.stock <= 0) updated.status = 'Expired';
        else if (updated.stock <= (updated.minThreshold || 30)) updated.status = 'Low Stock';
        else updated.status = 'Available';
        return updated;
      }
      return m;
    }));
    try { medicineService.updateMedicine(id, data).catch(() => {}); } catch (e) {}
    addActivity('Medicine Updated', null, `Updated medicine ID: ${id}`);
  };

  const deleteMedicine = (id) => {
    const med = medicines.find(m => m.id === id);
    setMedicines(prev => prev.filter(m => m.id !== id));
    addActivity('Medicine Removed', null, `Removed ${med?.name || id}`);
  };

  // Lab Test & Report Operations
  const requestLabTest = (testData) => {
    const newId = 'LAB-' + (300 + labTests.length + 1);
    const newTest = {
      ...testData,
      id: newId,
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'Requested'
    };
    setLabTests(prev => [newTest, ...prev]);
    try { labService.requestTest(testData).catch(() => {}); } catch (e) {}
    addActivity('Lab Test Ordered', null, `Ordered ${newTest.testName} for ${newTest.patientName}`);
    addNotification('Lab Technician', null, 'New Lab Test Request', `${newTest.priority} test request ${newId}: ${newTest.testName} for ${newTest.patientName}.`, 'lab');
    return newTest;
  };

  const updateLabTestStatus = (id, status) => {
    setLabTests(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    try {
      if (status === 'In Progress') labService.startTest(id).catch(() => {});
    } catch (e) {}
    addActivity('Lab Test Status Changed', null, `Test ${id} is now ${status}`);
  };

  const submitLabReport = (reportData) => {
    const newId = 'REP-' + (900 + labReports.length + 1);
    const newReport = {
      ...reportData,
      id: newId,
      completedDate: new Date().toISOString().split('T')[0],
      status: 'Completed',
      technicianName: currentUser?.name || currentUser?.fullName || 'Dr. Priya Sharma'
    };
    setLabReports(prev => [newReport, ...prev]);
    if (reportData.testId) {
      updateLabTestStatus(reportData.testId, 'Completed');
    }
    try { labService.submitLabReport(reportData).catch(() => {}); } catch (e) {}
    addActivity('Lab Report Completed', null, `Published report ${newId} for ${newReport.patientName}`);
    addNotification('Doctor', newReport.doctorId, 'Lab Report Completed', `Report for ${newReport.patientName} (${newReport.testName}) is now available.`, 'lab');
    addNotification('Patient', newReport.patientId, 'Lab Report Available', `Your test results for ${newReport.testName} are ready to view.`, 'lab');
    return newReport;
  };

  // Billing Operations
  const createBill = (billData) => {
    const newId = 'INV-' + (800 + bills.length + 1);
    const subtotal = (billData.items || []).reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const discount = Number(billData.discount || 0);
    const tax = Number(billData.tax || 0);
    const totalAmount = Math.max(0, subtotal - discount + tax);

    const newBill = {
      ...billData,
      id: newId,
      date: new Date().toISOString().split('T')[0],
      subtotal,
      discount,
      tax,
      totalAmount,
      status: billData.status || 'Unpaid',
      generatedBy: currentUser ? `${currentUser.name || currentUser.fullName} (${currentUser.role})` : 'Billing Desk'
    };
    setBills(prev => [newBill, ...prev]);
    try { billingService.createBill(billData).catch(() => {}); } catch (e) {}
    addActivity('Bill Generated', null, `Generated Invoice ${newId} for ${newBill.patientName} ($${totalAmount.toFixed(2)})`);
    addNotification('Patient', newBill.patientId, 'New Hospital Invoice', `Invoice ${newId} for $${totalAmount.toFixed(2)} has been generated.`, 'billing');
    return newBill;
  };

  const markBillPaid = (id, paymentMethod = 'Credit Card') => {
    setBills(prev => prev.map(b => b.id === id ? {
      ...b,
      status: 'Paid',
      paymentMethod,
      paidDate: new Date().toISOString().split('T')[0]
    } : b));
    try { billingService.updateBillStatus(id, 'Paid', paymentMethod).catch(() => {}); } catch (e) {}
    const bill = bills.find(b => b.id === id);
    if (bill) {
      addActivity('Bill Paid', null, `Invoice ${id} settled via ${paymentMethod}`);
      addNotification('Patient', bill.patientId, 'Payment Received', `Payment for invoice ${id} ($${bill.totalAmount}) confirmed.`, 'billing');
    }
  };

  const cancelBill = (id) => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
    try { billingService.updateBillStatus(id, 'Cancelled').catch(() => {}); } catch (e) {}
    addActivity('Bill Cancelled', null, `Cancelled invoice ${id}`);
  };

  // Medical Consultation & Record
  const addMedicalRecord = (recordData) => {
    const newId = 'MED-REC-' + (medicalHistory.length + 1).toString().padStart(2, '0');
    const newRecord = {
      ...recordData,
      id: newId,
      date: new Date().toISOString().split('T')[0]
    };
    setMedicalHistory(prev => [newRecord, ...prev]);
    try { medicalRecordService.createMedicalRecord(recordData).catch(() => {}); } catch (e) {}
    addActivity('Medical Record Added', null, `Recorded consultation for Patient: ${recordData.patientId}`);
    return newRecord;
  };

  // Admin & User Management
  const addUser = (userData) => {
    const newId = 'USR-' + (users.length + 1).toString().padStart(3, '0');
    const newUser = {
      ...userData,
      id: newId,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
    addActivity('User Created', null, `Added ${newUser.name} as ${newUser.role}`);
    return newUser;
  };

  const updateUser = (id, data) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    addActivity('User Updated', null, `Updated user account ID: ${id}`);
  };

  const toggleUserStatus = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        addActivity('User Status Changed', null, `${u.name} is now ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const deleteUser = (id) => {
    const user = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    addActivity('User Deleted', null, `Deleted user ${user?.name || id}`);
  };

  // Department Management
  const addDepartment = (deptData) => {
    const newId = 'DEP-' + (departments.length + 1).toString().padStart(2, '0');
    const newDept = { ...deptData, id: newId };
    setDepartments(prev => [...prev, newDept]);
    try { departmentService.createDepartment(deptData).catch(() => {}); } catch (e) {}
    addActivity('Department Added', null, `Added department: ${newDept.name}`);
    return newDept;
  };

  const updateDepartment = (id, data) => {
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
    try { departmentService.updateDepartment(id, data).catch(() => {}); } catch (e) {}
    addActivity('Department Updated', null, `Updated department ID: ${id}`);
  };

  const deleteDepartment = (id) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
    try { departmentService.deleteDepartment(id).catch(() => {}); } catch (e) {}
    addActivity('Department Deleted', null, `Deleted department ID: ${id}`);
  };

  // Notifications
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try { notificationService.markAsRead(id).catch(() => {}); } catch (e) {}
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try { notificationService.markAllAsRead().catch(() => {}); } catch (e) {}
  };

  // Reset to initial data for testing
  const resetToMockData = () => {
    setSettings(INITIAL_SETTINGS);
    setUsers(INITIAL_USERS);
    setDepartments(INITIAL_DEPARTMENTS);
    setPatients(INITIAL_PATIENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setMedicines(INITIAL_MEDICINES);
    setLabTests(INITIAL_LAB_TESTS);
    setLabReports(INITIAL_LAB_REPORTS);
    setBills(INITIAL_BILLS);
    setMedicalHistory(INITIAL_MEDICAL_HISTORY);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setCurrentUser(INITIAL_USERS[0]);
    localStorage.clear();
    refreshBackendData();
  };

  return (
    <HospitalContext.Provider
      value={{
        settings,
        setSettings,
        currentUser,
        setCurrentUser,
        isBackendConnected,
        login,
        logout,
        refreshBackendData,
        users,
        departments,
        patients,
        appointments,
        prescriptions,
        medicines,
        labTests,
        labReports,
        bills,
        medicalHistory,
        notifications,
        activityLogs,
        // Actions
        addPatient,
        updatePatient,
        deletePatient,
        addAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        addPrescription,
        dispensePrescription,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        requestLabTest,
        updateLabTestStatus,
        submitLabReport,
        createBill,
        markBillPaid,
        cancelBill,
        addMedicalRecord,
        addUser,
        updateUser,
        toggleUserStatus,
        deleteUser,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        markNotificationRead,
        markAllNotificationsRead,
        addActivity,
        resetToMockData
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
