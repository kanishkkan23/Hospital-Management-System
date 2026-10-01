/**
 * Automated Verification Test Suite for CarePoint HMS Backend
 * Tests all 14 hospital core workflows, role authorizations, and data consistency.
 */

import http from 'http';
import app from '../src/app.js';

let server;
let baseUrl;

const request = (method, path, body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, headers: res.headers, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function runTests() {
  console.log('====================================================');
  console.log('🧪 STARTING CAREPOINT HMS BACKEND TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, title, details = '') => {
    if (condition) {
      console.log(`  ✅ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${title} - ${details}`);
      failed++;
    }
  };

  // Start test server on random high port
  server = app.listen(0);
  const port = server.address().port;
  baseUrl = `http://localhost:${port}`;

  try {
    // 1. Health Check
    console.log('--- 1. API Health Check ---');
    const health = await request('GET', '/api/health');
    assert(health.status === 200 && health.body.success === true, 'Health check returns 200 and success status');

    // 2. Authentication & Profile Retrieval
    console.log('\n--- 2. Authentication & User Profile Resolution ---');
    const doctorLogin = await request('POST', '/api/auth/login', {
      email: 'doctor@carepoint.com',
      password: 'password123',
      role: 'Doctor'
    });
    assert(doctorLogin.status === 200, 'Doctor login returns 200 OK');
    assert(doctorLogin.body.data.user.role === 'Doctor', 'Doctor login assigns Doctor role');
    assert(doctorLogin.body.data.user.fullName === 'Dr. Sarah Jenkins', 'Authenticated doctor is Dr. Sarah Jenkins (deterministic profile)');

    const doctorToken = doctorLogin.body.data.session.accessToken;
    const docAuthHeaders = { 'Authorization': `Bearer ${doctorToken}` };

    const docMe = await request('GET', '/api/auth/me', null, docAuthHeaders);
    assert(docMe.status === 200 && docMe.body.data.fullName === 'Dr. Sarah Jenkins', 'GET /api/auth/me resolves doctor identity');

    // Patient Login
    const patientLogin = await request('POST', '/api/auth/login', {
      email: 'patient@carepoint.com',
      password: 'password123',
      role: 'Patient'
    });
    assert(patientLogin.status === 200, 'Patient login returns 200 OK');
    assert(patientLogin.body.data.user.fullName === 'Johnathan Doe', 'Authenticated patient is Johnathan Doe (deterministic profile)');

    const patientToken = patientLogin.body.data.session.accessToken;
    const patientAuthHeaders = { 'Authorization': `Bearer ${patientToken}` };

    // Admin Login
    const adminLogin = await request('POST', '/api/auth/login', {
      email: 'admin@carepoint.com',
      password: 'password123',
      role: 'Administrator'
    });
    const adminToken = adminLogin.body.data.session.accessToken;
    const adminAuthHeaders = { 'Authorization': `Bearer ${adminToken}` };

    // Pharmacist Login
    const pharmacistLogin = await request('POST', '/api/auth/login', {
      email: 'pharmacy@carepoint.com',
      password: 'password123',
      role: 'Pharmacist'
    });
    const pharmacistToken = pharmacistLogin.body.data.session.accessToken;
    const pharmacistAuthHeaders = { 'Authorization': `Bearer ${pharmacistToken}` };

    // Lab Tech Login
    const labLogin = await request('POST', '/api/auth/login', {
      email: 'lab@carepoint.com',
      password: 'password123',
      role: 'Lab Technician'
    });
    const labToken = labLogin.body.data.session.accessToken;
    const labAuthHeaders = { 'Authorization': `Bearer ${labToken}` };

    // Receptionist Login
    const receptionLogin = await request('POST', '/api/auth/login', {
      email: 'reception@carepoint.com',
      password: 'password123',
      role: 'Receptionist'
    });
    const receptionToken = receptionLogin.body.data.session.accessToken;
    const receptionAuthHeaders = { 'Authorization': `Bearer ${receptionToken}` };

    // 3. Role Authorization & Protection
    console.log('\n--- 3. Role-Based Authorization & Security Guards ---');
    // Patient attempts to access Admin-only settings route
    const forbiddenRes = await request('PUT', '/api/settings', { hospitalName: 'Hacked Hospital' }, patientAuthHeaders);
    assert(forbiddenRes.status === 403, 'Patient forbidden from modifying hospital settings (403)');

    // Unauthenticated request to protected route
    const unauthRes = await request('GET', '/api/appointments');
    assert(unauthRes.status === 401, 'Unauthenticated request rejected with 401');

    // 4. Department Module
    console.log('\n--- 4. Department Module ---');
    const depts = await request('GET', '/api/departments');
    assert(depts.status === 200 && depts.body.data.length >= 6, 'Retrieves all hospital departments');

    // 5. Doctor & Availability Module
    console.log('\n--- 5. Doctor & Availability Module ---');
    const doctors = await request('GET', '/api/doctors');
    assert(doctors.status === 200 && doctors.body.data.length >= 4, 'Retrieves doctor directory');
    const docAvailability = await request('GET', `/api/doctors/${doctors.body.data[0].id}/availability`);
    assert(docAvailability.status === 200 && Array.isArray(docAvailability.body.data.slots), 'Retrieves doctor available time slots');

    // 6. Patient Registration & Management
    console.log('\n--- 6. Patient Registration Module ---');
    const newPatient = await request('POST', '/api/patients', {
      fullName: 'George Washington',
      email: 'george@carepoint-test.com',
      phone: '+1 (555) 998-1122',
      gender: 'Male',
      dateOfBirth: '1990-04-12',
      bloodGroup: 'O+',
      emergencyContact: 'Martha Washington (+1 555-998-1123)',
      address: '100 Presidential Way'
    }, receptionAuthHeaders);
    assert(newPatient.status === 201, 'Receptionist registers new patient successfully (201)');
    assert(newPatient.body.data.patientCode.startsWith('PAT-'), 'Generates valid patient code format PAT-XXX');

    // 7. Appointment Booking & Workflow
    console.log('\n--- 7. Appointment Booking & Workflow ---');
    const bookAppt = await request('POST', '/api/appointments', {
      patientId: 'dddddddd-dddd-dddd-dddd-dddddddd0001',
      patientName: 'Johnathan Doe',
      doctorId: 'cccccccc-cccc-cccc-cccc-cccccccc0001',
      doctorName: 'Dr. Sarah Jenkins',
      department: 'Cardiology',
      date: '2026-10-15',
      time: '10:00 AM',
      type: 'Consultation',
      reason: 'Routine ECG Followup & Blood Pressure Check'
    }, patientAuthHeaders);
    assert(bookAppt.status === 201, 'Patient books appointment successfully');
    const createdApptId = bookAppt.body.data.id;

    // Doctor updates appointment status
    const updateAppt = await request('PATCH', `/api/appointments/${createdApptId}/status`, {
      status: 'In Consultation'
    }, docAuthHeaders);
    assert(updateAppt.status === 200 && updateAppt.body.data.status === 'In Consultation', 'Doctor updates appointment status to In Consultation');

    // 8. Medical Records & Consultation
    console.log('\n--- 8. Medical Records & Consultation ---');
    const newRecord = await request('POST', '/api/medical-records', {
      patientId: 'dddddddd-dddd-dddd-dddd-dddddddd0001',
      patientName: 'Johnathan Doe',
      doctorId: 'cccccccc-cccc-cccc-cccc-cccccccc0001',
      doctorName: 'Dr. Sarah Jenkins',
      department: 'Cardiology',
      date: '2026-10-15',
      diagnosis: 'Mild Sinus Bradycardia',
      symptoms: 'Mild dizziness on standing',
      notes: 'Patient advised to increase hydration and continue monitoring.',
      vitals: { bloodPressure: '118/76', heartRate: '58 bpm', temperature: '98.4 F', weight: '62 kg' }
    }, docAuthHeaders);
    assert(newRecord.status === 201, 'Doctor creates clinical consultation record');

    // 9. Prescription & Pharmacy Inventory Dispensing
    console.log('\n--- 9. Prescription & Pharmacy Dispensing Workflow ---');
    const newPrescription = await request('POST', '/api/prescriptions', {
      patientId: 'dddddddd-dddd-dddd-dddd-dddddddd0001',
      patientName: 'Johnathan Doe',
      doctorId: 'cccccccc-cccc-cccc-cccc-cccccccc0001',
      doctorName: 'Dr. Sarah Jenkins',
      diagnosis: 'Mild Sinus Bradycardia',
      medicines: [
        {
          name: 'Metoprolol Succinate 25mg',
          dosage: '25mg',
          frequency: 'Once Daily',
          duration: '14 Days',
          quantity: 14,
          instructions: 'Take in the morning after breakfast'
        }
      ],
      notes: 'Review in 2 weeks'
    }, docAuthHeaders);
    assert(newPrescription.status === 201, 'Doctor creates prescription with medication items');
    const rxId = newPrescription.body.data.id;

    // Pharmacist dispenses prescription
    const dispenseRx = await request('PATCH', `/api/prescriptions/${rxId}/dispense`, {}, pharmacistAuthHeaders);
    assert(dispenseRx.status === 200 && dispenseRx.body.data.status === 'Dispensed', 'Pharmacist dispenses prescription and updates status');

    // 10. Medicine Inventory Management
    console.log('\n--- 10. Medicine Inventory Module ---');
    const meds = await request('GET', '/api/medicines', null, pharmacistAuthHeaders);
    assert(meds.status === 200 && meds.body.data.length >= 6, 'Pharmacist retrieves medicine stock');
    const lowStock = await request('GET', '/api/medicines/low-stock', null, pharmacistAuthHeaders);
    assert(lowStock.status === 200 && Array.isArray(lowStock.body.data), 'Retrieves low stock alerts');

    // 11. Laboratory Testing & Report Workflow
    console.log('\n--- 11. Laboratory Workflow ---');
    const labTestReq = await request('POST', '/api/lab-tests/tests', {
      patientId: 'dddddddd-dddd-dddd-dddd-dddddddd0001',
      patientName: 'Johnathan Doe',
      doctorId: 'cccccccc-cccc-cccc-cccc-cccccccc0001',
      doctorName: 'Dr. Sarah Jenkins',
      testType: 'Complete Blood Count (CBC)',
      instructions: 'Fasting not required',
      priority: 'Routine'
    }, docAuthHeaders);
    assert(labTestReq.status === 201, 'Doctor orders laboratory test');
    const testId = labTestReq.body.data.id;

    // Lab tech starts test
    const startTest = await request('PATCH', `/api/lab-tests/tests/${testId}/start`, {}, labAuthHeaders);
    assert(startTest.status === 200 && startTest.body.data.status === 'In Progress', 'Lab tech marks test In Progress');

    // Lab tech completes report
    const completeReport = await request('POST', '/api/lab-tests/reports', {
      testId: testId,
      patientId: 'dddddddd-dddd-dddd-dddd-dddddddd0001',
      patientName: 'Johnathan Doe',
      doctorId: 'cccccccc-cccc-cccc-cccc-cccccccc0001',
      doctorName: 'Dr. Sarah Jenkins',
      testType: 'Complete Blood Count (CBC)',
      parameters: [
        { parameter: 'Hemoglobin', result: '13.8', referenceRange: '12.0 - 15.5 g/dL', unit: 'g/dL', status: 'Normal' },
        { parameter: 'WBC Count', result: '6,400', referenceRange: '4,500 - 11,000 /mcL', unit: '/mcL', status: 'Normal' }
      ],
      remarks: 'All hematological parameters within healthy adult reference limits.',
      technicianName: 'Dr. Priya Sharma'
    }, labAuthHeaders);
    assert(completeReport.status === 201 && completeReport.body.data.status === 'Completed', 'Lab technician completes and submits report');

    // 12. Billing & Invoicing Workflow
    console.log('\n--- 12. Billing & Invoicing Module ---');
    const newBill = await request('POST', '/api/bills', {
      patientId: 'dddddddd-dddd-dddd-dddd-dddddddd0001',
      patientName: 'Johnathan Doe',
      items: [
        { description: 'Cardiology Specialist Consultation', amount: 150 },
        { description: 'Complete Blood Count (CBC)', amount: 45 },
        { description: 'Metoprolol Tartrate 25mg (14 Tabs)', amount: 20 }
      ],
      discount: 15,
      tax: 10
    }, receptionAuthHeaders);
    assert(newBill.status === 201, 'Receptionist creates bill');
    assert(newBill.body.data.totalAmount === 210, `Calculates total amount correctly: 150+45+20-15+10 = 210 (Got ${newBill.body.data.totalAmount})`);

    const billId = newBill.body.data.id;
    const payBill = await request('PATCH', `/api/bills/${billId}/status`, { status: 'Paid', paymentMethod: 'Credit Card' }, receptionAuthHeaders);
    assert(payBill.status === 200 && payBill.body.data.status === 'Paid', 'Bill status updated to Paid');

    // 13. Notifications Module
    console.log('\n--- 13. Notifications Module ---');
    const notifs = await request('GET', '/api/notifications', null, patientAuthHeaders);
    assert(notifs.status === 200 && Array.isArray(notifs.body.data), 'Retrieves user notifications');

    // 14. Hospital Settings & Activity Logs
    console.log('\n--- 14. Hospital Settings & Audit Logs ---');
    const settings = await request('GET', '/api/settings');
    assert(settings.status === 200 && settings.body.data.hospitalName.includes('CarePoint'), 'Retrieves hospital branding and settings');
    const logs = await request('GET', '/api/settings/activity-logs', null, adminAuthHeaders);
    assert(logs.status === 200 && Array.isArray(logs.body.data), 'Administrator retrieves operational activity audit log');

  } catch (err) {
    console.error('Fatal Test Suite Error:', err);
    failed++;
  } finally {
    if (server) server.close();
  }

  console.log('\n====================================================');
  console.log(`🏁 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
