# CarePoint Hospital Management System (HMS) - Backend

Node.js, Express.js, and Supabase PostgreSQL backend API for the CarePoint Hospital Management System.

## 🏛️ System Architecture

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth (JWT-based token resolution)
- **Storage**: Supabase Storage (medical records, pathology reports, prescription attachments)
- **Security**: PostgreSQL Row Level Security (RLS) + Express Role-Based Guard Middleware

---

## 📂 Project Structure

```
backend/
├── database/
│   ├── schema.sql           # PostgreSQL DDL for 15 normalized tables & constraints
│   ├── rls.sql              # Row Level Security policies for 6 roles
│   └── seed.sql             # Relational, deterministic seed data
├── src/
│   ├── config/
│   │   └── config.js        # Environment configuration
│   ├── controllers/         # Request handling & HTTP status responses
│   │   ├── authController.js
│   │   ├── departmentController.js
│   │   ├── doctorController.js
│   │   ├── doctorAvailabilityController.js
│   │   ├── patientController.js
│   │   ├── appointmentController.js
│   │   ├── medicalRecordController.js
│   │   ├── prescriptionController.js
│   │   ├── medicineController.js
│   │   ├── labController.js
│   │   ├── billingController.js
│   │   ├── notificationController.js
│   │   ├── profileController.js
│   │   └── settingsController.js
│   ├── lib/
│   │   ├── supabase.js      # Supabase Client configuration
│   │   └── db.js            # Relational database abstraction layer
│   ├── middleware/
│   │   ├── authMiddleware.js # Supabase JWT validation & profile identity resolution
│   │   ├── roleMiddleware.js # Role-based authorization & resource ownership guards
│   │   └── errorMiddleware.js# Centralized error handler & 404 handler
│   ├── routes/              # Modular REST API endpoints
│   │   ├── authRoutes.js
│   │   ├── departmentRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── doctorAvailabilityRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── medicalRecordRoutes.js
│   │   ├── prescriptionRoutes.js
│   │   ├── medicineRoutes.js
│   │   ├── labRoutes.js
│   │   ├── billingRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── settingsRoutes.js
│   │   └── index.js         # API aggregator & /api/health endpoint
│   ├── services/            # Pure hospital business logic
│   ├── utils/               # Response formatters and ID generators
│   ├── validators/          # Input schema validation middleware
│   ├── app.js               # Express application configuration
│   └── server.js            # Server entry point
├── tests/
│   └── run-tests.js         # Automated end-to-end test suite (30 core workflow tests)
├── .env.example             # Template for environment variables
├── API_DOCUMENTATION.md     # Full REST API endpoint reference
└── package.json
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your `.env` settings:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Supabase Credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 3. Apply Supabase Database Migrations
In your Supabase project's **SQL Editor**, execute the scripts in this order:
1. `backend/database/schema.sql` (Creates custom types, tables, foreign keys, timestamps, indexes)
2. `backend/database/rls.sql` (Enables Row Level Security policies for Administrator, Doctor, Receptionist, Pharmacist, Lab Technician, Patient)
3. `backend/database/seed.sql` (Inserts deterministic test data for all departments, staff, patients, inventory, appointments, and bills)

### 4. Run the Backend Server
```bash
npm run dev
# Server starts on http://localhost:5000
```

### 5. Run the Automated Test Suite
```bash
npm test
# Runs the 30-test suite verifying all 14 hospital workflows
```

---

## 👥 Default Deterministic Test Accounts

| Role | Name | Email | Password |
|---|---|---|---|
| **Administrator** | Dr. Arthur Vance | `admin@carepoint.com` | `password123` |
| **Doctor (Cardiology)** | Dr. Sarah Jenkins | `doctor@carepoint.com` | `password123` |
| **Doctor (Neurology)** | Dr. Michael Chen | `chen@carepoint.com` | `password123` |
| **Receptionist** | Rachel Cooper | `reception@carepoint.com` | `password123` |
| **Pharmacist** | James Wilson | `pharmacy@carepoint.com` | `password123` |
| **Lab Technician** | Dr. Priya Sharma | `lab@carepoint.com` | `password123` |
| **Patient** | Johnathan Doe | `patient@carepoint.com` | `password123` |
| **Patient** | Emily Watson | `emily.watson@gmail.com` | `password123` |

---

## 🔒 Security Architecture
1. **Supabase Auth Identity Linking**: Authenticated JWT UUIDs map to `profiles` and role records (`doctors`, `patients`, etc.). Random identities are never displayed.
2. **Server-Side Credentials**: Sensitive Supabase Service Role keys remain strictly on the backend.
3. **Double-Layer Authorization**: Protected by Express `authenticate` + `requireRole` middleware as well as PostgreSQL Row Level Security (RLS).
