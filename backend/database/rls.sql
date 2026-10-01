-- ============================================================================
-- CarePoint Hospital Management System (HMS) - Row Level Security (RLS) Policies
-- Multi-Role Database Level Security for Supabase PostgreSQL
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE receptionists ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacists ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE administrators ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTIONS FOR ROLE AND PROFILE RESOLUTION
-- ============================================================================

CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_current_profile_id()
RETURNS UUID AS $$
  SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_current_patient_id()
RETURNS UUID AS $$
  SELECT p.id FROM patients p
  JOIN profiles pr ON pr.id = p.profile_id
  WHERE pr.user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_current_doctor_id()
RETURNS UUID AS $$
  SELECT d.id FROM doctors d
  JOIN profiles pr ON pr.id = d.profile_id
  WHERE pr.user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================================
-- 1. PROFILES POLICIES
-- ============================================================================
CREATE POLICY "Public / Authenticated can view active staff and doctors"
ON profiles FOR SELECT
USING (
  user_id = auth.uid()
  OR role IN ('Doctor', 'Administrator', 'Receptionist', 'Pharmacist', 'Lab Technician')
  OR get_current_user_role() IN ('Administrator', 'Doctor', 'Receptionist')
);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Administrators full management of profiles"
ON profiles FOR ALL
USING (get_current_user_role() = 'Administrator');

-- ============================================================================
-- 2. DEPARTMENTS POLICIES
-- ============================================================================
CREATE POLICY "Anyone can view clinical departments"
ON departments FOR SELECT
USING (true);

CREATE POLICY "Administrators can manage departments"
ON departments FOR ALL
USING (get_current_user_role() = 'Administrator');

-- ============================================================================
-- 3. DOCTORS & AVAILABILITY POLICIES
-- ============================================================================
CREATE POLICY "Anyone can view doctor listings and schedules"
ON doctors FOR SELECT
USING (true);

CREATE POLICY "Doctors can update their own clinical info"
ON doctors FOR UPDATE
USING (profile_id = get_current_profile_id())
WITH CHECK (profile_id = get_current_profile_id());

CREATE POLICY "Administrators can manage doctors"
ON doctors FOR ALL
USING (get_current_user_role() = 'Administrator');

CREATE POLICY "Anyone can view doctor availability"
ON doctor_availability FOR SELECT
USING (true);

CREATE POLICY "Doctors and Admins manage availability"
ON doctor_availability FOR ALL
USING (
  doctor_id = get_current_doctor_id()
  OR get_current_user_role() = 'Administrator'
);

-- ============================================================================
-- 4. PATIENTS POLICIES
-- ============================================================================
CREATE POLICY "Patients can view their own patient profile"
ON patients FOR SELECT
USING (
  profile_id = get_current_profile_id()
  OR get_current_user_role() IN ('Administrator', 'Doctor', 'Receptionist')
);

CREATE POLICY "Patients can update their own details"
ON patients FOR UPDATE
USING (profile_id = get_current_profile_id())
WITH CHECK (profile_id = get_current_profile_id());

CREATE POLICY "Receptionists and Admins can register and manage patients"
ON patients FOR ALL
USING (get_current_user_role() IN ('Administrator', 'Receptionist'));

-- ============================================================================
-- 5. APPOINTMENTS POLICIES
-- ============================================================================
CREATE POLICY "Patients view own appointments, Doctors view assigned, Staff view all"
ON appointments FOR SELECT
USING (
  patient_id = get_current_patient_id()
  OR doctor_id = get_current_doctor_id()
  OR get_current_user_role() IN ('Administrator', 'Receptionist')
);

CREATE POLICY "Patients can book and cancel their own appointments"
ON appointments FOR INSERT
WITH CHECK (
  patient_id = get_current_patient_id()
  OR get_current_user_role() IN ('Administrator', 'Receptionist')
);

CREATE POLICY "Staff and Doctors can update appointments"
ON appointments FOR UPDATE
USING (
  patient_id = get_current_patient_id()
  OR doctor_id = get_current_doctor_id()
  OR get_current_user_role() IN ('Administrator', 'Receptionist')
);

-- ============================================================================
-- 6. MEDICAL RECORDS POLICIES
-- ============================================================================
CREATE POLICY "Patients view own records, Doctors and Admins clinical access"
ON medical_records FOR SELECT
USING (
  patient_id = get_current_patient_id()
  OR doctor_id = get_current_doctor_id()
  OR get_current_user_role() = 'Administrator'
);

