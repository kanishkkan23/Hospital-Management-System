import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HospitalProvider } from './context/HospitalContext';

// Consolidated Pages
import { PublicLandingPage } from './pages/PublicPages';
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from './pages/AuthPages';
import { PatientPortal } from './pages/PatientPortal';
import { DoctorPortal } from './pages/DoctorPortal';
import { ReceptionistPortal } from './pages/ReceptionistPortal';
import { PharmacistPortal } from './pages/PharmacistPortal';
import { LabTechnicianPortal } from './pages/LabTechnicianPortal';
import { AdminPortal } from './pages/AdminPortal';

export function App() {
  return (
    <HospitalProvider>
      <Router>
        <Routes>
          {/* Public Landing & Information */}
          <Route path="/" element={<PublicLandingPage />} />
          <Route path="/about" element={<PublicLandingPage />} />
          <Route path="/departments" element={<PublicLandingPage />} />
          <Route path="/doctors" element={<PublicLandingPage />} />
          <Route path="/services" element={<PublicLandingPage />} />
          <Route path="/contact" element={<PublicLandingPage />} />

          {/* Authentication Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Patient Portal Routes */}
          <Route path="/patient" element={<PatientPortal view="dashboard" />} />
          <Route path="/patient/profile" element={<PatientPortal view="profile" />} />
          <Route path="/patient/book" element={<PatientPortal view="book" />} />
          <Route path="/patient/appointments" element={<PatientPortal view="appointments" />} />
          <Route path="/patient/history" element={<PatientPortal view="history" />} />
          <Route path="/patient/prescriptions" element={<PatientPortal view="prescriptions" />} />
          <Route path="/patient/lab-reports" element={<PatientPortal view="lab-reports" />} />
          <Route path="/patient/bills" element={<PatientPortal view="bills" />} />
          <Route path="/patient/notifications" element={<PatientPortal view="notifications" />} />

          {/* Doctor Portal Routes */}
          <Route path="/doctor" element={<DoctorPortal view="dashboard" />} />
          <Route path="/doctor/appointments" element={<DoctorPortal view="appointments" />} />
          <Route path="/doctor/patients" element={<DoctorPortal view="patients" />} />
          <Route path="/doctor/records" element={<DoctorPortal view="records" />} />
          <Route path="/doctor/prescriptions" element={<DoctorPortal view="prescriptions" />} />
          <Route path="/doctor/lab-tests" element={<DoctorPortal view="lab-tests" />} />
          <Route path="/doctor/profile" element={<DoctorPortal view="profile" />} />
          <Route path="/doctor/notifications" element={<DoctorPortal view="profile" />} />

          {/* Receptionist Portal Routes */}
          <Route path="/receptionist" element={<ReceptionistPortal view="dashboard" />} />
          <Route path="/receptionist/register" element={<ReceptionistPortal view="register" />} />
          <Route path="/receptionist/patients" element={<ReceptionistPortal view="patients" />} />
          <Route path="/receptionist/appointments" element={<ReceptionistPortal view="appointments" />} />
          <Route path="/receptionist/doctors" element={<ReceptionistPortal view="doctors" />} />
          <Route path="/receptionist/billing" element={<ReceptionistPortal view="billing" />} />
          <Route path="/receptionist/profile" element={<ReceptionistPortal view="profile" />} />
          <Route path="/receptionist/notifications" element={<ReceptionistPortal view="profile" />} />

          {/* Pharmacist Portal Routes */}
          <Route path="/pharmacist" element={<PharmacistPortal view="dashboard" />} />
          <Route path="/pharmacist/prescriptions" element={<PharmacistPortal view="prescriptions" />} />
          <Route path="/pharmacist/medicines" element={<PharmacistPortal view="medicines" />} />
          <Route path="/pharmacist/inventory" element={<PharmacistPortal view="inventory" />} />
          <Route path="/pharmacist/dispense" element={<PharmacistPortal view="dispense" />} />
          <Route path="/pharmacist/profile" element={<PharmacistPortal view="profile" />} />
          <Route path="/pharmacist/notifications" element={<PharmacistPortal view="profile" />} />

          {/* Lab Technician Portal Routes */}
          <Route path="/lab" element={<LabTechnicianPortal view="dashboard" />} />
          <Route path="/lab/tests" element={<LabTechnicianPortal view="tests" />} />
          <Route path="/lab/pending" element={<LabTechnicianPortal view="pending" />} />
          <Route path="/lab/completed" element={<LabTechnicianPortal view="completed" />} />
          <Route path="/lab/reports" element={<LabTechnicianPortal view="reports" />} />
          <Route path="/lab/profile" element={<LabTechnicianPortal view="profile" />} />
          <Route path="/lab/notifications" element={<LabTechnicianPortal view="profile" />} />

          {/* Administrator Portal Routes */}
          <Route path="/admin" element={<AdminPortal view="dashboard" />} />
          <Route path="/admin/users" element={<AdminPortal view="users" />} />
          <Route path="/admin/doctors" element={<AdminPortal view="doctors" />} />
          <Route path="/admin/patients" element={<AdminPortal view="patients" />} />
          <Route path="/admin/receptionists" element={<AdminPortal view="receptionists" />} />
          <Route path="/admin/pharmacists" element={<AdminPortal view="pharmacists" />} />
          <Route path="/admin/lab-techs" element={<AdminPortal view="lab-techs" />} />
          <Route path="/admin/departments" element={<AdminPortal view="departments" />} />
          <Route path="/admin/appointments" element={<AdminPortal view="appointments" />} />
          <Route path="/admin/medicines" element={<AdminPortal view="medicines" />} />
          <Route path="/admin/lab-tests" element={<AdminPortal view="lab-tests" />} />
          <Route path="/admin/billing" element={<AdminPortal view="billing" />} />
          <Route path="/admin/settings" element={<AdminPortal view="settings" />} />
          <Route path="/admin/notifications" element={<AdminPortal view="dashboard" />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </HospitalProvider>
  );
}

export default App;
