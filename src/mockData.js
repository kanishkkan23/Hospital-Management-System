// Initial Mock Data for CarePoint Hospital Management System

export const INITIAL_SETTINGS = {
  hospitalName: "CarePoint Super Specialty Hospital",
  tagline: "Excellence in Healthcare & Compassionate Patient Care",
  email: "contact@carepointhospital.org",
  phone: "+1 (800) 456-7890",
  emergencyPhone: "+1 (800) 911-CARE",
  address: "742 Evergreen Healthcare Ave, Medical City, MC 54321",
  workingHours: "Monday - Sunday: 24/7 (Emergency & IPD) | OPD: 08:00 AM - 08:00 PM",
  licenseNumber: "MED-HOSP-2026-9941",
  establishedYear: "2010"
};

export const INITIAL_USERS = [
  {
    id: "USR-001",
    name: "Dr. Arthur Vance",
    email: "admin@carepoint.com",
    role: "Administrator",
    status: "Active",
    phone: "+1 (555) 019-2831",
    department: "Hospital Administration",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    joinedDate: "2021-01-15"
  },
  {
    id: "USR-002",
    name: "Dr. Sarah Jenkins",
    email: "doctor@carepoint.com",
    role: "Doctor",
    status: "Active",
    phone: "+1 (555) 012-3456",
    department: "Cardiology",
    specialization: "Senior Interventional Cardiologist",
    qualification: "MD, DM (Cardiology), FACC",
    experience: "12 Years",
    roomNo: "OPD Room 204",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    availableHours: "09:00 AM - 02:00 PM",
    joinedDate: "2021-03-10"
  },
  {
    id: "USR-003",
    name: "Dr. Michael Chen",
    email: "chen@carepoint.com",
    role: "Doctor",
    status: "Active",
    phone: "+1 (555) 013-7890",
    department: "Neurology",
    specialization: "Consultant Neurologist",
    qualification: "MBBS, MD, DM (Neurology)",
    experience: "9 Years",
    roomNo: "OPD Room 308",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    availableHours: "10:00 AM - 04:00 PM",
    joinedDate: "2022-06-01"
  },
  {
    id: "USR-004",
    name: "Dr. Elena Rostova",
    email: "elena@carepoint.com",
    role: "Doctor",
    status: "Active",
    phone: "+1 (555) 014-9921",
    department: "Pediatrics",
    specialization: "Child Specialist & Neonatologist",
    qualification: "MBBS, DCH, MD (Pediatrics)",
    experience: "14 Years",
    roomNo: "OPD Room 102",
    avatar: "https://images.unsplash.com/photo-1594824813689-d128d578636f?w=150&auto=format&fit=crop&q=80",
    availableDays: ["Monday", "Wednesday", "Friday"],
    availableHours: "08:30 AM - 01:30 PM",
    joinedDate: "2020-11-15"
  },
  {
    id: "USR-005",
    name: "Dr. David Miller",
    email: "miller@carepoint.com",
    role: "Doctor",
    status: "Active",
    phone: "+1 (555) 015-8833",
    department: "Orthopedics",
    specialization: "Joint Replacement & Spine Surgeon",
    qualification: "MS (Ortho), M.Ch (Ortho)",
    experience: "15 Years",
    roomNo: "OPD Room 405",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
    availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
    availableHours: "11:00 AM - 05:00 PM",
    joinedDate: "2021-08-20"
  },
  {
    id: "USR-006",
    name: "Rachel Cooper",
    email: "reception@carepoint.com",
    role: "Receptionist",
    status: "Active",
    phone: "+1 (555) 016-4422",
    department: "Front Desk & Patient Services",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    joinedDate: "2023-02-14"
  },
  {
    id: "USR-007",
    name: "James Wilson",
    email: "pharmacy@carepoint.com",
    role: "Pharmacist",
    status: "Active",
    phone: "+1 (555) 017-5511",
    department: "Central Pharmacy",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    joinedDate: "2022-09-10"
  },
  {
    id: "USR-008",
    name: "Dr. Priya Sharma",
    email: "lab@carepoint.com",
    role: "Lab Technician",
    status: "Active",
    phone: "+1 (555) 018-6677",
    department: "Diagnostic Pathology & Biochemistry",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    joinedDate: "2022-10-05"
  },
  {
    id: "USR-009",
    name: "Johnathan Doe",
    email: "patient@carepoint.com",
    role: "Patient",
    status: "Active",
    phone: "+1 (555) 019-1100",
    department: "General Medicine",
    patientId: "PAT-1001",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    dob: "1988-05-14",
    gender: "Male",
    bloodGroup: "O+",
    address: "45 Riverfront Lane, Suite 102, Medical City, MC",
    emergencyContact: "Jane Doe (Wife) - +1 (555) 019-1105",
    joinedDate: "2023-01-20"
  }
];

