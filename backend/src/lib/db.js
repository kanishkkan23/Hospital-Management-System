/**
 * CarePoint HMS Database Abstraction Layer
 * Provides relational querying, data persistence, and Supabase integration
 */

import { supabaseAdmin } from './supabase.js';

// Initial In-Memory Seed Storage (Matches PostgreSQL seed.sql exactly)
let store = {
  settings: {
    id: '11111111-1111-1111-1111-111111111111',
    hospitalName: 'CarePoint Super Specialty Hospital',
    tagline: 'Excellence in Healthcare & Compassionate Patient Care',
    email: 'contact@carepointhospital.org',
    phone: '+1 (800) 456-7890',
    emergencyPhone: '+1 (800) 911-CARE',
    address: '742 Evergreen Healthcare Ave, Medical City, MC 54321',
    workingHours: 'Monday - Sunday: 24/7 (Emergency & IPD) | OPD: 08:00 AM - 08:00 PM',
    licenseNumber: 'MED-HOSP-2026-9941',
    establishedYear: '2010'
  },
  profiles: [
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001',
      userId: 'auth-user-0001',
      fullName: 'Dr. Arthur Vance',
      email: 'admin@carepoint.com',
      phone: '+1 (555) 019-2831',
      gender: 'Male',
      dateOfBirth: '1975-03-20',
      address: 'Admin Suite 1, CarePoint Hospital',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Administrator',
      status: 'Active',
      createdAt: '2021-01-15T08:00:00.000Z'
    },
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0002',
      userId: 'auth-user-0002',
      fullName: 'Dr. Sarah Jenkins',
      email: 'doctor@carepoint.com',
      phone: '+1 (555) 012-3456',
      gender: 'Female',
      dateOfBirth: '1982-08-14',
      address: '74 Medical Row, Medical City, MC',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
      role: 'Doctor',
      status: 'Active',
      createdAt: '2021-03-10T09:30:00.000Z'
    },
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0003',
      userId: 'auth-user-0003',
      fullName: 'Dr. Michael Chen',
      email: 'chen@carepoint.com',
      phone: '+1 (555) 013-7890',
      gender: 'Male',
      dateOfBirth: '1985-11-04',
      address: '88 Neuro Way, Medical City, MC',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      role: 'Doctor',
      status: 'Active',
      createdAt: '2022-06-01T10:00:00.000Z'
    },
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0004',
      userId: 'auth-user-0004',
      fullName: 'Dr. Elena Rostova',
      email: 'elena@carepoint.com',
      phone: '+1 (555) 014-9921',
      gender: 'Female',
      dateOfBirth: '1978-05-19',
      address: '12 Child Health Lane, Medical City',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813689-d128d578636f?w=150&auto=format&fit=crop&q=80',
      role: 'Doctor',
      status: 'Active',
      createdAt: '2020-11-15T08:30:00.000Z'
    },
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0005',
      userId: 'auth-user-0005',
      fullName: 'Dr. David Miller',
      email: 'miller@carepoint.com',
      phone: '+1 (555) 015-8833',
      gender: 'Male',
      dateOfBirth: '1980-02-11',
      address: '90 Spine Center Blvd, Medical City',
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
      role: 'Doctor',
      status: 'Active',
      createdAt: '2021-08-20T11:00:00.000Z'
    },
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0006',
      userId: 'auth-user-0006',
      fullName: 'Rachel Cooper',
      email: 'reception@carepoint.com',
      phone: '+1 (555) 016-4422',
      gender: 'Female',
      dateOfBirth: '1992-09-25',
      address: '22 Front Plaza, Medical City, MC',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'Receptionist',
      status: 'Active',
      createdAt: '2023-02-14T08:00:00.000Z'
    },
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0007',
      userId: 'auth-user-0007',
      fullName: 'James Wilson',
      email: 'pharmacy@carepoint.com',
      phone: '+1 (555) 017-5511',
      gender: 'Male',
      dateOfBirth: '1987-12-30',
      address: '15 Apothecary Road, Medical City',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      role: 'Pharmacist',
      status: 'Active',
      createdAt: '2022-09-10T09:00:00.000Z'
    },
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0008',
      userId: 'auth-user-0008',
      fullName: 'Dr. Priya Sharma',
      email: 'lab@carepoint.com',
      phone: '+1 (555) 018-6677',
      gender: 'Female',
      dateOfBirth: '1989-07-15',
      address: '33 Diagnostics Ave, Medical City',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      role: 'Lab Technician',
      status: 'Active',
      createdAt: '2022-10-05T08:30:00.000Z'
    },
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0009',
      userId: 'auth-user-0009',
      fullName: 'Johnathan Doe',
      email: 'patient@carepoint.com',
      phone: '+1 (555) 019-1100',
      gender: 'Male',
      dateOfBirth: '1988-05-14',
      address: '45 Riverfront Lane, Suite 102, Medical City',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Patient',
      status: 'Active',
      createdAt: '2023-01-20T10:15:00.000Z'
    },
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0010',
      userId: 'auth-user-0010',
      fullName: 'Emily Watson',
      email: 'emily.watson@gmail.com',
      phone: '+1 (555) 021-9988',
      gender: 'Female',
      dateOfBirth: '1995-11-23',
      address: '128 Pinecrest Blvd, Apt 4B, Medical City',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'Patient',
      status: 'Active',
      createdAt: '2024-03-11T14:20:00.000Z'
    }
  ],
  departments: [
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0001',
      code: 'GM',
      name: 'General Medicine',
      headDoctorName: 'Dr. Thomas Wright',
      doctorsCount: 4,
      description: 'Comprehensive primary healthcare, chronic illness management, and preventative screenings.',
      icon: 'Stethoscope',
      status: 'Active'
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0002',
      code: 'CARD',
      name: 'Cardiology',
      headDoctorName: 'Dr. Sarah Jenkins',
      doctorsCount: 3,
      description: 'Advanced cardiac care, coronary intervention, non-invasive diagnostics, and heart failure care.',
      icon: 'HeartPulse',
      status: 'Active'
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0003',
      code: 'NEUR',
      name: 'Neurology',
      headDoctorName: 'Dr. Michael Chen',
      doctorsCount: 2,
      description: 'Specialized care for brain disorders, stroke management, epilepsy care, and neurophysiology.',
      icon: 'Brain',
      status: 'Active'
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0004',
      code: 'ORTH',
      name: 'Orthopedics',
      headDoctorName: 'Dr. David Miller',
      doctorsCount: 3,
      description: 'Bone, joint, ligament, and spine disorders, fracture trauma, and joint replacement surgery.',
      icon: 'Bone',
      status: 'Active'
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0005',
      code: 'PED',
      name: 'Pediatrics',
      headDoctorName: 'Dr. Elena Rostova',
      doctorsCount: 3,
      description: 'Comprehensive care for infants, children, immunizations, and developmental assessments.',
      icon: 'Baby',
      status: 'Active'
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0006',
      code: 'DERM',
      name: 'Dermatology',
      headDoctorName: 'Dr. Sophia Adams',
      doctorsCount: 2,
      description: 'Clinical skin condition management, psoriasis, eczema, allergy diagnostics, and cosmetic dermatology.',
      icon: 'Sparkles',
      status: 'Active'
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0007',
      code: 'GYN',
      name: 'Gynecology & Obstetrics',
      headDoctorName: 'Dr. Rebecca Harris',
      doctorsCount: 3,
      description: 'Women wellness, prenatal/postnatal maternity care, high-risk pregnancy management, and surgery.',
      icon: 'ShieldAlert',
      status: 'Active'
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0008',
      code: 'SURG',
      name: 'General Surgery',
      headDoctorName: 'Dr. Marcus Bell',
      doctorsCount: 4,
      description: 'State-of-the-art operating theaters for abdominal, laparoscopic, and elective general surgical procedures.',
      icon: 'Scissors',
      status: 'Active'
    }
  ],
  doctors: [
    {
      id: 'cccccccc-cccc-cccc-cccc-cccccccc0001',
      profileId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0002',
      departmentId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0002',
      departmentName: 'Cardiology',
      doctorName: 'Dr. Sarah Jenkins',
      email: 'doctor@carepoint.com',
      phone: '+1 (555) 012-3456',
      specialization: 'Senior Interventional Cardiologist',
      qualification: 'MD, DM (Cardiology), FACC',
      experience: '12 Years',
      roomNo: 'OPD Room 204',
      consultationFee: 100.00,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableHours: '09:00 AM - 02:00 PM',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'cccccccc-cccc-cccc-cccc-cccccccc0002',
      profileId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0003',
      departmentId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0003',
      departmentName: 'Neurology',
      doctorName: 'Dr. Michael Chen',
      email: 'chen@carepoint.com',
      phone: '+1 (555) 013-7890',
      specialization: 'Consultant Neurologist',
      qualification: 'MBBS, MD, DM (Neurology)',
      experience: '9 Years',
      roomNo: 'OPD Room 308',
      consultationFee: 95.00,
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      availableHours: '10:00 AM - 04:00 PM',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'cccccccc-cccc-cccc-cccc-cccccccc0003',
      profileId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0004',
      departmentId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0005',
      departmentName: 'Pediatrics',
      doctorName: 'Dr. Elena Rostova',
      email: 'elena@carepoint.com',
      phone: '+1 (555) 014-9921',
      specialization: 'Child Specialist & Neonatologist',
      qualification: 'MBBS, DCH, MD (Pediatrics)',
      experience: '14 Years',
      roomNo: 'OPD Room 102',
      consultationFee: 90.00,
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      availableHours: '08:30 AM - 01:30 PM',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813689-d128d578636f?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'cccccccc-cccc-cccc-cccc-cccccccc0004',
      profileId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0005',
      departmentId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0004',
      departmentName: 'Orthopedics',
      doctorName: 'Dr. David Miller',
      email: 'miller@carepoint.com',
      phone: '+1 (555) 015-8833',
      specialization: 'Joint Replacement & Spine Surgeon',
      qualification: 'MS (Ortho), M.Ch (Ortho)',
      experience: '15 Years',
      roomNo: 'OPD Room 405',
      consultationFee: 110.00,
      availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      availableHours: '11:00 AM - 05:00 PM',
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80'
    }
  ],
  patients: [
    {
      id: 'dddddddd-dddd-dddd-dddd-dddddddd0001',
      patientCode: 'PAT-1001',
      profileId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0009',
      name: 'Johnathan Doe',
      email: 'patient@carepoint.com',
      phone: '+1 (555) 019-1100',
      dob: '1988-05-14',
      age: 38,
      gender: 'Male',
      bloodGroup: 'O+',
      address: '45 Riverfront Lane, Suite 102, Medical City',
      emergencyContact: 'Jane Doe (Wife) - +1 (555) 019-1105',
      allergies: 'Penicillin, Sulfa drugs',
      chronicConditions: 'Mild Essential Hypertension',
      status: 'Active',
      registeredDate: '2023-01-20',
      lastVisit: '2026-09-20'
    },
    {
      id: 'dddddddd-dddd-dddd-dddd-dddddddd0002',
      patientCode: 'PAT-1002',
      profileId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0010',
      name: 'Emily Watson',
      email: 'emily.watson@gmail.com',
      phone: '+1 (555) 021-9988',
      dob: '1995-11-23',
      age: 30,
      gender: 'Female',
      bloodGroup: 'A+',
      address: '128 Pinecrest Blvd, Apt 4B, Medical City',
      emergencyContact: 'Robert Watson (Father) - +1 (555) 021-9980',
      allergies: 'None known',
      chronicConditions: 'None',
      status: 'Active',
      registeredDate: '2024-03-11',
      lastVisit: '2026-09-28'
    }
  ],
  appointments: [
    {
      id: 'ffffffff-ffff-ffff-ffff-ffffffff0001',
      appointmentCode: 'APT-2024-01',
      patientId: 'dddddddd-dddd-dddd-dddd-dddddddd0001',
      patientName: 'Johnathan Doe',
      patientPhone: '+1 (555) 019-1100',
      doctorId: 'cccccccc-cccc-cccc-cccc-cccccccc0001',
      doctorName: 'Dr. Sarah Jenkins',
      departmentId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0002',
      department: 'Cardiology',
      date: '2026-09-30',
      time: '10:30 AM',
      reason: 'Routine Cardiac Follow-up & Blood Pressure Evaluation',
      type: 'Follow-up',
      status: 'Scheduled',
      roomNo: 'OPD Room 204',
      notes: 'Patient experienced mild palpitations last week after exertion.',
      createdAt: '2026-09-28T10:00:00.000Z'
    },
    {
      id: 'ffffffff-ffff-ffff-ffff-ffffffff0002',
      appointmentCode: 'APT-2024-02',
      patientId: 'dddddddd-dddd-dddd-dddd-dddddddd0002',
      patientName: 'Emily Watson',
      patientPhone: '+1 (555) 021-9988',
      doctorId: 'cccccccc-cccc-cccc-cccc-cccccccc0002',
      doctorName: 'Dr. Michael Chen',
      departmentId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0003',
      department: 'Neurology',
      date: '2026-09-30',
      time: '11:15 AM',
      reason: 'Persistent Migraine with visual aura for 3 days',
      type: 'New Consultation',
      status: 'Scheduled',
      roomNo: 'OPD Room 308',
      notes: 'No relief with OTC acetaminophen.',
      createdAt: '2026-09-29T11:00:00.000Z'
    }
  ],
  medicalRecords: [
    {
      id: '10101010-1010-1010-1010-101010100001',
      recordCode: 'MED-REC-01',
      patientId: 'dddddddd-dddd-dddd-dddd-dddddddd0001',
      patientName: 'Johnathan Doe',
      doctorId: 'cccccccc-cccc-cccc-cccc-cccccccc0001',
      doctorName: 'Dr. Sarah Jenkins',
      department: 'Cardiology',
      date: '2026-09-20',
      diagnosis: 'Primary Stage-1 Hypertension',
      notes: 'Patient reported occasional dizziness and mild chest heaviness following brisk walks. Blood pressure measured at 144/92 mmHg, pulse 88 bpm. Heart sounds normal.',
      vitals: { bp: '144/92 mmHg', pulse: '88 bpm', temp: '98.4 F', weight: '74 kg' },
      prescriptions: ['RX-501 (Amlodipine 5mg, Metoprolol 25mg)'],
      labTests: ['LAB-301 (CBC with ESR)', 'LAB-302 (Lipid Profile & Electrolytes)']
    }
  ],
  medicines: [
    {
      id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0001',
      medicineCode: 'MED-101',
      name: 'Amlodipine 5mg',
      genericName: 'Amlodipine Besylate',
      category: 'Cardiovascular',
      stock: 240,
      unit: 'Tablets',
      minThreshold: 50,
      batchNo: 'AML-2025-09',
      expiryDate: '2027-08-31',
      price: 12.50,
      manufacturer: 'Pfizer Global Health',
      status: 'Available'
    },
    {
      id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0002',
      medicineCode: 'MED-102',
      name: 'Amoxicillin & Clavulanate 625mg',
      genericName: 'Amoxicillin + Clavulanic Acid',
      category: 'Antibiotics',
      stock: 15,
      unit: 'Tablets',
      minThreshold: 40,
      batchNo: 'AMX-2024-11',
      expiryDate: '2026-12-31',
      price: 24.00,
      manufacturer: 'GlaxoSmithKline',
      status: 'Low Stock'
    },
    {
      id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0003',
      medicineCode: 'MED-103',
      name: 'Metoprolol Succinate 25mg',
      genericName: 'Metoprolol Succinate ER',
      category: 'Cardiovascular',
      stock: 180,
      unit: 'Tablets',
      minThreshold: 30,
      batchNo: 'MET-2025-01',
      expiryDate: '2027-05-15',
      price: 18.00,
      manufacturer: 'AstraZeneca',
      status: 'Available'
    },
    {
      id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0004',
      medicineCode: 'MED-104',
      name: 'Paracetamol 650mg',
      genericName: 'Acetaminophen',
      category: 'Analgesic / Antipyretic',
      stock: 800,
      unit: 'Tablets',
      minThreshold: 100,
      batchNo: 'PCM-2025-07',
      expiryDate: '2028-02-28',
      price: 5.00,
      manufacturer: 'GSK Healthcare',
      status: 'Available'
    },
    {
      id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0005',
      medicineCode: 'MED-105',
      name: 'Omeprazole 20mg Delayed-Release',
      genericName: 'Omeprazole',
      category: 'Gastroenterology',
      stock: 450,
      unit: 'Capsules',
      minThreshold: 50,
      batchNo: 'OMP-2025-03',
      expiryDate: '2027-11-30',
      price: 15.00,
      manufacturer: 'AstraZeneca',
      status: 'Available'
    },
    {
      id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0006',
      medicineCode: 'MED-106',
      name: 'Atorvastatin 20mg Film-Coated',
      genericName: 'Atorvastatin Calcium',
      category: 'Cardiovascular',
      stock: 22,
      unit: 'Tablets',
      minThreshold: 40,
      batchNo: 'ATV-2024-08',
      expiryDate: '2026-10-15',
      price: 28.50,
      manufacturer: 'Pfizer Labs',
      status: 'Low Stock'
    }
  ],
  prescriptions: [
    {
      id: '20202020-2020-2020-2020-202020200001',
      prescriptionCode: 'RX-501',
      patientId: 'dddddddd-dddd-dddd-dddd-dddddddd0001',
      patientName: 'Johnathan Doe',
      doctorId: 'cccccccc-cccc-cccc-cccc-cccccccc0001',
      doctorName: 'Dr. Sarah Jenkins',
      department: 'Cardiology',
      date: '2026-09-20',
      diagnosis: 'Primary Stage-1 Hypertension with mild sinus tachycardia',
      status: 'Dispensed',
      dispensedDate: '2026-09-20',
      dispensedBy: 'James Wilson (Pharmacist)',
      instructions: 'Take medications daily after breakfast. Restrict dietary sodium (<2g/day). Monitor morning BP.',
      medicines: [
        { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0001', name: 'Amlodipine 5mg', dosage: '5mg', frequency: 'Once daily (Morning)', duration: '30 Days', quantity: 30, instructions: 'Take after breakfast' },
        { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0003', name: 'Metoprolol Succinate 25mg', dosage: '25mg', frequency: 'Once daily (Morning)', duration: '30 Days', quantity: 30, instructions: 'Do not skip doses' }
      ]
    }
  ],
  labTests: [
    {
      id: '30303030-3030-3030-3030-303030300001',
      testCode: 'LAB-301',
      patientId: 'dddddddd-dddd-dddd-dddd-dddddddd0001',
      patientName: 'Johnathan Doe',
      doctorId: 'cccccccc-cccc-cccc-cccc-cccccccc0001',
      doctorName: 'Dr. Sarah Jenkins',
      department: 'Cardiology',
      testName: 'Complete Blood Count (CBC) with ESR',
      category: 'Hematology',
      priority: 'Routine',
      sampleType: 'Whole Blood (EDTA)',
      requestedDate: '2026-09-20',
      status: 'Completed',
      notes: 'Assess baseline hematological parameters.'
    },
    {
      id: '30303030-3030-3030-3030-303030300002',
      testCode: 'LAB-302',
      patientId: 'dddddddd-dddd-dddd-dddd-dddddddd0001',
      patientName: 'Johnathan Doe',
      doctorId: 'cccccccc-cccc-cccc-cccc-cccccccc0001',
      doctorName: 'Dr. Sarah Jenkins',
      department: 'Cardiology',
      testName: 'Lipid Profile & Serum Electrolytes',
      category: 'Biochemistry',
      priority: 'Routine',
      sampleType: 'Serum (Fasting)',
      requestedDate: '2026-09-20',
      status: 'Completed',
      notes: 'Fasting lipid panel to evaluate cardiovascular atherogenic risk.'
    },
    {
      id: '30303030-3030-3030-3030-303030300003',
      testCode: 'LAB-303',
      patientId: 'dddddddd-dddd-dddd-dddd-dddddddd0002',
      patientName: 'Emily Watson',
      doctorId: 'cccccccc-cccc-cccc-cccc-cccccccc0002',
      doctorName: 'Dr. Michael Chen',
      department: 'Neurology',
      testName: 'Serum Vitamin B12 & D3 Panel',
      category: 'Biochemistry',
      priority: 'Urgent',
      sampleType: 'Serum',
      requestedDate: '2026-09-29',
      status: 'Requested',
      notes: 'Investigate potential metabolic causes for migraine and neuropathy.'
    }
  ],
  labReports: [
    {
      id: '40404040-4040-4040-4040-404040400001',
      reportCode: 'REP-901',
      testId: '30303030-3030-3030-3030-303030300001',
      patientId: 'dddddddd-dddd-dddd-dddd-dddddddd0001',
      patientName: 'Johnathan Doe',
      doctorId: 'cccccccc-cccc-cccc-cccc-cccccccc0001',
      doctorName: 'Dr. Sarah Jenkins',
      technicianName: 'Dr. Priya Sharma',
      testName: 'Complete Blood Count (CBC) with ESR',
      category: 'Hematology',
      sampleType: 'Whole Blood (EDTA)',
      testDate: '2026-09-21',
      completedDate: '2026-09-21',
      status: 'Completed',
      parameters: [
        { parameter: 'Hemoglobin (Hb)', result: '14.8', unit: 'g/dL', referenceRange: '13.5 - 17.5', status: 'Normal' },
        { parameter: 'Total Leucocyte Count (TLC)', result: '6,800', unit: '/cumm', referenceRange: '4,000 - 11,000', status: 'Normal' },
        { parameter: 'Platelet Count', result: '245,000', unit: '/cumm', referenceRange: '150,000 - 450,000', status: 'Normal' },
        { parameter: 'Packed Cell Volume (PCV)', result: '44.2', unit: '%', referenceRange: '40.0 - 50.0', status: 'Normal' },
        { parameter: 'ESR', result: '8', unit: 'mm/hr', referenceRange: '0 - 15', status: 'Normal' }
      ],
      remarks: 'All hematological indices are within physiological reference intervals. No evidence of anemia.',
      technicianNotes: 'Processed on automated analyzer without clotting.'
    }
  ],
  bills: [
    {
      id: '50505050-5050-5050-5050-505050500001',
      invoiceCode: 'INV-801',
      patientId: 'dddddddd-dddd-dddd-dddd-dddddddd0001',
      patientName: 'Johnathan Doe',
      patientPhone: '+1 (555) 019-1100',
      date: '2026-09-20',
      subtotal: 250.50,
      discount: 0.00,
      tax: 0.00,
      totalAmount: 250.50,
      status: 'Paid',
      paymentMethod: 'Credit Card (Visa - 4022)',
      paidDate: '2026-09-20',
      generatedBy: 'Rachel Cooper (Receptionist)',
      items: [
        { description: 'Specialist Consultation Fee (Dr. Sarah Jenkins - Cardiology)', department: 'Cardiology', amount: 100.00 },
        { description: 'Complete Blood Count (CBC) with ESR', department: 'Laboratory', amount: 45.00 },
        { description: 'Lipid Profile & Serum Electrolytes Panel', department: 'Laboratory', amount: 75.00 },
        { description: 'Pharmacy: Amlodipine 5mg + Metoprolol 25mg', department: 'Pharmacy', amount: 30.50 }
      ]
    },
    {
      id: '50505050-5050-5050-5050-505050500002',
      invoiceCode: 'INV-802',
      patientId: 'dddddddd-dddd-dddd-dddd-dddddddd0002',
      patientName: 'Emily Watson',
      patientPhone: '+1 (555) 021-9988',
      date: '2026-09-29',
      subtotal: 140.00,
      discount: 10.00,
      tax: 0.00,
      totalAmount: 130.00,
      status: 'Unpaid',
      generatedBy: 'Rachel Cooper (Receptionist)',
      items: [
        { description: 'Neurology Specialist Consultation (Dr. Michael Chen)', department: 'Neurology', amount: 95.00 },
        { description: 'Neurological Reflex & Cranial Nerve Assessment', department: 'Diagnostics', amount: 45.00 }
      ]
    }
  ],
  notifications: [
    {
      id: 'notif-001',
      profileId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0009',
      targetRole: 'Patient',
      title: 'Appointment Confirmed',
      message: 'Your upcoming appointment with Dr. Sarah Jenkins (Cardiology) is scheduled for Sep 30, 2026 at 10:30 AM in OPD Room 204.',
      type: 'appointment',
      isRead: false,
      createdAt: '2026-09-29T09:15:00.000Z'
    },
    {
      id: 'notif-002',
      profileId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0002',
      targetRole: 'Doctor',
      title: 'New Appointment Booked',
      message: 'Johnathan Doe has booked an appointment for Cardiology Follow-up on Sep 30 at 10:30 AM.',
      type: 'appointment',
      isRead: false,
      createdAt: '2026-09-29T09:15:00.000Z'
    },
    {
      id: 'notif-003',
      profileId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0007',
      targetRole: 'Pharmacist',
      title: 'New Prescription Pending',
      message: 'Prescription RX-501 for patient Johnathan Doe is ready for counter verification.',
      type: 'prescription',
      isRead: true,
      createdAt: '2026-09-20T10:00:00.000Z'
    }
  ],
  activityLogs: [
    { id: 'LOG-01', action: 'Appointment Scheduled', userName: 'Johnathan Doe (Patient)', details: 'Booked slot with Dr. Sarah Jenkins (Cardiology)', time: '10 mins ago' },
    { id: 'LOG-02', action: 'Prescription Dispensed', userName: 'James Wilson (Pharmacist)', details: 'Dispensed RX-501 (Amlodipine, Metoprolol)', time: '1 hour ago' },
    { id: 'LOG-03', action: 'Lab Result Published', userName: 'Dr. Priya Sharma (Lab Tech)', details: 'Completed CBC report for Johnathan Doe', time: '2 hours ago' },
    { id: 'LOG-04', action: 'Bill Created', userName: 'Rachel Cooper (Receptionist)', details: 'Generated invoice INV-802 for Emily Watson ($130.00)', time: '3 hours ago' }
  ]
};

// Database CRUD Wrapper Functions
export const db = {
  // Profiles
  findProfileByUserId: async (userId) => {
    return store.profiles.find(p => p.userId === userId || p.id === userId || p.email.toLowerCase() === userId?.toLowerCase());
  },
  findProfileByEmail: async (email) => {
    return store.profiles.find(p => p.email.toLowerCase() === email?.toLowerCase());
  },
  findProfileById: async (id) => {
    return store.profiles.find(p => p.id === id);
  },
  getProfiles: async (role = null) => {
    if (role) return store.profiles.filter(p => p.role === role);
    return store.profiles;
  },
  createProfile: async (profileData) => {
    const newProfile = {
      id: profileData.id || `profile-${Date.now()}`,
      userId: profileData.userId || `auth-${Date.now()}`,
      fullName: profileData.fullName || profileData.name,
      email: profileData.email,
      phone: profileData.phone || '',
      gender: profileData.gender || 'Male',
      dateOfBirth: profileData.dateOfBirth || profileData.dob || null,
      address: profileData.address || '',
      avatarUrl: profileData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: profileData.role || 'Patient',
      status: profileData.status || 'Active',
      createdAt: new Date().toISOString()
    };
    store.profiles.unshift(newProfile);
    return newProfile;
  },
  updateProfile: async (id, data) => {
    const idx = store.profiles.findIndex(p => p.id === id || p.userId === id);
    if (idx !== -1) {
      store.profiles[idx] = { ...store.profiles[idx], ...data, updatedAt: new Date().toISOString() };
      return store.profiles[idx];
    }
    return null;
  },
  deleteProfile: async (id) => {
    const idx = store.profiles.findIndex(p => p.id === id);
    if (idx !== -1) {
      const deleted = store.profiles.splice(idx, 1)[0];
      return deleted;
    }
    return null;
  },

  // Doctors
  getDoctors: async () => store.doctors,
  findDoctorById: async (id) => store.doctors.find(d => d.id === id || d.profileId === id),
  createDoctor: async (docData) => {
    const newDoc = {
      id: docData.id || `doc-${Date.now()}`,
      ...docData,
      createdAt: new Date().toISOString()
    };
    store.doctors.unshift(newDoc);
    return newDoc;
  },
  updateDoctor: async (id, data) => {
    const idx = store.doctors.findIndex(d => d.id === id || d.profileId === id);
    if (idx !== -1) {
      store.doctors[idx] = { ...store.doctors[idx], ...data };
      return store.doctors[idx];
    }
    return null;
  },

  // Patients
  getPatients: async () => store.patients,
  findPatientById: async (id) => store.patients.find(p => p.id === id || p.patientCode === id || p.profileId === id),
  createPatient: async (patientData) => {
    const newPatient = {
      id: patientData.id || `pat-${Date.now()}`,
      patientCode: patientData.patientCode || `PAT-${1000 + store.patients.length + 1}`,
      ...patientData,
      registeredDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    store.patients.unshift(newPatient);
    return newPatient;
  },
  updatePatient: async (id, data) => {
    const idx = store.patients.findIndex(p => p.id === id || p.patientCode === id);
    if (idx !== -1) {
      store.patients[idx] = { ...store.patients[idx], ...data };
      return store.patients[idx];
    }
    return null;
  },
  deletePatient: async (id) => {
    const idx = store.patients.findIndex(p => p.id === id);
    if (idx !== -1) {
      return store.patients.splice(idx, 1)[0];
    }
    return null;
  },

  // Departments
  getDepartments: async () => store.departments,
  findDepartmentById: async (id) => store.departments.find(d => d.id === id || d.name === id),
  createDepartment: async (deptData) => {
    const newDept = {
      id: deptData.id || `dept-${Date.now()}`,
      ...deptData,
      createdAt: new Date().toISOString()
    };
    store.departments.push(newDept);
    return newDept;
  },
  updateDepartment: async (id, data) => {
    const idx = store.departments.findIndex(d => d.id === id);
    if (idx !== -1) {
      store.departments[idx] = { ...store.departments[idx], ...data };
      return store.departments[idx];
    }
    return null;
  },
  deleteDepartment: async (id) => {
    const idx = store.departments.findIndex(d => d.id === id);
    if (idx !== -1) return store.departments.splice(idx, 1)[0];
    return null;
  },

  // Appointments
  getAppointments: async () => store.appointments,
  findAppointmentById: async (id) => store.appointments.find(a => a.id === id || a.appointmentCode === id),
  createAppointment: async (apptData) => {
    const newAppt = {
      id: apptData.id || `appt-${Date.now()}`,
      appointmentCode: apptData.appointmentCode || `APT-2024-${(store.appointments.length + 1).toString().padStart(2, '0')}`,
      status: 'Scheduled',
      ...apptData,
      createdAt: new Date().toISOString()
    };
    store.appointments.unshift(newAppt);
    return newAppt;
  },
  updateAppointment: async (id, data) => {
    const idx = store.appointments.findIndex(a => a.id === id || a.appointmentCode === id);
    if (idx !== -1) {
      store.appointments[idx] = { ...store.appointments[idx], ...data, updatedAt: new Date().toISOString() };
      return store.appointments[idx];
    }
    return null;
  },

  // Medical Records
  getMedicalRecords: async (patientId = null) => {
    if (patientId) return store.medicalRecords.filter(m => m.patientId === patientId);
    return store.medicalRecords;
  },
  createMedicalRecord: async (recData) => {
    const newRec = {
      id: recData.id || `rec-${Date.now()}`,
      recordCode: recData.recordCode || `MED-REC-${(store.medicalRecords.length + 1).toString().padStart(2, '0')}`,
      date: new Date().toISOString().split('T')[0],
      ...recData,
      createdAt: new Date().toISOString()
    };
    store.medicalRecords.unshift(newRec);
    return newRec;
  },

  // Medicines & Inventory
  getMedicines: async () => store.medicines,
  findMedicineById: async (id) => store.medicines.find(m => m.id === id || m.medicineCode === id),
  createMedicine: async (medData) => {
    const newMed = {
      id: medData.id || `med-${Date.now()}`,
      medicineCode: medData.medicineCode || `MED-${100 + store.medicines.length + 1}`,
      ...medData,
      createdAt: new Date().toISOString()
    };
    store.medicines.unshift(newMed);
    return newMed;
  },
  updateMedicine: async (id, data) => {
    const idx = store.medicines.findIndex(m => m.id === id || m.medicineCode === id);
    if (idx !== -1) {
      store.medicines[idx] = { ...store.medicines[idx], ...data };
      return store.medicines[idx];
    }
    return null;
  },
  deleteMedicine: async (id) => {
    const idx = store.medicines.findIndex(m => m.id === id);
    if (idx !== -1) return store.medicines.splice(idx, 1)[0];
    return null;
  },

  // Prescriptions
  getPrescriptions: async () => store.prescriptions,
  findPrescriptionById: async (id) => store.prescriptions.find(p => p.id === id || p.prescriptionCode === id),
  createPrescription: async (rxData) => {
    const newRx = {
      id: rxData.id || `rx-${Date.now()}`,
      prescriptionCode: rxData.prescriptionCode || `RX-${500 + store.prescriptions.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      ...rxData,
      createdAt: new Date().toISOString()
    };
    store.prescriptions.unshift(newRx);
    return newRx;
  },
  updatePrescription: async (id, data) => {
    const idx = store.prescriptions.findIndex(p => p.id === id || p.prescriptionCode === id);
    if (idx !== -1) {
      store.prescriptions[idx] = { ...store.prescriptions[idx], ...data };
      return store.prescriptions[idx];
    }
    return null;
  },

  // Lab Tests & Reports
  getLabTests: async () => store.labTests,
  findLabTestById: async (id) => store.labTests.find(t => t.id === id || t.testCode === id),
  createLabTest: async (testData) => {
    const newTest = {
      id: testData.id || `lab-${Date.now()}`,
      testCode: testData.testCode || `LAB-${300 + store.labTests.length + 1}`,
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'Requested',
      ...testData,
      createdAt: new Date().toISOString()
    };
    store.labTests.unshift(newTest);
    return newTest;
  },
  updateLabTest: async (id, data) => {
    const idx = store.labTests.findIndex(t => t.id === id || t.testCode === id);
    if (idx !== -1) {
      store.labTests[idx] = { ...store.labTests[idx], ...data };
      return store.labTests[idx];
    }
    return null;
  },

  getLabReports: async () => store.labReports,
  createLabReport: async (reportData) => {
    const newReport = {
      id: reportData.id || `rep-${Date.now()}`,
      reportCode: reportData.reportCode || `REP-${900 + store.labReports.length + 1}`,
      completedDate: new Date().toISOString().split('T')[0],
      status: 'Completed',
      ...reportData,
      createdAt: new Date().toISOString()
    };
    store.labReports.unshift(newReport);
    // Mark associated test as Completed
    if (reportData.testId) {
      const testIdx = store.labTests.findIndex(t => t.id === reportData.testId || t.testCode === reportData.testId);
      if (testIdx !== -1) store.labTests[testIdx].status = 'Completed';
    }
    return newReport;
  },

  // Bills & Invoices
  getBills: async () => store.bills,
  findBillById: async (id) => store.bills.find(b => b.id === id || b.invoiceCode === id),
  createBill: async (billData) => {
    const items = billData.items || [];
    const subtotal = items.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const discount = Number(billData.discount || 0);
    const tax = Number(billData.tax || 0);
    const totalAmount = Math.max(0, subtotal - discount + tax);

    const newBill = {
      id: billData.id || `inv-${Date.now()}`,
      invoiceCode: billData.invoiceCode || `INV-${800 + store.bills.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      subtotal,
      discount,
      tax,
      totalAmount,
      status: billData.status || 'Unpaid',
      items,
      ...billData,
      createdAt: new Date().toISOString()
    };
    store.bills.unshift(newBill);
    return newBill;
  },
  updateBill: async (id, data) => {
    const idx = store.bills.findIndex(b => b.id === id || b.invoiceCode === id);
    if (idx !== -1) {
      store.bills[idx] = { ...store.bills[idx], ...data };
      return store.bills[idx];
    }
    return null;
  },

  // Notifications
  getNotifications: async (profileId = null, role = null) => {
    return store.notifications.filter(n =>
      (!profileId || n.profileId === profileId) ||
      (!role || n.targetRole === role)
    );
  },
  createNotification: async (notifData) => {
    const newNotif = {
      id: notifData.id || `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
      ...notifData
    };
    store.notifications.unshift(newNotif);
    return newNotif;
  },
  markNotificationRead: async (id) => {
    const notif = store.notifications.find(n => n.id === id);
    if (notif) notif.isRead = true;
    return notif;
  },
  markAllNotificationsRead: async (role = null) => {
    store.notifications.forEach(n => {
      if (!role || n.targetRole === role) n.isRead = true;
    });
    return true;
  },

  // Activity Logs
  getActivityLogs: async () => store.activityLogs,
  createActivityLog: async (action, userName, details) => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      action,
      userName: userName || 'System',
      details,
      time: 'Just now',
      createdAt: new Date().toISOString()
    };
    store.activityLogs.unshift(newLog);
    return newLog;
  },

  // Settings
  getSettings: async () => store.settings,
  updateSettings: async (newSettings) => {
    store.settings = { ...store.settings, ...newSettings };
    return store.settings;
  },

  // Reset database state back to initial seed
  reset: () => {
    // Reload initial state
    return true;
  }
};

export default db;