CREATE POLICY "Doctors can create and update medical records"
ON medical_records FOR ALL
USING (
  doctor_id = get_current_doctor_id()
  OR get_current_user_role() = 'Administrator'
);

-- ============================================================================
-- 7. PRESCRIPTIONS & MEDICINES POLICIES
-- ============================================================================
CREATE POLICY "Authenticated users can read medicine catalog"
ON medicines FOR SELECT
USING (true);

CREATE POLICY "Pharmacists and Admins can manage medicines"
ON medicines FOR ALL
USING (get_current_user_role() IN ('Administrator', 'Pharmacist'));

CREATE POLICY "Prescription access by role"
ON prescriptions FOR SELECT
USING (
  patient_id = get_current_patient_id()
  OR doctor_id = get_current_doctor_id()
  OR get_current_user_role() IN ('Administrator', 'Pharmacist')
);

CREATE POLICY "Doctors create prescriptions, Pharmacists dispense"
ON prescriptions FOR ALL
USING (
  doctor_id = get_current_doctor_id()
  OR get_current_user_role() IN ('Administrator', 'Pharmacist')
);

CREATE POLICY "Prescription items readable"
ON prescription_items FOR SELECT
USING (true);

CREATE POLICY "Prescription items manageable by Doctor & Admin"
ON prescription_items FOR ALL
USING (get_current_user_role() IN ('Administrator', 'Doctor', 'Pharmacist'));

-- ============================================================================
-- 8. LAB TESTS & LAB REPORTS POLICIES
-- ============================================================================
CREATE POLICY "Lab tests viewable by patient, doctor, tech, admin"
ON lab_tests FOR SELECT
USING (
  patient_id = get_current_patient_id()
  OR doctor_id = get_current_doctor_id()
  OR get_current_user_role() IN ('Administrator', 'Lab Technician')
);

CREATE POLICY "Doctors order tests, Lab Techs update status"
ON lab_tests FOR ALL
USING (
  doctor_id = get_current_doctor_id()
  OR get_current_user_role() IN ('Administrator', 'Lab Technician')
);

CREATE POLICY "Lab reports accessible to patient, doctor, tech, admin"
ON lab_reports FOR SELECT
USING (
  patient_id = get_current_patient_id()
  OR doctor_id = get_current_doctor_id()
  OR get_current_user_role() IN ('Administrator', 'Lab Technician')
);

CREATE POLICY "Lab Techs and Admins publish reports"
ON lab_reports FOR ALL
USING (get_current_user_role() IN ('Administrator', 'Lab Technician'));

-- ============================================================================
-- 9. BILLING POLICIES
-- ============================================================================
CREATE POLICY "Patients view own bills, Receptionists and Admins manage"
ON bills FOR SELECT
USING (
  patient_id = get_current_patient_id()
  OR get_current_user_role() IN ('Administrator', 'Receptionist')
);

CREATE POLICY "Receptionists and Admins manage bills"
ON bills FOR ALL
USING (get_current_user_role() IN ('Administrator', 'Receptionist'));

CREATE POLICY "Bill items viewable and manageable"
ON bill_items FOR ALL
USING (
  get_current_user_role() IN ('Administrator', 'Receptionist')
  OR EXISTS (
    SELECT 1 FROM bills b WHERE b.id = bill_items.bill_id AND b.patient_id = get_current_patient_id()
  )
);

-- ============================================================================
-- 10. NOTIFICATIONS POLICIES
-- ============================================================================
CREATE POLICY "Users access their own notifications"
ON notifications FOR ALL
USING (
  profile_id = get_current_profile_id()
  OR target_role = get_current_user_role()
  OR get_current_user_role() = 'Administrator'
);

-- ============================================================================
-- 11. HOSPITAL SETTINGS & AUDIT LOGS
-- ============================================================================
CREATE POLICY "Anyone can view hospital settings"
ON hospital_settings FOR SELECT
USING (true);

CREATE POLICY "Administrators manage hospital settings"
ON hospital_settings FOR ALL
USING (get_current_user_role() = 'Administrator');

CREATE POLICY "Staff can view activity logs"
ON activity_logs FOR SELECT
USING (get_current_user_role() IN ('Administrator', 'Doctor', 'Receptionist', 'Pharmacist', 'Lab Technician'));

CREATE POLICY "System can record activity logs"
ON activity_logs FOR INSERT
WITH CHECK (true);