export const INITIAL_DEPARTMENTS = [
  {
    id: "DEP-01",
    name: "General Medicine",
    code: "GM",
    headDoctor: "Dr. Thomas Wright",
    doctorsCount: 4,
    description: "Comprehensive primary healthcare, chronic illness management, preventative health screenings and acute patient care.",
    icon: "Stethoscope"
  },
  {
    id: "DEP-02",
    name: "Cardiology",
    code: "CARD",
    headDoctor: "Dr. Sarah Jenkins",
    doctorsCount: 3,
    description: "Advanced cardiac care, non-invasive diagnostic testing, coronary intervention, hypertension management and heart failure care.",
    icon: "HeartPulse"
  },
  {
    id: "DEP-03",
    name: "Neurology",
    code: "NEUR",
    headDoctor: "Dr. Michael Chen",
    doctorsCount: 2,
    description: "Specialized care for brain disorders, stroke management, epilepsy care, neuropathy, Parkinson's disease, and neurophysiology.",
    icon: "Brain"
  },
  {
    id: "DEP-04",
    name: "Orthopedics",
    code: "ORTH",
    headDoctor: "Dr. David Miller",
    doctorsCount: 3,
    description: "Diagnosis and surgical management of bone, joint, ligament, and spine disorders, fracture trauma, and sports medicine.",
    icon: "Bone"
  },
  {
    id: "DEP-05",
    name: "Pediatrics",
    code: "PED",
    headDoctor: "Dr. Elena Rostova",
    doctorsCount: 3,
    description: "Comprehensive care for infants, children, and adolescents, immunizations, developmental assessments, and pediatric illnesses.",
    icon: "Baby"
  },
  {
    id: "DEP-06",
    name: "Dermatology",
    code: "DERM",
    headDoctor: "Dr. Sophia Adams",
    doctorsCount: 2,
    description: "Clinical skin condition management, psoriasis, eczema, allergy diagnostics, cosmetic dermatology, and minor cutaneous surgeries.",
    icon: "Sparkles"
  },
  {
    id: "DEP-07",
    name: "Gynecology & Obstetrics",
    code: "GYN",
    headDoctor: "Dr. Rebecca Harris",
    doctorsCount: 3,
    description: "Women's wellness, prenatal/postnatal maternity care, high-risk pregnancy management, and minimally invasive gynecological surgery.",
    icon: "ShieldAlert"
  },
  {
    id: "DEP-08",
    name: "General Surgery",
    code: "SURG",
    headDoctor: "Dr. Marcus Bell",
    doctorsCount: 4,
    description: "State-of-the-art operating theaters for abdominal, laparoscopic, emergency trauma, and elective general surgical procedures.",
    icon: "Scissors"
  }
];

export const INITIAL_PATIENTS = [
  {
    id: "PAT-1001",
    name: "Johnathan Doe",
    email: "patient@carepoint.com",
    phone: "+1 (555) 019-1100",
    dob: "1988-05-14",
    age: 38,
    gender: "Male",
    bloodGroup: "O+",
    address: "45 Riverfront Lane, Suite 102, Medical City, MC",
    emergencyContact: "Jane Doe (Wife) - +1 (555) 019-1105",
    allergies: "Penicillin, Sulfa drugs",
    chronicConditions: "Mild Essential Hypertension",
    status: "Active",
    registeredDate: "2023-01-20",
    lastVisit: "2026-09-20"
  },
  {
    id: "PAT-1002",
    name: "Emily Watson",
    email: "emily.watson@gmail.com",
    phone: "+1 (555) 021-9988",
    dob: "1995-11-23",
    age: 30,
    gender: "Female",
    bloodGroup: "A+",
    address: "128 Pinecrest Blvd, Apt 4B, Medical City, MC",
    emergencyContact: "Robert Watson (Father) - +1 (555) 021-9980",
    allergies: "None known",
    chronicConditions: "None",
    status: "Active",
    registeredDate: "2024-03-11",
    lastVisit: "2026-09-28"
  },
  {
    id: "PAT-1003",
    name: "Robert Martinez",
    email: "robert.m@gmail.com",
    phone: "+1 (555) 032-4411",
    dob: "1972-02-08",
    age: 54,
    gender: "Male",
    bloodGroup: "B+",
    address: "89 Oakridge Drive, Medical City, MC",
    emergencyContact: "Maria Martinez (Spouse) - +1 (555) 032-4412",
    allergies: "Aspirin",
    chronicConditions: "Type 2 Diabetes Mellitus",
    status: "Active",
    registeredDate: "2023-07-19",
    lastVisit: "2026-09-25"
  },
  {
    id: "PAT-1004",
    name: "Clara Oswald",
    email: "clara.oswald@yahoo.com",
    phone: "+1 (555) 043-6622",
    dob: "1990-08-30",
    age: 36,
    gender: "Female",
    bloodGroup: "AB+",
    address: "310 Meadow Lane, Medical City, MC",
    emergencyContact: "George Oswald (Brother) - +1 (555) 043-6623",
    allergies: "Latex",
    chronicConditions: "Asthma",
    status: "Active",
    registeredDate: "2024-01-15",
    lastVisit: "2026-09-26"
  },
  {
    id: "PAT-1005",
    name: "Henry Cavill",
    email: "henry.c@outlook.com",
    phone: "+1 (555) 054-7733",
    dob: "1983-04-12",
    age: 43,
    gender: "Male",
    bloodGroup: "O-",
    address: "512 Highland Crescent, Medical City, MC",
    emergencyContact: "Katherine C (Sister) - +1 (555) 054-7735",
    allergies: "None",
    chronicConditions: "Post-surgery knee rehab",
    status: "Active",
    registeredDate: "2024-05-08",
    lastVisit: "2026-09-27"
  }
];

