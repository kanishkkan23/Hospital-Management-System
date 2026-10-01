-- ============================================================================
-- CarePoint Hospital Management System (HMS) - Deterministic Seed Data
-- ============================================================================

-- Clean existing data in reverse foreign-key order
TRUNCATE TABLE
  bill_items,
  bills,
  lab_reports,
  lab_tests,
  prescription_items,
  prescriptions,
  medicines,
  medical_records,
  appointments,
  doctor_availability,
  administrators,
  lab_technicians,
  pharmacists,
  receptionists,
  patients,
  doctors,
  departments,
  notifications,
  activity_logs,
  profiles,
  hospital_settings
CASCADE;

-- 1. Insert Hospital Settings
INSERT INTO hospital_settings (
  id, hospital_name, tagline, email, phone, emergency_phone, address, working_hours, license_number, established_year
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'CarePoint Super Specialty Hospital',
  'Excellence in Healthcare & Compassionate Patient Care',
  'contact@carepointhospital.org',
  '+1 (800) 456-7890',
  '+1 (800) 911-CARE',
  '742 Evergreen Healthcare Ave, Medical City, MC 54321',
  'Monday - Sunday: 24/7 (Emergency & IPD) | OPD: 08:00 AM - 08:00 PM',
  'MED-HOSP-2026-9941',
  '2010'
);

-- 2. Insert Profiles
INSERT INTO profiles (id, full_name, email, phone, gender, date_of_birth, address, avatar_url, role, status) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001', 'Dr. Arthur Vance', 'admin@carepoint.com', '+1 (555) 019-2831', 'Male', '1975-03-20', 'Admin Suite 1, CarePoint Hospital', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'Administrator', 'Active'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0002', 'Dr. Sarah Jenkins', 'doctor@carepoint.com', '+1 (555) 012-3456', 'Female', '1982-08-14', '74 Medical Row, Medical City, MC', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80', 'Doctor', 'Active'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0003', 'Dr. Michael Chen', 'chen@carepoint.com', '+1 (555) 013-7890', 'Male', '1985-11-04', '88 Neuro Way, Medical City, MC', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80', 'Doctor', 'Active'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0004', 'Dr. Elena Rostova', 'elena@carepoint.com', '+1 (555) 014-9921', 'Female', '1978-05-19', '12 Child Health Lane, Medical City', 'https://images.unsplash.com/photo-1594824813689-d128d578636f?w=150&auto=format&fit=crop&q=80', 'Doctor', 'Active'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0005', 'Dr. David Miller', 'miller@carepoint.com', '+1 (555) 015-8833', 'Male', '1980-02-11', '90 Spine Center Blvd, Medical City', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80', 'Doctor', 'Active'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0006', 'Rachel Cooper', 'reception@carepoint.com', '+1 (555) 016-4422', 'Female', '1992-09-25', '22 Front Plaza, Medical City, MC', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'Receptionist', 'Active'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0007', 'James Wilson', 'pharmacy@carepoint.com', '+1 (555) 017-5511', 'Male', '1987-12-30', '15 Apothecary Road, Medical City', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', 'Pharmacist', 'Active'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0008', 'Dr. Priya Sharma', 'lab@carepoint.com', '+1 (555) 018-6677', 'Female', '1989-07-15', '33 Diagnostics Ave, Medical City', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', 'Lab Technician', 'Active'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0009', 'Johnathan Doe', 'patient@carepoint.com', '+1 (555) 019-1100', 'Male', '1988-05-14', '45 Riverfront Lane, Suite 102, Medical City', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'Patient', 'Active'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0010', 'Emily Watson', 'emily.watson@gmail.com', '+1 (555) 021-9988', 'Female', '1995-11-23', '128 Pinecrest Blvd, Apt 4B, Medical City', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'Patient', 'Active'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0011', 'Robert Martinez', 'robert.m@gmail.com', '+1 (555) 032-4411', 'Male', '1972-02-08', '89 Oakridge Drive, Medical City, MC', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'Patient', 'Active'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0012', 'Clara Oswald', 'clara.oswald@yahoo.com', '+1 (555) 043-6622', 'Female', '1990-08-30', '310 Meadow Lane, Medical City, MC', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'Patient', 'Active'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0013', 'Henry Cavill', 'henry.c@outlook.com', '+1 (555) 054-7733', 'Male', '1983-04-12', '512 Highland Crescent, Medical City, MC', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', 'Patient', 'Active');

