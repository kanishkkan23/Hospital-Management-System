/**
 * Medical Identifier Code Generators
 */

export const generatePatientCode = (count = 1) => {
  return `PAT-${(1000 + count).toString()}`;
};

export const generateAppointmentCode = (count = 1) => {
  const year = new Date().getFullYear();
  return `APT-${year}-${count.toString().padStart(2, '0')}`;
};

export const generatePrescriptionCode = (count = 1) => {
  return `RX-${(500 + count).toString()}`;
};

export const generateLabTestCode = (count = 1) => {
  return `LAB-${(300 + count).toString()}`;
};

export const generateLabReportCode = (count = 1) => {
  return `REP-${(900 + count).toString()}`;
};

export const generateInvoiceCode = (count = 1) => {
  return `INV-${(800 + count).toString()}`;
};

export const generateMedicineCode = (count = 1) => {
  return `MED-${(100 + count).toString()}`;
};

export const generateRecordCode = (count = 1) => {
  return `MED-REC-${count.toString().padStart(2, '0')}`;
};

export const generateLogCode = () => {
  return `LOG-${Date.now().toString().slice(-4)}`;
};