export const INITIAL_APPOINTMENTS = [
  {
    id: "APT-2024-01",
    patientId: "PAT-1001",
    patientName: "Johnathan Doe",
    patientPhone: "+1 (555) 019-1100",
    doctorId: "USR-002",
    doctorName: "Dr. Sarah Jenkins",
    department: "Cardiology",
    date: "2026-09-30",
    time: "10:30 AM",
    reason: "Routine Cardiac Follow-up & Blood Pressure Evaluation",
    status: "Scheduled",
    type: "Follow-up",
    roomNo: "OPD Room 204",
    notes: "Patient experienced mild palpitations last week after exertion."
  },
  {
    id: "APT-2024-02",
    patientId: "PAT-1002",
    patientName: "Emily Watson",
    patientPhone: "+1 (555) 021-9988",
    doctorId: "USR-003",
    doctorName: "Dr. Michael Chen",
    department: "Neurology",
    date: "2026-09-30",
    time: "11:15 AM",
    reason: "Persistent Migraine with visual aura for 3 days",
    status: "Scheduled",
    type: "New Consultation",
    roomNo: "OPD Room 308",
    notes: "No relief with OTC acetaminophen."
  },
  {
    id: "APT-2024-03",
    patientId: "PAT-1003",
    patientName: "Robert Martinez",
    patientPhone: "+1 (555) 032-4411",
    doctorId: "USR-002",
    doctorName: "Dr. Sarah Jenkins",
    department: "Cardiology",
    date: "2026-09-30",
    time: "12:00 PM",
    reason: "Post-Angiography lipid profile review",
    status: "Scheduled",
    type: "Follow-up",
    roomNo: "OPD Room 204",
    notes: "Requires updated lipid profile lab review."
  },
  {
    id: "APT-2024-04",
    patientId: "PAT-1004",
    patientName: "Clara Oswald",
    patientPhone: "+1 (555) 043-6622",
    doctorId: "USR-004",
    doctorName: "Dr. Elena Rostova",
    department: "Pediatrics",
    date: "2026-09-29",
    time: "09:30 AM",
    reason: "Seasonal bronchospasm checkup and inhaler review",
    status: "Completed",
    type: "Follow-up",
    roomNo: "OPD Room 102",
    notes: "Chest clear on auscultation. Inhaler dosage renewed."
  },
  {
    id: "APT-2024-05",
    patientId: "PAT-1005",
    patientName: "Henry Cavill",
    patientPhone: "+1 (555) 054-7733",
    doctorId: "USR-005",
    doctorName: "Dr. David Miller",
    department: "Orthopedics",
    date: "2026-09-28",
    time: "02:00 PM",
    reason: "Right knee ACL reconstruction follow-up & mobility check",
    status: "Completed",
    type: "Follow-up",
    roomNo: "OPD Room 405",
    notes: "Wound healed well. Physiotherapy continued."
  },
  {
    id: "APT-2024-06",
    patientId: "PAT-1001",
    patientName: "Johnathan Doe",
    patientPhone: "+1 (555) 019-1100",
    doctorId: "USR-005",
    doctorName: "Dr. David Miller",
    department: "Orthopedics",
    date: "2026-09-15",
    time: "03:30 PM",
    reason: "Lumbar back strain consultation",
    status: "Completed",
    type: "Consultation",
    roomNo: "OPD Room 405",
    notes: "Prescribed muscle relaxants and ergonomics training."
  }
];