-- 3. Insert Departments
INSERT INTO departments (id, code, name, head_doctor_name, doctors_count, description, icon) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0001', 'GM', 'General Medicine', 'Dr. Thomas Wright', 4, 'Comprehensive primary healthcare, chronic illness management, and preventative screenings.', 'Stethoscope'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0002', 'CARD', 'Cardiology', 'Dr. Sarah Jenkins', 3, 'Advanced cardiac care, coronary intervention, non-invasive diagnostics, and heart failure care.', 'HeartPulse'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0003', 'NEUR', 'Neurology', 'Dr. Michael Chen', 2, 'Specialized care for brain disorders, stroke management, epilepsy care, and neurophysiology.', 'Brain'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0004', 'ORTH', 'Orthopedics', 'Dr. David Miller', 3, 'Bone, joint, ligament, and spine disorders, fracture trauma, and joint replacement surgery.', 'Bone'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0005', 'PED', 'Pediatrics', 'Dr. Elena Rostova', 3, 'Comprehensive care for infants, children, immunizations, and developmental assessments.', 'Baby'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0006', 'DERM', 'Dermatology', 'Dr. Sophia Adams', 2, 'Clinical skin condition management, psoriasis, eczema, allergy diagnostics, and cosmetic dermatology.', 'Sparkles'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0007', 'GYN', 'Gynecology & Obstetrics', 'Dr. Rebecca Harris', 3, 'Women wellness, prenatal/postnatal maternity care, high-risk pregnancy management, and surgery.', 'ShieldAlert'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0008', 'SURG', 'General Surgery', 'Dr. Marcus Bell', 4, 'State-of-the-art operating theaters for abdominal, laparoscopic, and elective general surgical procedures.', 'Scissors');

