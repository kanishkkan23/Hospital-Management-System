"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Patient,
  Doctor,
  Staff,
  Department,
  Appointment,
  Medicine,
  LabTest,
  Invoice,
  SystemNotification,
  HospitalStats,
  AppointmentStatus,
  LabTestStatus,
  PaymentStatus,
} from '@/types';
import {
  INITIAL_PATIENTS,
  INITIAL_DOCTORS,
  INITIAL_STAFF,
  INITIAL_DEPARTMENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICINES,
  INITIAL_LAB_TESTS,
  INITIAL_INVOICES,
  INITIAL_NOTIFICATIONS,
} from '@/data/mockData';

interface HospitalContextType {
  // Patients
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  // Doctors
  doctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, 'id'>) => Doctor;
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;

  // Appointments
  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'appointmentNumber' | 'createdAt'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  deleteAppointment: (id: string) => void;

  // Staff
  staff: Staff[];
  addStaff: (staffMember: Omit<Staff, 'id'>) => Staff;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  // Departments
  departments: Department[];
  addDepartment: (dept: Omit<Department, 'id'>) => Department;
  updateDepartment: (id: string, updates: Partial<Department>) => void;

  // Medicines
  medicines: Medicine[];
  addMedicine: (medicine: Omit<Medicine, 'id'>) => Medicine;
  updateMedicineStock: (id: string, newStock: number) => void;
  deleteMedicine: (id: string) => void;

  // Lab Tests
  labTests: LabTest[];
  addLabTest: (test: Omit<LabTest, 'id' | 'testCode' | 'orderDate'>) => LabTest;
  updateLabTestStatus: (id: string, status: LabTestStatus, resultsSummary?: string) => void;

  // Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;
  updateInvoiceStatus: (id: string, status: PaymentStatus, paidAmount?: number) => void;

  // Notifications
  notifications: SystemNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  dismissNotification: (id: string) => void;

  // Stats
  stats: HospitalStats;
  isInitialized: boolean;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PATIENTS: 'hms_patients_v1',
  DOCTORS: 'hms_doctors_v1',
  STAFF: 'hms_staff_v1',
  DEPARTMENTS: 'hms_departments_v1',
  APPOINTMENTS: 'hms_appointments_v1',
  MEDICINES: 'hms_medicines_v1',
  LAB_TESTS: 'hms_lab_tests_v1',
  INVOICES: 'hms_invoices_v1',
  NOTIFICATIONS: 'hms_notifications_v1',
};