export const INITIAL_PRESCRIPTIONS = [
  {
    id: "RX-501",
    patientId: "PAT-1001",
    patientName: "Johnathan Doe",
    doctorId: "USR-002",
    doctorName: "Dr. Sarah Jenkins",
    department: "Cardiology",
    date: "2026-09-20",
    diagnosis: "Primary Stage-1 Hypertension with mild sinus tachycardia",
    status: "Dispensed",
    dispensedDate: "2026-09-20",
    dispensedBy: "James Wilson (Pharmacist)",
    instructions: "Take medications daily after breakfast. Restrict dietary sodium (<2g/day). Monitor morning BP.",
    medicines: [
      {
        id: "MED-101",
        name: "Amlodipine 5mg",
        dosage: "5mg",
        frequency: "Once daily (Morning)",
        duration: "30 Days",
        quantity: 30,
        instructions: "Take after breakfast with a full glass of water."
      },
      {
        id: "MED-103",
        name: "Metoprolol Succinate 25mg",
        dosage: "25mg",
        frequency: "Once daily (Morning)",
        duration: "30 Days",
        quantity: 30,
        instructions: "Do not skip doses. Monitor resting pulse rate."
      }
    ]
  },
  {
    id: "RX-502",
    patientId: "PAT-1004",
    patientName: "Clara Oswald",
    doctorId: "USR-004",
    doctorName: "Dr. Elena Rostova",
    department: "Pediatrics",
    date: "2026-09-29",
    diagnosis: "Mild Bronchial Hyperresponsiveness / Allergic Cough",
    status: "Pending",
    instructions: "Use inhaler twice daily. Rinse mouth thoroughly with water after inhalation.",
    medicines: [
      {
        id: "MED-105",
        name: "Montelukast Sodium 10mg",
        dosage: "10mg",
        frequency: "Once daily (Night)",
        duration: "14 Days",
        quantity: 14,
        instructions: "Take at bedtime with water."
      },
      {
        id: "MED-106",
        name: "Levocetirizine 5mg",
        dosage: "5mg",
        frequency: "Once daily (Bedtime)",
        duration: "7 Days",
        quantity: 7,
        instructions: "May cause mild drowsiness."
      }
    ]
  },
  {
    id: "RX-503",
    patientId: "PAT-1003",
    patientName: "Robert Martinez",
    doctorId: "USR-002",
    doctorName: "Dr. Sarah Jenkins",
    department: "Cardiology",
    date: "2026-09-25",
    diagnosis: "Type 2 Diabetes Mellitus with Dyslipidemia",
    status: "Pending",
    instructions: "Maintain balanced diabetic diet and aerobic walks 30 mins/day.",
    medicines: [
      {
        id: "MED-104",
        name: "Atorvastatin 20mg",
        dosage: "20mg",
        frequency: "Once daily (Night)",
        duration: "30 Days",
        quantity: 30,
        instructions: "Take after dinner."
      },
      {
        id: "MED-107",
        name: "Metformin 500mg ER",
        dosage: "500mg",
        frequency: "Twice daily (Post Meals)",
        duration: "30 Days",
        quantity: 60,
        instructions: "Take immediately after principal meals."
      }
    ]
  }
];