-- 4. Insert Doctors
INSERT INTO doctors (id, profile_id, department_id, specialization, qualification, experience, room_no, consultation_fee, available_days, available_hours) VALUES
('cccccccc-cccc-cccc-cccc-cccccccc0001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0002', 'Senior Interventional Cardiologist', 'MD, DM (Cardiology), FACC', '12 Years', 'OPD Room 204', 100.00, ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], '09:00 AM - 02:00 PM'),
('cccccccc-cccc-cccc-cccc-cccccccc0002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0003', 'Consultant Neurologist', 'MBBS, MD, DM (Neurology)', '9 Years', 'OPD Room 308', 95.00, ARRAY['Tuesday', 'Thursday', 'Saturday'], '10:00 AM - 04:00 PM'),
('cccccccc-cccc-cccc-cccc-cccccccc0003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0005', 'Child Specialist & Neonatologist', 'MBBS, DCH, MD (Pediatrics)', '14 Years', 'OPD Room 102', 90.00, ARRAY['Monday', 'Wednesday', 'Friday'], '08:30 AM - 01:30 PM'),
('cccccccc-cccc-cccc-cccc-cccccccc0004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0005', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0004', 'Joint Replacement & Spine Surgeon', 'MS (Ortho), M.Ch (Ortho)', '15 Years', 'OPD Room 405', 110.00, ARRAY['Monday', 'Tuesday', 'Thursday', 'Friday'], '11:00 AM - 05:00 PM');

-- 5. Insert Patients
INSERT INTO patients (id, patient_code, profile_id, date_of_birth, age, gender, blood_group, address, emergency_contact, allergies, chronic_conditions, registered_date, last_visit) VALUES
('dddddddd-dddd-dddd-dddd-dddddddd0001', 'PAT-1001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0009', '1988-05-14', 38, 'Male', 'O+', '45 Riverfront Lane, Suite 102, Medical City', 'Jane Doe (Wife) - +1 (555) 019-1105', 'Penicillin, Sulfa drugs', 'Mild Essential Hypertension', '2023-01-20', '2026-09-20'),
('dddddddd-dddd-dddd-dddd-dddddddd0002', 'PAT-1002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0010', '1995-11-23', 30, 'Female', 'A+', '128 Pinecrest Blvd, Apt 4B, Medical City', 'Robert Watson (Father) - +1 (555) 021-9980', 'None known', 'None', '2024-03-11', '2026-09-28'),
('dddddddd-dddd-dddd-dddd-dddddddd0003', 'PAT-1003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0011', '1972-02-08', 54, 'Male', 'B+', '89 Oakridge Drive, Medical City, MC', 'Maria Martinez (Spouse) - +1 (555) 032-4412', 'Aspirin', 'Type 2 Diabetes Mellitus', '2023-07-19', '2026-09-25'),
('dddddddd-dddd-dddd-dddd-dddddddd0004', 'PAT-1004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0012', '1990-08-30', 36, 'Female', 'AB+', '310 Meadow Lane, Medical City, MC', 'George Oswald (Brother) - +1 (555) 043-6623', 'Latex', 'Asthma', '2024-01-15', '2026-09-26'),
('dddddddd-dddd-dddd-dddd-dddddddd0005', 'PAT-1005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0013', '1983-04-12', 43, 'Male', 'O-', '512 Highland Crescent, Medical City, MC', 'Katherine C (Sister) - +1 (555) 054-7735', 'None', 'Post-surgery knee rehab', '2024-05-08', '2026-09-27');

-- 6. Insert Supporting Staff
INSERT INTO administrators (profile_id, admin_level) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001', 'Chief Medical Officer');
INSERT INTO receptionists (profile_id, desk_location, shift_timing) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0006', 'Main OPD Front Desk', '08:00 AM - 04:00 PM');
INSERT INTO pharmacists (profile_id, license_no, counter_no) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0007', 'PHARM-8890-MC', 'Central Pharmacy Counter 1');
INSERT INTO lab_technicians (profile_id, lab_room, specialization) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0008', 'Pathology Lab Room 104', 'Diagnostic Pathology & Clinical Biochemistry');

-- 7. Insert Medicines
INSERT INTO medicines (id, medicine_code, name, generic_name, category, stock, unit, min_threshold, batch_no, expiry_date, unit_price, manufacturer, status) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0001', 'MED-101', 'Amlodipine 5mg', 'Amlodipine Besylate', 'Cardiovascular', 240, 'Tablets', 50, 'AML-2025-09', '2027-08-31', 12.50, 'Pfizer Global Health', 'Available'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0002', 'MED-102', 'Amoxicillin & Clavulanate 625mg', 'Amoxicillin + Clavulanic Acid', 'Antibiotics', 15, 'Tablets', 40, 'AMX-2024-11', '2026-12-31', 24.00, 'GlaxoSmithKline', 'Low Stock'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0003', 'MED-103', 'Metoprolol Succinate 25mg', 'Metoprolol Succinate ER', 'Cardiovascular', 180, 'Tablets', 30, 'MET-2025-01', '2027-05-15', 18.00, 'AstraZeneca', 'Available'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0004', 'MED-104', 'Atorvastatin 20mg', 'Atorvastatin Calcium', 'Lipid Regulating', 310, 'Tablets', 50, 'ATV-2025-06', '2027-10-30', 22.00, 'Sun Pharma Med', 'Available'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0005', 'MED-105', 'Montelukast Sodium 10mg', 'Montelukast Sodium', 'Respiratory', 85, 'Tablets', 20, 'MNT-2024-03', '2026-11-20', 16.50, 'Merck Healthcare', 'Available'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0006', 'MED-106', 'Levocetirizine 5mg', 'Levocetirizine Dihydrochloride', 'Antihistamine', 120, 'Tablets', 30, 'LEV-2025-04', '2027-04-10', 9.00, 'Cipla Therapeutics', 'Available'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0007', 'MED-107', 'Metformin 500mg ER', 'Metformin Hydrochloride', 'Endocrinology', 450, 'Tablets', 60, 'MET-2025-08', '2027-09-12', 14.00, 'Bristol Myers', 'Available'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeee0008', 'MED-108', 'Paracetamol 650mg', 'Acetaminophen', 'Analgesic / Antipyretic', 800, 'Tablets', 100, 'PCM-2025-07', '2028-02-28', 5.00, 'GSK Healthcare', 'Available');

