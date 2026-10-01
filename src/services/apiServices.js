/**
 * CarePoint Hospital Management System - Centralized API Service Layer
 * Connects React Vite frontend to Express & Supabase PostgreSQL backend
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Supabase/JWT authentication token to outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('carepoint_token');
    const userRole = localStorage.getItem('carepoint_user_role');
    const userEmail = localStorage.getItem('carepoint_user_email');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (userRole) {
      config.headers['x-user-role'] = userRole;
    }
    if (userEmail) {
      config.headers['x-user-email'] = userEmail;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unwrapping standardized API response
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'API request failed';
    console.warn(`[HMS API Error] ${error.config?.url}:`, message);
    return Promise.reject(error);
  }
);

// Health check
export const checkHealth = async () => {
  try {
    return await apiClient.get('/health');
  } catch (e) {
    return { status: 'offline' };
  }
};

// 1. Authentication Services
export const authService = {
  login: async (email, password, role) => {
    const data = await apiClient.post('/auth/login', { email, password, role });
    if (data?.token || data?.session?.accessToken) {
      const token = data.token || data.session.accessToken;
      localStorage.setItem('carepoint_token', token);
      if (data.user?.role) localStorage.setItem('carepoint_user_role', data.user.role);
      if (data.user?.email) localStorage.setItem('carepoint_user_email', data.user.email);
    }
    return data;
  },

  getMe: async () => apiClient.get('/auth/me'),

  getProfile: async () => apiClient.get('/auth/profile'),

  registerPatient: async (patientData) => apiClient.post('/auth/register', patientData),

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('carepoint_token');
      localStorage.removeItem('carepoint_user_role');
      localStorage.removeItem('carepoint_user_email');
    }
  }
};

// 2. Department Services
export const departmentService = {
  getDepartments: async () => apiClient.get('/departments'),
  getById: async (id) => apiClient.get(`/departments/${id}`),
  createDepartment: async (data) => apiClient.post('/departments', data),
  updateDepartment: async (id, data) => apiClient.put(`/departments/${id}`, data),
  deleteDepartment: async (id) => apiClient.delete(`/departments/${id}`)
};

// 3. Doctor & Availability Services
export const doctorService = {
  getDoctors: async () => apiClient.get('/doctors'),
  getById: async (id) => apiClient.get(`/doctors/${id}`),
  getDoctorAvailability: async (doctorId) => apiClient.get(`/doctors/${doctorId}/availability`),
  updateAvailability: async (doctorId, schedule) => apiClient.put(`/doctor-availability/${doctorId}`, schedule)
};

// 4. Patient Services
export const patientService = {
  getPatients: async () => apiClient.get('/patients'),
  getPatientById: async (id) => apiClient.get(`/patients/${id}`),
  createPatient: async (patientData) => apiClient.post('/patients', patientData),
  updatePatient: async (id, patientData) => apiClient.put(`/patients/${id}`, patientData),
  getAppointments: async (id) => apiClient.get(`/patients/${id}/appointments`),
  getPrescriptions: async (id) => apiClient.get(`/patients/${id}/prescriptions`),
  getLabReports: async (id) => apiClient.get(`/patients/${id}/lab-reports`),
  getBills: async (id) => apiClient.get(`/patients/${id}/bills`)
};

// 5. Appointment Services
export const appointmentService = {
  getAppointments: async (params = {}) => apiClient.get('/appointments', { params }),
  getById: async (id) => apiClient.get(`/appointments/${id}`),
  createAppointment: async (appointmentData) => apiClient.post('/appointments', appointmentData),
  updateAppointmentStatus: async (id, status) => apiClient.patch(`/appointments/${id}/status`, { status }),
  rescheduleAppointment: async (id, date, time) => apiClient.patch(`/appointments/${id}/reschedule`, { date, time }),
  cancelAppointment: async (id, reason) => apiClient.patch(`/appointments/${id}/cancel`, { reason })
};

// 6. Medical Record Services
export const medicalRecordService = {
  getMedicalRecords: async (params = {}) => apiClient.get('/medical-records', { params }),
  getPatientHistory: async (patientId) => apiClient.get(`/medical-records/patient/${patientId}`),
  createMedicalRecord: async (recordData) => apiClient.post('/medical-records', recordData)
};

// 7. Prescription Services
export const prescriptionService = {
  getPrescriptions: async (params = {}) => apiClient.get('/prescriptions', { params }),
  createPrescription: async (rxData) => apiClient.post('/prescriptions', rxData),
  dispensePrescription: async (id) => apiClient.patch(`/prescriptions/${id}/dispense`, {})
};

// 8. Medicine & Pharmacy Inventory Services
export const medicineService = {
  getMedicines: async (params = {}) => apiClient.get('/medicines', { params }),
  getLowStock: async () => apiClient.get('/medicines/low-stock'),
  createMedicine: async (medData) => apiClient.post('/medicines', medData),
  updateMedicine: async (id, medData) => apiClient.put(`/medicines/${id}`, medData),
  updateStock: async (id, quantity, operation) => apiClient.patch(`/medicines/${id}/stock`, { quantity, operation })
};

// 9. Laboratory Testing & Diagnostic Report Services
export const labService = {
  getLabTests: async (params = {}) => apiClient.get('/lab-tests/tests', { params }),
  requestTest: async (testData) => apiClient.post('/lab-tests/tests', testData),
  startTest: async (id) => apiClient.patch(`/lab-tests/tests/${id}/start`, {}),
  getLabReports: async (params = {}) => apiClient.get('/lab-tests/reports', { params }),
  submitLabReport: async (reportData) => apiClient.post('/lab-tests/reports', reportData)
};

// 10. Billing & Invoice Services
export const billingService = {
  getBills: async (params = {}) => apiClient.get('/bills', { params }),
  createBill: async (billData) => apiClient.post('/bills', billData),
  updateBillStatus: async (id, status, paymentMethod = 'Credit Card') => apiClient.patch(`/bills/${id}/status`, { status, paymentMethod })
};

// 11. Notification Services
export const notificationService = {
  getNotifications: async () => apiClient.get('/notifications'),
  markAsRead: async (id) => apiClient.patch(`/notifications/${id}/read`, {}),
  markAllAsRead: async () => apiClient.patch('/notifications/read-all', {})
};

// 12. Settings & Audit Log Services
export const settingsService = {
  getSettings: async () => apiClient.get('/settings'),
  updateSettings: async (settingsData) => apiClient.put('/settings', settingsData),
  getActivityLogs: async () => apiClient.get('/settings/activity-logs')
};
