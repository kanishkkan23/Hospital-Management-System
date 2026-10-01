import { errorResponse } from '../utils/response.js';

export const validate = (schemaFn) => {
  return (req, res, next) => {
    const errors = schemaFn(req.body, req);
    if (errors && errors.length > 0) {
      return errorResponse(res, 400, 'Validation failed for request data', errors);
    }
    next();
  };
};

export const hmsValidators = {
  login: (body) => {
    const errors = [];
    if (!body.email || !body.email.includes('@')) errors.push('A valid email address is required.');
    if (!body.password) errors.push('Password field is required.');
    return errors;
  },

  patientRegistration: (body) => {
    const errors = [];
    if (!body.name && !body.fullName) errors.push('Patient full legal name is required.');
    if (!body.email || !body.email.includes('@')) errors.push('Valid email address is required.');
    if (!body.phone) errors.push('Contact phone number is required.');
    return errors;
  },

  appointmentBooking: (body) => {
    const errors = [];
    if (!body.patientId && !body.patientName) errors.push('Patient identification is required.');
    if (!body.doctorId && !body.doctorName) errors.push('Doctor selection is required.');
    if (!body.date && !body.appointmentDate) errors.push('Appointment date is required.');
    if (!body.time && !body.appointmentTime) errors.push('Appointment time slot is required.');
    return errors;
  },

  medicalRecordCreation: (body) => {
    const errors = [];
    if (!body.patientId && !body.patientName) errors.push('Patient ID is required.');
    if (!body.diagnosis) errors.push('Clinical diagnosis is required.');
    return errors;
  },

  prescriptionCreation: (body) => {
    const errors = [];
    if (!body.patientId && !body.patientName) errors.push('Patient ID is required.');
    if (!body.diagnosis) errors.push('Clinical diagnosis description is required.');
    if (!body.medicines || !Array.isArray(body.medicines) || body.medicines.length === 0) {
      errors.push('At least one prescribed medicine item must be specified.');
    }
    return errors;
  },

  labOrderCreation: (body) => {
    const errors = [];
    if (!body.patientId && !body.patientName) errors.push('Patient ID is required.');
    if (!body.testType && !body.testName) errors.push('Laboratory test name/type is required.');
    return errors;
  },

  labReportSubmission: (body) => {
    const errors = [];
    if (!body.testId) errors.push('Lab test ID is required.');
    if (!body.parameters || !Array.isArray(body.parameters) || body.parameters.length === 0) {
      errors.push('Report must include at least one observed test parameter.');
    }
    return errors;
  },

  billCreation: (body) => {
    const errors = [];
    if (!body.patientId && !body.patientName) errors.push('Patient ID is required.');
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      errors.push('Bill must include at least one itemized hospital service charge.');
    }
    return errors;
  },

  medicineCreation: (body) => {
    const errors = [];
    if (!body.name) errors.push('Medicine brand name is required.');
    if (!body.category) errors.push('Medicine therapeutic category is required.');
    return errors;
  }
};

// Middleware exports
export const validateAppointmentCreation = validate(hmsValidators.appointmentBooking);
export const validateMedicalRecordCreation = validate(hmsValidators.medicalRecordCreation);
export const validatePrescriptionCreation = validate(hmsValidators.prescriptionCreation);
export const validateLabTestCreation = validate(hmsValidators.labOrderCreation);
export const validateLabReportCompletion = validate(hmsValidators.labReportSubmission);
export const validateBillCreation = validate(hmsValidators.billCreation);
export const validateMedicineCreation = validate(hmsValidators.medicineCreation);
export const validatePatientRegistration = validate(hmsValidators.patientRegistration);
