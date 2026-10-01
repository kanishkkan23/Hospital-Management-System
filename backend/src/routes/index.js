import express from 'express';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import departmentRoutes from './departmentRoutes.js';
import doctorRoutes from './doctorRoutes.js';
import doctorAvailabilityRoutes from './doctorAvailabilityRoutes.js';
import patientRoutes from './patientRoutes.js';
import appointmentRoutes from './appointmentRoutes.js';
import medicalRecordRoutes from './medicalRecordRoutes.js';
import prescriptionRoutes from './prescriptionRoutes.js';
import medicineRoutes from './medicineRoutes.js';
import labRoutes from './labRoutes.js';
import billingRoutes from './billingRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import settingsRoutes from './settingsRoutes.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CarePoint HMS Backend API is running smoothly',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount modules
router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/users', profileRoutes);
router.use('/departments', departmentRoutes);
router.use('/doctors', doctorRoutes);
router.use('/doctor-availability', doctorAvailabilityRoutes);
router.use('/patients', patientRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/medical-records', medicalRecordRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/medicines', medicineRoutes);
router.use('/lab-tests', labRoutes);
router.use('/lab-reports', labRoutes);
router.use('/bills', billingRoutes);
router.use('/notifications', notificationRoutes);
router.use('/settings', settingsRoutes);

export default router;
