export type PatientStatus = 'Outpatient' | 'Inpatient' | 'Emergency' | 'Discharged';
export type Gender = 'Male' | 'Female' | 'Other';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Patient {
  id: string;
  uhid: string; // Unique Healthcare ID, e.g. UHID-8921
  name: string;
  age: number;
  gender: Gender;
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  status: PatientStatus;
  admittedDate?: string;
  dischargeDate?: string;
  assignedDoctor?: string;
  assignedDepartment?: string;
  roomBed?: string;
  diagnoses: string[];
  allergies?: string[];
  createdAt: string;
}

export type DoctorStatus = 'Active' | 'On Leave' | 'In Surgery' | 'Off Duty';

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  specialization: string;
  qualifications: string;
  experienceYears: number;
  roomNumber: string;
  consultationFee: number;
  availableDays: string[];
  availableHours: string;
  status: DoctorStatus;
  avatarUrl?: string;
  rating?: number;
  totalConsultations?: number;
}

export type StaffRole = 'Nurse' | 'Lab Technician' | 'Pharmacist' | 'Receptionist' | 'Radiologist' | 'Administrator' | 'Ward In-Charge';
export type ShiftType = 'Morning (07:00 - 15:00)' | 'Evening (15:00 - 23:00)' | 'Night (23:00 - 07:00)' | 'General (09:00 - 17:00)';
export type StaffStatus = 'Active' | 'On Leave' | 'Off Duty';

export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  department: string;
  phone: string;
  email: string;
  shift: ShiftType;
  status: StaffStatus;
  joinDate: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headDoctor: string;
  totalBeds: number;
  occupiedBeds: number;
  totalDoctors: number;
  totalStaff: number;
  description: string;
  location: string;
  contactExtension: string;
}

export type AppointmentType = 'Routine Checkup' | 'Follow-up' | 'Emergency' | 'Specialist Consultation' | 'Diagnostic Review';
export type AppointmentStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';

export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientName: string;
  patientUhid: string;
  patientPhone: string;
  patientEmail?: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  timeSlot: string;
  type: AppointmentType;
  status: AppointmentStatus;
  symptoms?: string;
  notes?: string;
  createdAt: string;
}

export type MedicineCategory = 'Antibiotics' | 'Analgesics / Pain Relief' | 'Cardiovascular' | 'Antidiabetic' | 'Respiratory' | 'Gastrointestinal' | 'Vitamins & Minerals' | 'Anesthetics';
export type MedicineStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired';

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: MedicineCategory;
  batchNumber: string;
  stockQuantity: number;
  minThreshold: number;
  unitPrice: number;
  expiryDate: string;
  manufacturer: string;
  locationRack: string;
  status: MedicineStatus;
}

export type LabTestStatus = 'Pending Sample' | 'Sample Collected' | 'In Analysis' | 'Completed' | 'Cancelled';
export type LabTestPriority = 'Routine' | 'Urgent' | 'STAT (Emergency)';

export interface LabTest {
  id: string;
  testCode: string;
  testName: string;
  category: string;
  patientName: string;
  patientUhid: string;
  referredByDoctor: string;
  priority: LabTestPriority;
  sampleType: string;
  orderDate: string;
  completedDate?: string;
  status: LabTestStatus;
  resultsSummary?: string;
  cost: number;
}

export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';
export type PaymentMethod = 'Cash' | 'Credit/Debit Card' | 'Insurance / TPA' | 'UPI / Bank Transfer';

export interface InvoiceItem {
  description: string;
  category: 'Consultation' | 'Laboratory' | 'Pharmacy' | 'Bed Charges' | 'Surgery' | 'Other';
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientName: string;
  patientUhid: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export type NotificationType = 'Emergency' | 'Clinical' | 'Inventory' | 'Administrative' | 'System';

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface HospitalStats {
  totalPatients: number;
  totalDoctors: number;
  todayAppointments: number;
  pendingLabTests: number;
  availableMedicines: number;
  pendingBillsCount: number;
  pendingBillsAmount: number;
  bedOccupancyRate: number;
}