export const INITIAL_MEDICINES = [
  {
    id: "MED-101",
    name: "Amlodipine 5mg",
    category: "Cardiovascular / Antihypertensive",
    genericName: "Amlodipine Besylate",
    stock: 240,
    unit: "Tablets",
    minThreshold: 50,
    batchNo: "AML-2025-09",
    expiryDate: "2027-08-31",
    price: 12.50,
    status: "Available",
    manufacturer: "Pfizer Global Health"
  },
  {
    id: "MED-102",
    name: "Amoxicillin & Clavulanate 625mg",
    category: "Antibiotics",
    genericName: "Amoxicillin + Clavulanic Acid",
    stock: 15,
    unit: "Tablets",
    minThreshold: 40,
    batchNo: "AMX-2024-11",
    expiryDate: "2026-12-31",
    price: 24.00,
    status: "Low Stock",
    manufacturer: "GlaxoSmithKline"
  },
  {
    id: "MED-103",
    name: "Metoprolol Succinate 25mg",
    category: "Cardiovascular / Beta Blocker",
    genericName: "Metoprolol Succinate ER",
    stock: 180,
    unit: "Tablets",
    minThreshold: 30,
    batchNo: "MET-2025-01",
    expiryDate: "2027-05-15",
    price: 18.00,
    status: "Available",
    manufacturer: "AstraZeneca"
  },
  {
    id: "MED-104",
    name: "Atorvastatin 20mg",
    category: "Lipid Regulating / Statin",
    genericName: "Atorvastatin Calcium",
    stock: 310,
    unit: "Tablets",
    minThreshold: 50,
    batchNo: "ATV-2025-06",
    expiryDate: "2027-10-30",
    price: 22.00,
    status: "Available",
    manufacturer: "Sun Pharma Med"
  },
  {
    id: "MED-105",
    name: "Montelukast Sodium 10mg",
    category: "Respiratory / Antiallergic",
    genericName: "Montelukast Sodium",
    stock: 85,
    unit: "Tablets",
    minThreshold: 20,
    batchNo: "MNT-2024-03",
    expiryDate: "2026-11-20",
    price: 16.50,
    status: "Available",
    manufacturer: "Merck Healthcare"
  },
  {
    id: "MED-106",
    name: "Levocetirizine 5mg",
    category: "Antihistamine",
    genericName: "Levocetirizine Dihydrochloride",
    stock: 120,
    unit: "Tablets",
    minThreshold: 30,
    batchNo: "LEV-2025-04",
    expiryDate: "2027-04-10",
    price: 9.00,
    status: "Available",
    manufacturer: "Cipla Therapeutics"
  },
  {
    id: "MED-107",
    name: "Metformin 500mg ER",
    category: "Endocrinology / Antidiabetic",
    genericName: "Metformin Hydrochloride",
    stock: 450,
    unit: "Tablets",
    minThreshold: 60,
    batchNo: "MET-2025-08",
    expiryDate: "2027-09-12",
    price: 14.00,
    status: "Available",
    manufacturer: "Bristol Myers"
  },
  {
    id: "MED-108",
    name: "Ceftriaxone 1g Injection",
    category: "Antibiotics / Injectable",
    genericName: "Ceftriaxone Sodium",
    stock: 0,
    unit: "Vials",
    minThreshold: 25,
    batchNo: "CEF-2023-12",
    expiryDate: "2024-01-01",
    price: 35.00,
    status: "Expired",
    manufacturer: "Novartis AG"
  },
  {
    id: "MED-109",
    name: "Paracetamol 650mg",
    category: "Analgesic / Antipyretic",
    genericName: "Acetaminophen",
    stock: 800,
    unit: "Tablets",
    minThreshold: 100,
    batchNo: "PCM-2025-07",
    expiryDate: "2028-02-28",
    price: 5.00,
    status: "Available",
    manufacturer: "GSK Healthcare"
  },
  {
    id: "MED-110",
    name: "Pantoprazole 40mg",
    category: "Gastroenterology / PPI",
    genericName: "Pantoprazole Sodium",
    stock: 22,
    unit: "Tablets",
    minThreshold: 50,
    batchNo: "PAN-2024-05",
    expiryDate: "2026-10-15",
    price: 15.00,
    status: "Low Stock",
    manufacturer: "Dr. Reddy's Lab"
  }
];

export const INITIAL_LAB_TESTS = [
  {
    id: "LAB-301",
    patientId: "PAT-1001",
    patientName: "Johnathan Doe",
    doctorId: "USR-002",
    doctorName: "Dr. Sarah Jenkins",
    department: "Cardiology",
    testName: "Complete Blood Count (CBC) with ESR",
    category: "Hematology",
    requestedDate: "2026-09-20",
    priority: "Routine",
    sampleType: "Whole Blood (EDTA)",
    status: "Completed",
    notes: "Assess baseline hemoglobin, white blood cells, and platelets prior to medication adjustment."
  },
  {
    id: "LAB-302",
    patientId: "PAT-1001",
    patientName: "Johnathan Doe",
    doctorId: "USR-002",
    doctorName: "Dr. Sarah Jenkins",
    department: "Cardiology",
    testName: "Lipid Profile & Serum Electrolytes",
    category: "Biochemistry",
    requestedDate: "2026-09-20",
    priority: "Routine",
    sampleType: "Serum (Fasting)",
    status: "Completed",
    notes: "Fasting lipid panel to evaluate cardiovascular atherogenic risk."
  },
  {
    id: "LAB-303",
    patientId: "PAT-1003",
    patientName: "Robert Martinez",
    doctorId: "USR-002",
    doctorName: "Dr. Sarah Jenkins",
    department: "Cardiology",
    testName: "Glycated Hemoglobin (HbA1c)",
    category: "Biochemistry",
    requestedDate: "2026-09-28",
    priority: "Routine",
    sampleType: "Whole Blood (EDTA)",
    status: "In Progress",
    notes: "Evaluate 3-month glycemic control for diabetic management."
  },
  {
    id: "LAB-304",
    patientId: "PAT-1002",
    patientName: "Emily Watson",
    doctorId: "USR-003",
    doctorName: "Dr. Michael Chen",
    department: "Neurology",
    testName: "Serum Vitamin B12 & Vitamin D3",
    category: "Biochemistry",
    requestedDate: "2026-09-29",
    priority: "Urgent",
    sampleType: "Serum",
    status: "Requested",
    notes: "Evaluate potential metabolic causes for migraine and tingling sensations."
  },
  {
    id: "LAB-305",
    patientId: "PAT-1005",
    patientName: "Henry Cavill",
    doctorId: "USR-005",
    doctorName: "Dr. David Miller",
    department: "Orthopedics",
    testName: "C-Reactive Protein (CRP) Quantitative",
    category: "Serology",
    requestedDate: "2026-09-28",
    priority: "Routine",
    sampleType: "Serum",
    status: "Completed",
    notes: "Rule out postoperative inflammatory joint reaction."
  }
];

