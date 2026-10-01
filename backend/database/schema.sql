-- ============================================================================
-- CarePoint Hospital Management System (HMS) - PostgreSQL Database Schema
-- Compatible with Supabase PostgreSQL, Supabase Auth & Storage
-- ============================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM (
    'Administrator',
    'Doctor',
    'Receptionist',
    'Pharmacist',
    'Lab Technician',
    'Patient'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE account_status AS ENUM ('Active', 'Inactive', 'Suspended');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM ('Scheduled', 'Completed', 'Cancelled', 'No Show');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE prescription_status AS ENUM ('Pending', 'Dispensed', 'Cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE medicine_status AS ENUM ('Available', 'Low Stock', 'Expired');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE lab_priority AS ENUM ('Routine', 'Urgent', 'Emergency');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE lab_test_status AS ENUM ('Requested', 'In Progress', 'Completed', 'Cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE bill_status AS ENUM ('Unpaid', 'Paid', 'Cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 1. HOSPITAL SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS hospital_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_name VARCHAR(255) NOT NULL DEFAULT 'CarePoint Super Specialty Hospital',
  tagline VARCHAR(255) DEFAULT 'Excellence in Healthcare & Compassionate Patient Care',
  email VARCHAR(255) NOT NULL DEFAULT 'contact@carepointhospital.org',
  phone VARCHAR(100) NOT NULL DEFAULT '+1 (800) 456-7890',
  emergency_phone VARCHAR(100) NOT NULL DEFAULT '+1 (800) 911-CARE',
  address TEXT NOT NULL DEFAULT '742 Evergreen Healthcare Ave, Medical City, MC 54321',
  working_hours TEXT DEFAULT 'Monday - Sunday: 24/7 (Emergency & IPD) | OPD: 08:00 AM - 08:00 PM',
  license_number VARCHAR(100) DEFAULT 'MED-HOSP-2026-9941',
  established_year VARCHAR(10) DEFAULT '2010',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. CENTRAL PROFILES TABLE (Linked to Supabase Auth auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE, -- References auth.users(id) in Supabase
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  gender VARCHAR(20) DEFAULT 'Male',
  date_of_birth DATE,
  address TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'Patient',
  status account_status NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- ============================================================================
-- 3. CLINICAL DEPARTMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL UNIQUE,
  head_doctor_name VARCHAR(255),
  doctors_count INT DEFAULT 0,
  description TEXT,
  status VARCHAR(20) DEFAULT 'Active',
  icon VARCHAR(50) DEFAULT 'Stethoscope',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. DOCTOR PROFILES & SPECIALIZATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  specialization VARCHAR(255) NOT NULL,
  qualification VARCHAR(255) NOT NULL,
  experience VARCHAR(50) DEFAULT '5 Years',
  room_no VARCHAR(50) DEFAULT 'OPD Room 101',
  consultation_fee NUMERIC(10,2) DEFAULT 80.00,
  available_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  available_hours VARCHAR(100) DEFAULT '09:00 AM - 02:00 PM',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctors_profile_id ON doctors(profile_id);
CREATE INDEX IF NOT EXISTS idx_doctors_department_id ON doctors(department_id);

-- ============================================================================
-- 5. PATIENTS TABLE (Medical records identifier)
-- ============================================================================
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_code VARCHAR(30) NOT NULL UNIQUE, -- Formatted code e.g. PAT-1001
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  date_of_birth DATE,
  age INT,
  gender VARCHAR(20) DEFAULT 'Male',
  blood_group VARCHAR(10) DEFAULT 'O+',
  address TEXT,
  emergency_contact VARCHAR(255),
  allergies TEXT DEFAULT 'None reported',
  chronic_conditions TEXT DEFAULT 'None',
  registered_date DATE DEFAULT CURRENT_DATE,
  last_visit DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patients_profile_id ON patients(profile_id);
CREATE INDEX IF NOT EXISTS idx_patients_patient_code ON patients(patient_code);

-- ============================================================================
-- 6. SUPPORTING STAFF TABLES (Receptionists, Pharmacists, Lab Techs, Admins)
-- ============================================================================
CREATE TABLE IF NOT EXISTS receptionists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  desk_location VARCHAR(100) DEFAULT 'Main OPD Reception Desk 1',
  shift_timing VARCHAR(100) DEFAULT 'Day Shift (08:00 AM - 04:00 PM)',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pharmacists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  license_no VARCHAR(100) DEFAULT 'PHARM-LIC-2026',
  counter_no VARCHAR(50) DEFAULT 'Dispensary Counter 1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lab_technicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  lab_room VARCHAR(100) DEFAULT 'Central Diagnostic Lab Room 104',
  specialization VARCHAR(100) DEFAULT 'Clinical Biochemistry & Hematology',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS administrators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  admin_level VARCHAR(50) DEFAULT 'Super Administrator',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 7. DOCTOR AVAILABILITY SCHEDULE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS doctor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week VARCHAR(20) NOT NULL,
  start_time TIME NOT NULL DEFAULT '09:00:00',
  end_time TIME NOT NULL DEFAULT '14:00:00',
  slot_duration_minutes INT DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctor_avail_doc ON doctor_availability(doctor_id);

-- ============================================================================
-- 8. APPOINTMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_code VARCHAR(30) NOT NULL UNIQUE, -- e.g. APT-2024-01
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  appointment_date DATE NOT NULL,
  appointment_time VARCHAR(30) NOT NULL, -- e.g. '10:30 AM'
  reason TEXT NOT NULL,
  visit_type VARCHAR(50) DEFAULT 'Regular Consultation',
  status appointment_status NOT NULL DEFAULT 'Scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appts_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appts_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appts_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appts_status ON appointments(status);

-- ============================================================================
-- 9. MEDICAL RECORDS & CONSULTATION HISTORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_code VARCHAR(30) NOT NULL UNIQUE, -- e.g. MED-REC-01
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  consultation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  diagnosis TEXT NOT NULL,
  clinical_notes TEXT NOT NULL,
  vitals JSONB DEFAULT '{}'::jsonb, -- { bp: "120/80", pulse: "72", temp: "98.6", weight: "70kg" }
  prescriptions_summary TEXT[] DEFAULT ARRAY[]::TEXT[],
  lab_tests_summary TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_med_rec_patient_id ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_med_rec_doctor_id ON medical_records(doctor_id);

-- ============================================================================
-- 10. MEDICINES & INVENTORY FORMULARY
-- ============================================================================
CREATE TABLE IF NOT EXISTS medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_code VARCHAR(30) NOT NULL UNIQUE, -- e.g. MED-101
  name VARCHAR(255) NOT NULL,
  generic_name VARCHAR(255),
  category VARCHAR(100) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  unit VARCHAR(50) NOT NULL DEFAULT 'Tablets',
  min_threshold INT NOT NULL DEFAULT 30,
  batch_no VARCHAR(100),
  expiry_date DATE NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  manufacturer VARCHAR(255),
  status medicine_status NOT NULL DEFAULT 'Available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_medicines_status ON medicines(status);
CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category);

-- ============================================================================
-- 11. PRESCRIPTIONS & PRESCRIPTION ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_code VARCHAR(30) NOT NULL UNIQUE, -- e.g. RX-501
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  diagnosis TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status prescription_status NOT NULL DEFAULT 'Pending',
  dispensed_date DATE,
  dispensed_by VARCHAR(255),
  instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rx_patient_id ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_rx_doctor_id ON prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_rx_status ON prescriptions(status);

CREATE TABLE IF NOT EXISTS prescription_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  medicine_id UUID REFERENCES medicines(id) ON DELETE SET NULL,
  medicine_name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  quantity INT NOT NULL DEFAULT 10,
  instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rx_items_rx_id ON prescription_items(prescription_id);

-- ============================================================================
-- 12. LABORATORY TESTS & COMPLETED REPORTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS lab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_code VARCHAR(30) NOT NULL UNIQUE, -- e.g. LAB-301
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  test_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'Biochemistry',
  priority lab_priority NOT NULL DEFAULT 'Routine',
  sample_type VARCHAR(100) DEFAULT 'Venous Blood',
  requested_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status lab_test_status NOT NULL DEFAULT 'Requested',
  instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lab_tests_patient ON lab_tests(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_tests_doctor ON lab_tests(doctor_id);
CREATE INDEX IF NOT EXISTS idx_lab_tests_status ON lab_tests(status);

CREATE TABLE IF NOT EXISTS lab_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_code VARCHAR(30) NOT NULL UNIQUE, -- e.g. REP-901
  test_id UUID NOT NULL UNIQUE REFERENCES lab_tests(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES lab_technicians(id) ON DELETE SET NULL,
  technician_name VARCHAR(255) DEFAULT 'Dr. Priya Sharma',
  test_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  sample_type VARCHAR(100),
  test_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  parameters JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{ parameter, result, unit, referenceRange, status }]
  remarks TEXT NOT NULL,
  technician_notes TEXT,
  report_file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lab_reports_test ON lab_reports(test_id);
CREATE INDEX IF NOT EXISTS idx_lab_reports_patient ON lab_reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_reports_doctor ON lab_reports(doctor_id);

-- ============================================================================
-- 13. BILLING INVOICES & BILL ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_code VARCHAR(30) NOT NULL UNIQUE, -- e.g. INV-801
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  discount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  tax NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  status bill_status NOT NULL DEFAULT 'Unpaid',
  payment_method VARCHAR(100),
  paid_date DATE,
  generated_by VARCHAR(255) DEFAULT 'Billing Counter',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bills_patient ON bills(patient_id);
CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status);

CREATE TABLE IF NOT EXISTS bill_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  department VARCHAR(100) DEFAULT 'General',
  amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bill_items_bill ON bill_items(bill_id);

-- ============================================================================
-- 14. NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  target_role user_role,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  related_entity_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_profile ON notifications(profile_id);
CREATE INDEX IF NOT EXISTS idx_notifications_role ON notifications(target_role);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- ============================================================================
-- 15. ACTIVITY AUDIT LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- AUTOMATIC TIMESTAMPS TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers to all mutable tables
DROP TRIGGER IF EXISTS set_timestamp_profiles ON profiles;
CREATE TRIGGER set_timestamp_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_doctors ON doctors;
CREATE TRIGGER set_timestamp_doctors BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_patients ON patients;
CREATE TRIGGER set_timestamp_patients BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_appointments ON appointments;
CREATE TRIGGER set_timestamp_appointments BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_medical_records ON medical_records;
CREATE TRIGGER set_timestamp_medical_records BEFORE UPDATE ON medical_records FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_medicines ON medicines;
CREATE TRIGGER set_timestamp_medicines BEFORE UPDATE ON medicines FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_prescriptions ON prescriptions;
CREATE TRIGGER set_timestamp_prescriptions BEFORE UPDATE ON prescriptions FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_lab_tests ON lab_tests;
CREATE TRIGGER set_timestamp_lab_tests BEFORE UPDATE ON lab_tests FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_lab_reports ON lab_reports;
CREATE TRIGGER set_timestamp_lab_reports BEFORE UPDATE ON lab_reports FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_bills ON bills;
CREATE TRIGGER set_timestamp_bills BEFORE UPDATE ON bills FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
