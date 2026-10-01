# CarePoint Hospital Management System (HMS) - REST API Documentation

## Base URL
- **Local API**: `http://localhost:5000/api`
- **Content-Type**: `application/json`
- **Authentication**: `Bearer <JWT_ACCESS_TOKEN>` in `Authorization` header

---

## Standard Response Format

### Success Response (`200 OK` / `201 Created`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful message",
  "data": { ... },
  "timestamp": "2026-09-29T23:00:00.000Z"
}
```

### Error Response (`400 Bad Request` / `401 Unauthorized` / `403 Forbidden` / `404 Not Found`)
```json
{
  "success": false,
  "statusCode": 403,
  "message": "Access denied. Role 'Patient' does not have permission.",
  "errors": null,
  "timestamp": "2026-09-29T23:00:00.000Z"
}
```

---

## 1. Authentication & User Profile (`/api/auth`)

### 1.1 User Login
- **Endpoint**: `POST /api/auth/login`
- **Auth Required**: No (Public)
- **Request Body**:
  ```json
  {
    "email": "doctor@carepoint.com",
    "password": "password123",
    "role": "Doctor"
  }
  ```
- **Response**: Returns JWT token, Supabase session, and user profile data.

### 1.2 Get Current Identity (`/api/auth/me`)
- **Endpoint**: `GET /api/auth/me`
- **Auth Required**: Yes (Any valid role)
- **Response**: Returns `req.user` with attached `profileId`, `patientId`, or `doctorId`.

### 1.3 Get Full Profile (`/api/auth/profile`)
- **Endpoint**: `GET /api/auth/profile`
- **Auth Required**: Yes (Any valid role)
- **Response**: Returns complete profile with department, specialization, and role details.

### 1.4 Register Patient Account
- **Endpoint**: `POST /api/auth/register`
- **Auth Required**: No (Public)
- **Request Body**:
  ```json
  {
    "fullName": "George Washington",
    "email": "george@carepoint.com",
    "phone": "+1 (555) 998-1122",
    "gender": "Male",
    "dateOfBirth": "1990-04-12",
    "bloodGroup": "O+",
    "emergencyContact": "Martha Washington (+1 555-998-1123)",
    "address": "100 Presidential Way"
  }
  ```

---

## 2. Departments (`/api/departments`)

| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `GET` | `/api/departments` | Public / All | Retrieve list of active departments |
| `GET` | `/api/departments/:id` | Public / All | Get department details by ID |
| `POST` | `/api/departments` | `Administrator` | Create a new hospital clinical department |
| `PUT` | `/api/departments/:id` | `Administrator` | Update department information |
| `DELETE` | `/api/departments/:id` | `Administrator` | Deactivate/delete department |

---

## 3. Doctors & Availability (`/api/doctors` & `/api/doctor-availability`)

| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `GET` | `/api/doctors` | Public / All | Retrieve doctor directory with department & qualifications |
| `GET` | `/api/doctors/:id` | Public / All | Retrieve doctor profile by ID |
| `GET` | `/api/doctors/:id/availability` | Public / All | Get doctor's working days, hours, and available booking slots |
| `POST` | `/api/doctors` | `Administrator` | Register doctor staff account and professional credentials |
| `PUT` | `/api/doctors/:id` | `Administrator`, `Doctor` | Update doctor profile / consultation settings |
| `PUT` | `/api/doctor-availability/:doctorId` | `Administrator`, `Doctor` | Update weekly consultation schedule |

---

## 4. Patients (`/api/patients`)

| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `GET` | `/api/patients` | `Admin`, `Doctor`, `Receptionist`, `Lab Tech`, `Pharmacist` | List registered patients |
| `GET` | `/api/patients/:id` | Staff or Self (`Patient`) | Get patient demographic & clinical profile |
| `POST` | `/api/patients` | `Administrator`, `Receptionist` | Register new patient at reception |
| `PUT` | `/api/patients/:id` | Staff or Self (`Patient`) | Update contact/emergency information |
| `GET` | `/api/patients/:id/appointments` | Staff or Self (`Patient`) | Get appointments for patient |
| `GET` | `/api/patients/:id/prescriptions` | Staff or Self (`Patient`) | Get prescriptions for patient |
| `GET` | `/api/patients/:id/lab-reports` | Staff or Self (`Patient`) | Get laboratory reports for patient |
| `GET` | `/api/patients/:id/bills` | Staff or Self (`Patient`) | Get billing history for patient |

---

## 5. Appointments (`/api/appointments`)

| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `GET` | `/api/appointments` | Authenticated | Retrieve appointments (filtered by role or query params) |
| `GET` | `/api/appointments/:id` | Authenticated | Get appointment details by ID |
| `POST` | `/api/appointments` | `Patient`, `Receptionist`, `Admin` | Book new appointment slot |
| `PATCH` | `/api/appointments/:id/status` | `Doctor`, `Receptionist`, `Admin` | Update status (`Scheduled`, `In Consultation`, `Completed`, `Cancelled`, `No Show`) |
| `PATCH` | `/api/appointments/:id/reschedule` | `Patient`, `Doctor`, `Receptionist`, `Admin` | Reschedule appointment date and time |
| `PATCH` | `/api/appointments/:id/cancel` | `Patient`, `Doctor`, `Receptionist`, `Admin` | Cancel appointment with reason |

---

## 6. Medical Records & Consultations (`/api/medical-records`)

| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `GET` | `/api/medical-records` | `Doctor`, `Admin`, Self (`Patient`) | Retrieve consultation history |
| `GET` | `/api/medical-records/patient/:patientId` | `Doctor`, `Admin`, Self (`Patient`) | Get comprehensive medical history of a patient |
| `POST` | `/api/medical-records` | `Doctor`, `Administrator` | Create consultation notes, vitals, diagnosis, and plan |
| `PUT` | `/api/medical-records/:id` | `Doctor`, `Administrator` | Update consultation clinical notes |

---

## 7. Prescriptions (`/api/prescriptions`)

| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `GET` | `/api/prescriptions` | `Doctor`, `Pharmacist`, `Admin`, `Patient` | List prescriptions |
| `GET` | `/api/prescriptions/:id` | `Doctor`, `Pharmacist`, `Admin`, `Patient` | Get prescription details with items |
| `POST` | `/api/prescriptions` | `Doctor`, `Administrator` | Create prescription with medication dosage & instructions |
| `PATCH` | `/api/prescriptions/:id/dispense` | `Pharmacist`, `Administrator` | Dispense medications and automatically deduct pharmacy stock |

---

## 8. Medicines & Pharmacy Inventory (`/api/medicines`)

| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `GET` | `/api/medicines` | `Pharmacist`, `Admin`, `Doctor` | Retrieve pharmacy medicine stock & catalog |
| `GET` | `/api/medicines/low-stock` | `Pharmacist`, `Administrator` | Get low stock (< threshold) and expired medicine alerts |
| `GET` | `/api/medicines/:id` | `Pharmacist`, `Administrator` | Get medicine details by ID |
| `POST` | `/api/medicines` | `Pharmacist`, `Administrator` | Add new medicine batch to pharmacy stock |
| `PUT` | `/api/medicines/:id` | `Pharmacist`, `Administrator` | Update medicine pricing, threshold, or details |
| `PATCH` | `/api/medicines/:id/stock` | `Pharmacist`, `Administrator` | Adjust stock count (`operation: 'add' | 'subtract'`) |

---

## 9. Laboratory Tests & Reports (`/api/lab-tests` & `/api/lab-reports`)

| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `GET` | `/api/lab-tests/tests` | `Lab Tech`, `Doctor`, `Admin`, `Patient` | List lab test orders |
| `POST` | `/api/lab-tests/tests` | `Doctor`, `Administrator` | Order laboratory diagnostic test |
| `PATCH` | `/api/lab-tests/tests/:id/start` | `Lab Tech`, `Administrator` | Mark lab test status as `In Progress` |
| `GET` | `/api/lab-reports/reports` | `Lab Tech`, `Doctor`, `Admin`, `Patient` | List completed pathology reports |
| `POST` | `/api/lab-reports/reports` | `Lab Tech`, `Administrator` | Submit completed test report with parameters & remarks |

---

## 10. Billing & Invoices (`/api/bills`)

| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `GET` | `/api/bills` | `Receptionist`, `Admin`, Self (`Patient`) | Retrieve invoices |
| `GET` | `/api/bills/:id` | `Receptionist`, `Admin`, Self (`Patient`) | Get itemized invoice details |
| `POST` | `/api/bills` | `Receptionist`, `Administrator` | Generate itemized patient bill |
| `PATCH` | `/api/bills/:id/status` | `Receptionist`, `Administrator` | Settle invoice payment (`status: 'Paid'`) |

---

## 11. Notifications (`/api/notifications`)

| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `GET` | `/api/notifications` | Authenticated | Retrieve notifications for current user/role |
| `PATCH` | `/api/notifications/:id/read` | Authenticated | Mark notification as read |
| `PATCH` | `/api/notifications/read-all` | Authenticated | Mark all notifications as read |

---

## 12. Settings & Audit Logs (`/api/settings`)

| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `GET` | `/api/settings` | Public / All | Get hospital name, emergency contact, license |
| `PUT` | `/api/settings` | `Administrator` | Update hospital configuration |
| `GET` | `/api/settings/activity-logs` | `Administrator` | Retrieve hospital operational activity audit trail |

---

## 13. Health Check (`/api/health`)
- **Endpoint**: `GET /api/health`
- **Auth Required**: No (Public)
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "CarePoint HMS Backend API is running smoothly",
    "timestamp": "2026-09-29T23:00:00.000Z",
    "version": "1.0.0"
  }
  ```