export const INITIAL_LAB_REPORTS = [
  {
    id: "REP-901",
    testId: "LAB-301",
    patientId: "PAT-1001",
    patientName: "Johnathan Doe",
    doctorId: "USR-002",
    doctorName: "Dr. Sarah Jenkins",
    testName: "Complete Blood Count (CBC) with ESR",
    category: "Hematology",
    testDate: "2026-09-21",
    completedDate: "2026-09-21",
    technicianName: "Dr. Priya Sharma",
    sampleType: "Whole Blood (EDTA)",
    status: "Completed",
    parameters: [
      { parameter: "Hemoglobin (Hb)", result: "14.8", unit: "g/dL", referenceRange: "13.5 - 17.5", status: "Normal" },
      { parameter: "Total Leucocyte Count (TLC)", result: "6,800", unit: "/cumm", referenceRange: "4,000 - 11,000", status: "Normal" },
      { parameter: "Platelet Count", result: "245,000", unit: "/cumm", referenceRange: "150,000 - 450,000", status: "Normal" },
      { parameter: "Packed Cell Volume (PCV)", result: "44.2", unit: "%", referenceRange: "40.0 - 50.0", status: "Normal" },
      { parameter: "Erythrocyte Sedimentation Rate (ESR)", result: "8", unit: "mm/hr", referenceRange: "0 - 15", status: "Normal" }
    ],
    remarks: "All hematological indices are within physiological reference intervals. No evidence of anemia or active systemic infection.",
    technicianNotes: "Specimen verified and processed on automated 5-part hematology analyzer without clotting."
  },
  {
    id: "REP-902",
    testId: "LAB-302",
    patientId: "PAT-1001",
    patientName: "Johnathan Doe",
    doctorId: "USR-002",
    doctorName: "Dr. Sarah Jenkins",
    testName: "Lipid Profile & Serum Electrolytes",
    category: "Biochemistry",
    testDate: "2026-09-21",
    completedDate: "2026-09-21",
    technicianName: "Dr. Priya Sharma",
    sampleType: "Serum (Fasting 12h)",
    status: "Completed",
    parameters: [
      { parameter: "Total Cholesterol", result: "192", unit: "mg/dL", referenceRange: "< 200", status: "Normal" },
      { parameter: "Triglycerides", result: "165", unit: "mg/dL", referenceRange: "< 150", status: "Borderline High" },
      { parameter: "HDL Cholesterol (Good)", result: "46", unit: "mg/dL", referenceRange: "> 40", status: "Normal" },
      { parameter: "LDL Cholesterol (Calculated)", result: "113", unit: "mg/dL", referenceRange: "< 100", status: "Borderline High" },
      { parameter: "Serum Sodium (Na+)", result: "140", unit: "mEq/L", referenceRange: "135 - 145", status: "Normal" },
      { parameter: "Serum Potassium (K+)", result: "4.2", unit: "mEq/L", referenceRange: "3.5 - 5.1", status: "Normal" }
    ],
    remarks: "Mildly elevated serum triglycerides and LDL cholesterol. Normal serum electrolytes.",
    technicianNotes: "Fasting state verified with patient prior to venous blood sample collection."
  },
  {
    id: "REP-903",
    testId: "LAB-305",
    patientId: "PAT-1005",
    patientName: "Henry Cavill",
    doctorId: "USR-005",
    doctorName: "Dr. David Miller",
    testName: "C-Reactive Protein (CRP) Quantitative",
    category: "Serology",
    testDate: "2026-09-28",
    completedDate: "2026-09-28",
    technicianName: "Dr. Priya Sharma",
    sampleType: "Serum",
    status: "Completed",
    parameters: [
      { parameter: "CRP Quantitative", result: "2.1", unit: "mg/L", referenceRange: "< 5.0", status: "Normal" }
    ],
    remarks: "CRP is well within normal limits, ruling out acute post-operative bacterial synovitis or inflammation.",
    technicianNotes: "Immuno-turbidimetric assay calibrated."
  }
];