-- 8. Insert Appointments
INSERT INTO appointments (id, appointment_code, patient_id, doctor_id, department_id, appointment_date, appointment_time, reason, visit_type, status, notes) VALUES
('ffffffff-ffff-ffff-ffff-ffffffff0001', 'APT-2024-01', 'dddddddd-dddd-dddd-dddd-dddddddd0001', 'cccccccc-cccc-cccc-cccc-cccccccc0001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0002', '2026-09-30', '10:30 AM', 'Routine Cardiac Follow-up & Blood Pressure Evaluation', 'Follow-up', 'Scheduled', 'Patient experienced mild palpitations last week.'),
('ffffffff-ffff-ffff-ffff-ffffffff0002', 'APT-2024-02', 'dddddddd-dddd-dddd-dddd-dddddddd0002', 'cccccccc-cccc-cccc-cccc-cccccccc0002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0003', '2026-09-30', '11:15 AM', 'Persistent Migraine with visual aura for 3 days', 'New Consultation', 'Scheduled', 'No relief with OTC acetaminophen.'),
('ffffffff-ffff-ffff-ffff-ffffffff0003', 'APT-2024-03', 'dddddddd-dddd-dddd-dddd-dddddddd0003', 'cccccccc-cccc-cccc-cccc-cccccccc0001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0002', '2026-09-30', '12:00 PM', 'Post-Angiography lipid profile review', 'Follow-up', 'Scheduled', 'Requires updated lipid profile lab review.'),
('ffffffff-ffff-ffff-ffff-ffffffff0004', 'APT-2024-04', 'dddddddd-dddd-dddd-dddd-dddddddd0004', 'cccccccc-cccc-cccc-cccc-cccccccc0003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0005', '2026-09-29', '09:30 AM', 'Seasonal bronchospasm checkup and inhaler review', 'Follow-up', 'Completed', 'Chest clear on auscultation. Inhaler dosage renewed.');

-- 9. Insert Medical Records
INSERT INTO medical_records (id, record_code, patient_id, doctor_id, consultation_date, diagnosis, clinical_notes, vitals, prescriptions_summary, lab_tests_summary) VALUES
('10101010-1010-1010-1010-101010100001', 'MED-REC-01', 'dddddddd-dddd-dddd-dddd-dddddddd0001', 'cccccccc-cccc-cccc-cccc-cccccccc0001', '2026-09-20', 'Primary Stage-1 Hypertension', 'Patient reported occasional dizziness following brisk walks. Blood pressure measured at 144/92 mmHg, pulse 88 bpm. Ordered CBC, Lipid panel, and initiated Amlodipine + Metoprolol therapy.', '{"bp":"144/92 mmHg","pulse":"88 bpm","temp":"98.4 F","weight":"74 kg"}'::jsonb, ARRAY['RX-501 (Amlodipine 5mg, Metoprolol 25mg)'], ARRAY['LAB-301 (CBC with ESR)', 'LAB-302 (Lipid Profile & Electrolytes)']);