export const HospitalDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [staff, setStaff] = useState<Staff[]>(INITIAL_STAFF);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [labTests, setLabTests] = useState<LabTest[]>(INITIAL_LAB_TESTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on client mount
  useEffect(() => {
    try {
      const storedPatients = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      if (storedPatients) setPatients(JSON.parse(storedPatients));

      const storedDoctors = localStorage.getItem(STORAGE_KEYS.DOCTORS);
      if (storedDoctors) setDoctors(JSON.parse(storedDoctors));

      const storedStaff = localStorage.getItem(STORAGE_KEYS.STAFF);
      if (storedStaff) setStaff(JSON.parse(storedStaff));

      const storedDepts = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
      if (storedDepts) setDepartments(JSON.parse(storedDepts));

      const storedApts = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (storedApts) setAppointments(JSON.parse(storedApts));

      const storedMeds = localStorage.getItem(STORAGE_KEYS.MEDICINES);
      if (storedMeds) setMedicines(JSON.parse(storedMeds));

      const storedLabs = localStorage.getItem(STORAGE_KEYS.LAB_TESTS);
      if (storedLabs) setLabTests(JSON.parse(storedLabs));

      const storedInvoices = localStorage.getItem(STORAGE_KEYS.INVOICES);
      if (storedInvoices) setInvoices(JSON.parse(storedInvoices));

      const storedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (storedNotifs) setNotifications(JSON.parse(storedNotifs));
    } catch (e) {
      console.warn('Failed to parse localStorage data:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
      localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(departments));
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
      localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
      localStorage.setItem(STORAGE_KEYS.LAB_TESTS, JSON.stringify(labTests));
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [patients, doctors, staff, departments, appointments, medicines, labTests, invoices, notifications, isInitialized]);

  // --- Patients CRUD ---
  const addPatient = (newPatData: Omit<Patient, 'id' | 'createdAt'>): Patient => {
    const newPatient: Patient = {
      ...newPatData,
      id: `pat-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPatients((prev) => [newPatient, ...prev]);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePatient = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  // --- Doctors CRUD ---
  const addDoctor = (newDocData: Omit<Doctor, 'id'>): Doctor => {
    const newDoctor: Doctor = {
      ...newDocData,
      id: `doc-${Date.now()}`,
    };
    setDoctors((prev) => [newDoctor, ...prev]);
    return newDoctor;
  };

  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDoctor = (id: string) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  // --- Appointments CRUD ---
  const addAppointment = (aptData: Omit<Appointment, 'id' | 'appointmentNumber' | 'createdAt'>): Appointment => {
    const rand = Math.floor(10000 + Math.random() * 90000);
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      appointmentNumber: `APT-${rand}`,
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => [newApt, ...prev]);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  // --- Staff CRUD ---
  const addStaff = (staffData: Omit<Staff, 'id'>): Staff => {
    const newStaff: Staff = {
      ...staffData,
      id: `staff-${Date.now()}`,
    };
    setStaff((prev) => [newStaff, ...prev]);
    return newStaff;
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  // --- Departments CRUD ---
  const addDepartment = (deptData: Omit<Department, 'id'>): Department => {
    const newDept: Department = {
      ...deptData,
      id: `dept-${Date.now()}`,
    };
    setDepartments((prev) => [...prev, newDept]);
    return newDept;
  };

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  // --- Medicines CRUD ---
  const addMedicine = (medData: Omit<Medicine, 'id'>): Medicine => {
    const newMed: Medicine = {
      ...medData,
      id: `med-${Date.now()}`,
    };
    setMedicines((prev) => [newMed, ...prev]);
    return newMed;
  };

  const updateMedicineStock = (id: string, newStock: number) => {
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const status = newStock <= 0 ? 'Out of Stock' : newStock <= m.minThreshold ? 'Low Stock' : 'In Stock';
          return { ...m, stockQuantity: newStock, status };
        }
        return m;
      })
    );
  };

  const deleteMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  // --- Lab Tests CRUD ---
  const addLabTest = (testData: Omit<LabTest, 'id' | 'testCode' | 'orderDate'>): LabTest => {
    const rand = Math.floor(100 + Math.random() * 900);
    const newTest: LabTest = {
      ...testData,
      id: `lab-${Date.now()}`,
      testCode: `LAB-ORD-${rand}`,
      orderDate: new Date().toISOString(),
    };
    setLabTests((prev) => [newTest, ...prev]);
    return newTest;
  };

  const updateLabTestStatus = (id: string, status: LabTestStatus, resultsSummary?: string) => {
    setLabTests((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          return {
            ...l,
            status,
            resultsSummary: resultsSummary || l.resultsSummary,
            completedDate: status === 'Completed' ? new Date().toISOString() : l.completedDate,
          };
        }
        return l;
      })
    );
  };

  // --- Invoices CRUD ---
  const addInvoice = (invData: Omit<Invoice, 'id' | 'invoiceNumber'>): Invoice => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const newInv: Invoice = {
      ...invData,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${year}-${rand}`,
    };
    setInvoices((prev) => [newInv, ...prev]);
    return newInv;
  };

  const updateInvoiceStatus = (id: string, status: PaymentStatus, paidAmount?: number) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          const updatedPaid = paidAmount !== undefined ? paidAmount : status === 'Paid' ? inv.totalAmount : inv.paidAmount;
          const balance = Math.max(0, inv.totalAmount - updatedPaid);
          return {
            ...inv,
            paymentStatus: status,
            paidAmount: updatedPaid,
            balanceAmount: balance,
          };
        }
        return inv;
      })
    );
  };

  // --- Notifications ---
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Live Calculated Stats
  const totalBeds = departments.reduce((acc, d) => acc + d.totalBeds, 0);
  const occupiedBeds = departments.reduce((acc, d) => acc + d.occupiedBeds, 0);
  const pendingInvoices = invoices.filter((i) => i.paymentStatus === 'Pending' || i.paymentStatus === 'Partially Paid');
  const pendingBillsAmount = pendingInvoices.reduce((acc, i) => acc + i.balanceAmount, 0);

  const stats: HospitalStats = {
    totalPatients: patients.length,
    totalDoctors: doctors.length,
    todayAppointments: appointments.length,
    pendingLabTests: labTests.filter((l) => l.status !== 'Completed' && l.status !== 'Cancelled').length,
    availableMedicines: medicines.filter((m) => m.status === 'In Stock').length,
    pendingBillsCount: pendingInvoices.length,
    pendingBillsAmount,
    bedOccupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
  };

  return (
    <HospitalContext.Provider
      value={{
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        doctors,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        staff,
        addStaff,
        updateStaff,
        deleteStaff,
        departments,
        addDepartment,
        updateDepartment,
        medicines,
        addMedicine,
        updateMedicineStock,
        deleteMedicine,
        labTests,
        addLabTest,
        updateLabTestStatus,
        invoices,
        addInvoice,
        updateInvoiceStatus,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        dismissNotification,
        stats,
        isInitialized,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospitalData = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospitalData must be used within a HospitalDataProvider');
  }
  return context;
};