export const INITIAL_BILLS = [
  {
    id: "INV-801",
    patientId: "PAT-1001",
    patientName: "Johnathan Doe",
    patientPhone: "+1 (555) 019-1100",
    date: "2026-09-20",
    status: "Paid",
    paymentMethod: "Credit Card (Visa - 4022)",
    paidDate: "2026-09-20",
    generatedBy: "Rachel Cooper (Receptionist)",
    items: [
      { description: "Specialist Consultation Fee (Dr. Sarah Jenkins - Cardiology)", department: "Cardiology", amount: 100.00 },
      { description: "Complete Blood Count (CBC) with ESR", department: "Laboratory", amount: 45.00 },
      { description: "Lipid Profile & Serum Electrolytes Panel", department: "Laboratory", amount: 75.00 },
      { description: "Pharmacy: Amlodipine 5mg (30 Tabs) + Metoprolol 25mg (30 Tabs)", department: "Pharmacy", amount: 30.50 }
    ],
    subtotal: 250.50,
    tax: 0.00,
    discount: 0.00,
    totalAmount: 250.50
  },
  {
    id: "INV-802",
    patientId: "PAT-1004",
    patientName: "Clara Oswald",
    patientPhone: "+1 (555) 043-6622",
    date: "2026-09-29",
    status: "Unpaid",
    generatedBy: "Rachel Cooper (Receptionist)",
    items: [
      { description: "Pediatric Outpatient Consultation (Dr. Elena Rostova)", department: "Pediatrics", amount: 90.00 },
      { description: "Spirometry Peak Flow Respiratory Assessment", department: "Diagnostics", amount: 50.00 }
    ],
    subtotal: 140.00,
    tax: 0.00,
    discount: 10.00,
    totalAmount: 130.00
  },
  {
    id: "INV-803",
    patientId: "PAT-1003",
    patientName: "Robert Martinez",
    patientPhone: "+1 (555) 032-4411",
    date: "2026-09-28",
    status: "Unpaid",
    generatedBy: "Rachel Cooper (Receptionist)",
    items: [
      { description: "Cardiology Review Consultation (Dr. Sarah Jenkins)", department: "Cardiology", amount: 80.00 },
      { description: "Glycated Hemoglobin (HbA1c) Laboratory Test", department: "Laboratory", amount: 40.00 }
    ],
    subtotal: 120.00,
    tax: 0.00,
    discount: 0.00,
    totalAmount: 120.00
  },
  {
    id: "INV-804",
    patientId: "PAT-1005",
    patientName: "Henry Cavill",
    patientPhone: "+1 (555) 054-7733",
    date: "2026-09-28",
    status: "Paid",
    paymentMethod: "Insurance / TPA Claim",
    paidDate: "2026-09-28",
    generatedBy: "Rachel Cooper (Receptionist)",
    items: [
      { description: "Orthopedic Post-Operative Review (Dr. David Miller)", department: "Orthopedics", amount: 110.00 },
      { description: "C-Reactive Protein (CRP) Laboratory Assay", department: "Laboratory", amount: 35.00 },
      { description: "Physical Rehabilitation Assessment", department: "Physiotherapy", amount: 65.00 }
    ],
    subtotal: 210.00,
    tax: 0.00,
    discount: 0.00,
    totalAmount: 210.00
  }
];