-- 10. Insert Prescriptions & Prescription Items
INSERT INTO prescriptions (id, prescription_code, patient_id, doctor_id, diagnosis, date, status, dispensed_date, dispensed_by, instructions) VALUES
('20202020-2020-2020-2020-202020200001', 'RX-501', 'dddddddd-dddd-dddd-dddd-dddddddd0001', 'cccccccc-cccc-cccc-cccc-cccccccc0001', 'Primary Stage-1 Hypertension with mild sinus tachycardia', '2026-09-20', 'Dispensed', '2026-09-20', 'James Wilson (Pharmacist)', 'Take medications daily after breakfast. Restrict dietary sodium (<2g/day). Monitor morning BP.'),
('20202020-2020-2020-2020-202020200002', 'RX-502', 'dddddddd-dddd-dddd-dddd-dddddddd0004', 'cccccccc-cccc-cccc-cccc-cccccccc0003', 'Mild Bronchial Hyperresponsiveness', '2026-09-29', 'Pending', NULL, NULL, 'Use inhaler twice daily. Rinse mouth thoroughly with water after inhalation.');

INSERT INTO prescription_items (prescription_id, medicine_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
('20202020-2020-2020-2020-202020200001', 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0001', 'Amlodipine 5mg', '5mg', 'Once daily (Morning)', '30 Days', 30, 'Take after breakfast with water'),
('20202020-2020-2020-2020-202020200001', 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0003', 'Metoprolol Succinate 25mg', '25mg', 'Once daily (Morning)', '30 Days', 30, 'Do not skip doses. Monitor pulse.'),
('20202020-2020-2020-2020-202020200002', 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0005', 'Montelukast Sodium 10mg', '10mg', 'Once daily (Night)', '14 Days', 14, 'Take at bedtime with water');

-- 11. Insert Lab Tests & Reports
INSERT INTO lab_tests (id, test_code, patient_id, doctor_id, test_name, category, priority, sample_type, requested_date, status, instructions) VALUES
('30303030-3030-3030-3030-303030300001', 'LAB-301', 'dddddddd-dddd-dddd-dddd-dddddddd0001', 'cccccccc-cccc-cccc-cccc-cccccccc0001', 'Complete Blood Count (CBC) with ESR', 'Hematology', 'Routine', 'Whole Blood (EDTA)', '2026-09-20', 'Completed', 'Assess baseline hematological indices.'),
('30303030-3030-3030-3030-303030300002', 'LAB-302', 'dddddddd-dddd-dddd-dddd-dddddddd0001', 'cccccccc-cccc-cccc-cccc-cccccccc0001', 'Lipid Profile & Serum Electrolytes', 'Biochemistry', 'Routine', 'Serum (Fasting)', '2026-09-20', 'Completed', 'Fasting lipid panel to evaluate cardiovascular atherogenic risk.'),
('30303030-3030-3030-3030-303030300003', 'LAB-303', 'dddddddd-dddd-dddd-dddd-dddddddd0003', 'cccccccc-cccc-cccc-cccc-cccccccc0001', 'Glycated Hemoglobin (HbA1c)', 'Biochemistry', 'Routine', 'Whole Blood (EDTA)', '2026-09-28', 'In Progress', 'Evaluate 3-month glycemic control.');

INSERT INTO lab_reports (id, report_code, test_id, patient_id, doctor_id, technician_id, technician_name, test_name, category, sample_type, test_date, completed_date, parameters, remarks, technician_notes) VALUES
('40404040-4040-4040-4040-404040400001', 'REP-901', '30303030-3030-3030-3030-303030300001', 'dddddddd-dddd-dddd-dddd-dddddddd0001', 'cccccccc-cccc-cccc-cccc-cccccccc0001', NULL, 'Dr. Priya Sharma', 'Complete Blood Count (CBC) with ESR', 'Hematology', 'Whole Blood (EDTA)', '2026-09-21', '2026-09-21',
'[{"parameter":"Hemoglobin (Hb)","result":"14.8","unit":"g/dL","referenceRange":"13.5 - 17.5","status":"Normal"},{"parameter":"Total Leucocyte Count (TLC)","result":"6,800","unit":"/cumm","referenceRange":"4,000 - 11,000","status":"Normal"},{"parameter":"Platelet Count","result":"245,000","unit":"/cumm","referenceRange":"150,000 - 450,000","status":"Normal"}]'::jsonb,
'All hematological indices are within physiological reference intervals.', 'Processed on automated analyzer without clotting.');

-- 12. Insert Bills & Bill Items
INSERT INTO bills (id, invoice_code, patient_id, date, subtotal, discount, tax, total_amount, status, payment_method, paid_date, generated_by) VALUES
('50505050-5050-5050-5050-505050500001', 'INV-801', 'dddddddd-dddd-dddd-dddd-dddddddd0001', '2026-09-20', 250.50, 0.00, 0.00, 250.50, 'Paid', 'Credit Card (Visa - 4022)', '2026-09-20', 'Rachel Cooper (Receptionist)'),
('50505050-5050-5050-5050-505050500002', 'INV-802', 'dddddddd-dddd-dddd-dddd-dddddddd0004', '2026-09-29', 140.00, 10.00, 0.00, 130.00, 'Unpaid', NULL, NULL, 'Rachel Cooper (Receptionist)');

INSERT INTO bill_items (bill_id, description, department, amount) VALUES
('50505050-5050-5050-5050-505050500001', 'Specialist Consultation Fee (Dr. Sarah Jenkins - Cardiology)', 'Cardiology', 100.00),
('50505050-5050-5050-5050-505050500001', 'Complete Blood Count (CBC) with ESR', 'Laboratory', 45.00),
('50505050-5050-5050-5050-505050500001', 'Lipid Profile & Serum Electrolytes Panel', 'Laboratory', 75.00),
('50505050-5050-5050-5050-505050500001', 'Pharmacy: Amlodipine 5mg + Metoprolol 25mg', 'Pharmacy', 30.50),
('50505050-5050-5050-5050-505050500002', 'Pediatric Outpatient Consultation (Dr. Elena Rostova)', 'Pediatrics', 90.00),
('50505050-5050-5050-5050-505050500002', 'Spirometry Peak Flow Assessment', 'Diagnostics', 50.00);

-- 13. Insert Notifications & Activity Logs
INSERT INTO notifications (profile_id, target_role, title, message, type, is_read) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0009', 'Patient', 'Appointment Confirmed', 'Your upcoming appointment with Dr. Sarah Jenkins (Cardiology) is scheduled for Sep 30, 2026 at 10:30 AM in OPD Room 204.', 'appointment', false),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0002', 'Doctor', 'New Appointment Booked', 'Johnathan Doe has booked an appointment for Cardiology Follow-up on Sep 30 at 10:30 AM.', 'appointment', false),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0007', 'Pharmacist', 'New Prescription Received', 'Prescription RX-502 for patient Clara Oswald has been submitted by Dr. Elena Rostova and is pending dispensing.', 'prescription', false),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0008', 'Lab Technician', 'Urgent Lab Test Requested', 'Dr. Michael Chen requested an Urgent Serum Vitamin panel for patient Emily Watson (LAB-304).', 'lab', false);

INSERT INTO activity_logs (action, user_name, details) VALUES
('Appointment Scheduled', 'Johnathan Doe (Patient)', 'Booked slot with Dr. Sarah Jenkins (Cardiology)'),
('Prescription Dispensed', 'James Wilson (Pharmacist)', 'Dispensed RX-501 (Amlodipine, Metoprolol)'),
('Lab Result Published', 'Dr. Priya Sharma (Lab Tech)', 'Completed CBC report for Johnathan Doe'),
('Bill Created', 'Rachel Cooper (Receptionist)', 'Generated invoice INV-802 for Clara Oswald ($130.00)');