export const INITIAL_MEDICAL_HISTORY = [
  {
    id: "MED-REC-01",
    patientId: "PAT-1001",
    date: "2026-09-20",
    doctorName: "Dr. Sarah Jenkins",
    department: "Cardiology",
    diagnosis: "Primary Stage-1 Hypertension",
    notes: "Patient reported occasional dizziness and mild chest heaviness following brisk walks. Blood pressure measured at 144/92 mmHg, pulse 88 bpm. Heart sounds S1 S2 normal. Ordered CBC, Lipid panel, and initiated Amlodipine + Metoprolol therapy.",
    prescriptions: ["RX-501 (Amlodipine 5mg, Metoprolol 25mg)"],
    labTests: ["LAB-301 (CBC with ESR)", "LAB-302 (Lipid Profile & Electrolytes)"]
  },
  {
    id: "MED-REC-02",
    patientId: "PAT-1001",
    date: "2026-09-15",
    doctorName: "Dr. David Miller",
    department: "Orthopedics",
    diagnosis: "Acute Lumbar Muscular Strain",
    notes: "Patient presented with lower back discomfort after lifting heavy office storage boxes. Neurological exam negative, straight leg raise negative bilaterally. Recommended active rest, hot compress, and prescribed paracetamol with posture guidance.",
    prescriptions: ["Paracetamol 650mg SOS"],
    labTests: ["None required"]
  },
  {
    id: "MED-REC-03",
    patientId: "PAT-1005",
    date: "2026-09-28",
    doctorName: "Dr. David Miller",
    department: "Orthopedics",
    diagnosis: "Post-op Right Knee ACL Reconstruction Rehabilitation",
    notes: "Surgical portal wounds fully epithelialized. Range of motion 0 to 110 degrees flexion without effusion. Progress to phase 2 physical resistance exercises.",
    prescriptions: ["Calcium & Vitamin D3 daily"],
    labTests: ["LAB-305 (CRP Quantitative)"]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTIF-001",
    targetRole: "Patient",
    targetUserId: "USR-009",
    title: "Appointment Confirmed",
    message: "Your upcoming appointment with Dr. Sarah Jenkins (Cardiology) is scheduled for Sep 30, 2026 at 10:30 AM in OPD Room 204.",
    timestamp: "2026-09-29 09:15 AM",
    type: "appointment",
    read: false
  },
  {
    id: "NOTIF-002",
    targetRole: "Patient",
    targetUserId: "USR-009",
    title: "Laboratory Report Ready",
    message: "Your test results for Lipid Profile & Serum Electrolytes have been verified by the laboratory and are now available for viewing.",
    timestamp: "2026-09-21 04:30 PM",
    type: "lab",
    read: true
  },
  {
    id: "NOTIF-003",
    targetRole: "Doctor",
    targetUserId: "USR-002",
    title: "New Appointment Booked",
    message: "Johnathan Doe has booked an appointment for Cardiology Follow-up on Sep 30 at 10:30 AM.",
    timestamp: "2026-09-29 09:15 AM",
    type: "appointment",
    read: false
  },
  {
    id: "NOTIF-004",
    targetRole: "Pharmacist",
    targetUserId: "USR-007",
    title: "New Prescription Received",
    message: "Prescription RX-502 for patient Clara Oswald has been submitted by Dr. Elena Rostova and is pending dispensing.",
    timestamp: "2026-09-29 10:00 AM",
    type: "prescription",
    read: false
  },
  {
    id: "NOTIF-005",
    targetRole: "Lab Technician",
    targetUserId: "USR-008",
    title: "Urgent Laboratory Test Requested",
    message: "Dr. Michael Chen requested an Urgent Serum Vitamin B12 & D3 panel for patient Emily Watson (LAB-304).",
    timestamp: "2026-09-29 11:20 AM",
    type: "lab",
    read: false
  },
  {
    id: "NOTIF-006",
    targetRole: "Administrator",
    targetUserId: "USR-001",
    title: "Low Stock Alert",
    message: "Medicine 'Amoxicillin & Clavulanate 625mg' and 'Pantoprazole 40mg' have reached low threshold quantities.",
    timestamp: "2026-09-29 08:00 AM",
    type: "inventory",
    read: false
  },
  {
    id: "NOTIF-007",
    targetRole: "Receptionist",
    targetUserId: "USR-006",
    title: "Pending Bill Generation",
    message: "Consultation completed for Clara Oswald with Dr. Elena Rostova. Bill #INV-802 is ready for counter settlement.",
    timestamp: "2026-09-29 10:15 AM",
    type: "billing",
    read: false
  }
];

export const INITIAL_ACTIVITY_LOGS = [
  { id: "LOG-01", action: "Appointment Scheduled", user: "Johnathan Doe (Patient)", details: "Booked slot with Dr. Sarah Jenkins (Cardiology)", time: "10 mins ago" },
  { id: "LOG-02", action: "Prescription Dispensed", user: "James Wilson (Pharmacist)", details: "Dispensed RX-501 (Amlodipine, Metoprolol)", time: "1 hour ago" },
  { id: "LOG-03", action: "Lab Result Published", user: "Dr. Priya Sharma (Lab Tech)", details: "Completed CBC report for Johnathan Doe", time: "2 hours ago" },
  { id: "LOG-04", action: "Bill Created", user: "Rachel Cooper (Receptionist)", details: "Generated invoice INV-802 for Clara Oswald ($130.00)", time: "3 hours ago" },
  { id: "LOG-05", action: "Patient Registered", user: "Rachel Cooper (Receptionist)", details: "Registered Emily Watson (PAT-1002)", time: "Yesterday" }
];
