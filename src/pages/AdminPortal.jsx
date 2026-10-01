import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../context/HospitalContext';
import {
  DashboardLayout,
  PageHeader,
  DataTable,
  StatusBadge,
  SearchFilterBar,
  Modal,
  ConfirmDialog,
  PrintableDocumentModal,
  OperationalCard
} from '../components/CommonComponents';
import {
  Shield,
  Users,
  Stethoscope,
  UserCheck,
  Pill,
  FlaskConical,
  Building2,
  Calendar,
  Receipt,
  Settings,
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Printer,
  Eye,
  Activity,
  Check,
  X,
  Power
} from 'lucide-react';

export const AdminPortal = ({ view = 'dashboard' }) => {
  const {
    currentUser,
    settings,
    setSettings,
    users,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    departments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    patients,
    appointments,
    updateAppointmentStatus,
    medicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    labTests,
    labReports,
    bills,
    activityLogs,
    notifications
  } = useHospital();

  const navigate = useNavigate();

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'addUser', 'editUser', 'deleteUser', 'addDoc', 'addDept', 'editDept', 'deleteDept', 'addMed', 'printBill', 'viewUser'
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // User Form
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'Doctor',
    phone: '',
    department: 'Cardiology',
    specialization: '',
    qualification: '',
    status: 'Active'
  });

  // Department Form
  const [deptForm, setDeptForm] = useState({
    name: '',
    code: '',
    headDoctor: 'Dr. Sarah Jenkins',
    description: '',
    doctorsCount: 3
  });

  // Settings Form
  const [settingsForm, setSettingsForm] = useState({ ...settings });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Save User
  const handleSaveUser = (e) => {
    e.preventDefault();
    if (activeModal === 'editUser' && selectedRecord) {
      updateUser(selectedRecord.id, userForm);
    } else {
      addUser(userForm);
    }
    setActiveModal(null);
  };

  // Save Department
  const handleSaveDepartment = (e) => {
    e.preventDefault();
    if (activeModal === 'editDept' && selectedRecord) {
      updateDepartment(selectedRecord.id, deptForm);
    } else {
      addDepartment(deptForm);
    }
    setActiveModal(null);
  };

  // 1. Admin Dashboard View (Strictly Operational - No Statistics)
  if (view === 'dashboard') {
    const activeDocs = users.filter(u => u.role === 'Doctor' && u.status === 'Active');
    const pendingAppts = appointments.filter(a => a.status === 'Scheduled');
    const pendingLabs = labTests.filter(t => t.status !== 'Completed');
    const unpaidBills = bills.filter(b => b.status === 'Unpaid');
    const lowStockMeds = medicines.filter(m => m.status !== 'Available');

    return (
      <DashboardLayout title="Hospital Administration">
        <PageHeader
          title="Hospital Operational Control Center"
          subtitle="CarePoint Hospital Enterprise Administration & Clinical Systems"
          actionButton={
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setUserForm({ name: '', email: '', role: 'Doctor', phone: '', department: 'Cardiology', specialization: '', qualification: '', status: 'Active' });
                  setActiveModal('addUser');
                }}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" /> Add System User
              </button>
            </div>
          }
        />

        {/* Operational Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <OperationalCard
            title="Active Hospital Staff"
            count={`${users.length} Users`}
            description="Administrators, Doctors & Clinical Staff"
            icon={Shield}
            color="red"
            actionLink="/admin/users"
            actionLabel="User Control"
          />
          <OperationalCard
            title="Scheduled OPD Consultations"
            count={`${pendingAppts.length} Booked`}
            description="Active patient queue across all OPDs"
            icon={Calendar}
            color="blue"
            actionLink="/admin/appointments"
            actionLabel="All Appointments"
          />
          <OperationalCard
            title="Pending Lab Requisitions"
            count={`${pendingLabs.length} Samples`}
            description="Awaiting processing in pathology lab"
            icon={FlaskConical}
            color="purple"
            actionLink="/admin/lab-tests"
            actionLabel="Lab Workload"
          />
          <OperationalCard
            title="Inventory Warnings"
            count={`${lowStockMeds.length} Items`}
            description="Low stock or expired medications"
            icon={AlertTriangle}
            color="amber"
            actionLink="/admin/medicines"
            actionLabel="Formulary Stock"
          />
        </div>

        {/* Split Operational Control Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Recent Activity Feed & Today's Appointments */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-rose-600" /> Today's Scheduled Appointments
                </h3>
                <span className="text-xs bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded border border-rose-200">
                  {pendingAppts.length} Scheduled
                </span>
              </div>

              <div className="mt-3 divide-y divide-slate-100 text-xs">
                {pendingAppts.slice(0, 4).map((appt) => (
                  <div key={appt.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{appt.patientName} &bull; <span className="font-normal text-slate-500">{appt.doctorName} ({appt.department})</span></div>
                      <div className="text-slate-400 text-[11px]">{appt.date} at {appt.time} &bull; {appt.reason}</div>
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Log Stream */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" /> Hospital Operational Activity Audit
              </h3>
              <div className="mt-3 space-y-2.5 text-xs">
                {activityLogs.slice(0, 6).map((log) => (
                  <div key={log.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{log.action} &bull; <span className="font-normal text-slate-500">{log.user}</span></div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{log.details}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Low Stock & Unpaid Invoices */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-amber-600" /> Pending Hospital Invoices
                </h3>
                <span className="text-xs text-rose-600 font-semibold">{unpaidBills.length} Unpaid</span>
              </div>

              <div className="mt-3 space-y-2.5 text-xs">
                {unpaidBills.slice(0, 3).map((bill) => (
                  <div key={bill.id} className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/70 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{bill.patientName}</div>
                      <div className="text-[11px] text-slate-500">{bill.id} &bull; {bill.date}</div>
                    </div>
                    <div className="font-bold text-rose-600">${Number(bill.totalAmount).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-rose-600" /> Formulary Stock Watch
                </h3>
                <span className="text-xs text-rose-600 font-semibold">{lowStockMeds.length} Alerts</span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                {lowStockMeds.map((med) => (
                  <div key={med.id} className="p-2.5 bg-rose-50/50 rounded-lg border border-rose-200/60 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{med.name}</div>
                      <div className="text-[11px] text-slate-500">Stock: <strong>{med.stock} {med.unit}</strong></div>
                    </div>
                    <StatusBadge status={med.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {renderAdminModals()}
      </DashboardLayout>
    );
  }

  // 2. User Management (All Roles)
  if (view === 'users' || view === 'doctors' || view === 'patients' || view === 'receptionists' || view === 'pharmacists' || view === 'lab-techs') {
    let filteredUsers = users.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = roleFilter ? u.role === roleFilter : true;
      const matchStatus = statusFilter ? u.status === statusFilter : true;
      return matchSearch && matchRole && matchStatus;
    });

    if (view === 'doctors') filteredUsers = filteredUsers.filter(u => u.role === 'Doctor');
    if (view === 'patients') filteredUsers = filteredUsers.filter(u => u.role === 'Patient');
    if (view === 'receptionists') filteredUsers = filteredUsers.filter(u => u.role === 'Receptionist');
    if (view === 'pharmacists') filteredUsers = filteredUsers.filter(u => u.role === 'Pharmacist');
    if (view === 'lab-techs') filteredUsers = filteredUsers.filter(u => u.role === 'Lab Technician');

    const columns = [
      { header: 'User ID', accessor: 'id', cellClassName: 'font-semibold text-slate-900 font-mono' },
      {
        header: 'User Name',
        accessor: 'name',
        render: (row) => (
          <div className="flex items-center gap-2.5">
            <img src={row.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} alt="" className="w-7 h-7 rounded-full object-cover border" />
            <div>
              <div className="font-semibold text-slate-900">{row.name}</div>
              <div className="text-[11px] text-slate-400">{row.email}</div>
            </div>
          </div>
        )
      },
      { header: 'Role', accessor: 'role', render: (row) => <span className="font-semibold text-slate-800">{row.role}</span> },
      { header: 'Department', accessor: 'department' },
      { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
      {
        header: 'Admin Actions',
        render: (row) => (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleUserStatus(row.id)}
              className={`p-1.5 rounded-lg transition ${
                row.status === 'Active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
              }`}
              title={row.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
            >
              <Power className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSelectedRecord(row);
                setUserForm({ ...row });
                setActiveModal('editUser');
              }}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
              title="Edit User"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setSelectedRecord(row); setActiveModal('deleteUser'); }}
              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
              title="Delete User"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )
      }
    ];

    return (
      <DashboardLayout title="Hospital Staff & User Management">
        <PageHeader
          title={view === 'users' ? 'System Users Registry' : `${view.charAt(0).toUpperCase() + view.slice(1)} Management`}
          subtitle="Provision staff accounts, assign departmental roles, and manage system privileges"
          actionButton={
            <button
              onClick={() => {
                setUserForm({
                  name: '',
                  email: '',
                  role: view === 'doctors' ? 'Doctor' : (view === 'receptionists' ? 'Receptionist' : (view === 'pharmacists' ? 'Pharmacist' : (view === 'lab-techs' ? 'Lab Technician' : 'Doctor'))),
                  phone: '',
                  department: 'Cardiology',
                  specialization: '',
                  qualification: '',
                  status: 'Active'
                });
                setActiveModal('addUser');
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add User Account
            </button>
          }
        />

        <SearchFilterBar
          searchPlaceholder="Search by name, email, or user ID..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filters={view === 'users' ? [
            {
              key: 'role',
              label: 'Role',
              options: [
                { label: 'Administrator', value: 'Administrator' },
                { label: 'Doctor', value: 'Doctor' },
                { label: 'Receptionist', value: 'Receptionist' },
                { label: 'Pharmacist', value: 'Pharmacist' },
                { label: 'Lab Technician', value: 'Lab Technician' },
                { label: 'Patient', value: 'Patient' }
              ]
            },
            {
              key: 'status',
              label: 'Status',
              options: [
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' }
              ]
            }
          ] : [
            {
              key: 'status',
              label: 'Status',
              options: [
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' }
              ]
            }
          ]}
          selectedFilters={{ role: roleFilter, status: statusFilter }}
          onFilterChange={(key, val) => {
            if (key === 'role') setRoleFilter(val);
            if (key === 'status') setStatusFilter(val);
          }}
          onReset={() => { setSearchTerm(''); setRoleFilter(''); setStatusFilter(''); }}
        />

        <DataTable columns={columns} data={filteredUsers} emptyMessage="No users found." />
        {renderAdminModals()}
      </DashboardLayout>
    );
  }

  // 3. Department Management
  if (view === 'departments') {
    const columns = [
      { header: 'Dept ID', accessor: 'id', cellClassName: 'font-semibold text-slate-900 font-mono' },
      { header: 'Department Name', accessor: 'name', cellClassName: 'font-semibold text-slate-900' },
      { header: 'Department Head', accessor: 'headDoctor' },
      { header: 'Assigned Doctors', render: (row) => `${row.doctorsCount || 3} Specialists` },
      { header: 'Description', accessor: 'description', className: 'max-w-xs truncate' },
      {
        header: 'Actions',
        render: (row) => (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setSelectedRecord(row);
                setDeptForm({ ...row });
                setActiveModal('editDept');
              }}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
              title="Edit Department"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setSelectedRecord(row); setActiveModal('deleteDept'); }}
              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
              title="Delete Department"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )
      }
    ];

    return (
      <DashboardLayout title="Clinical Departments Management">
        <PageHeader
          title="Hospital Medical Departments"
          subtitle="Configure clinical specialties, appoint department heads, and manage faculty"
          actionButton={
            <button
              onClick={() => {
                setDeptForm({ name: '', code: '', headDoctor: 'Dr. Sarah Jenkins', description: '', doctorsCount: 3 });
                setActiveModal('addDept');
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add Department
            </button>
          }
        />
        <DataTable columns={columns} data={departments} emptyMessage="No departments found." />
        {renderAdminModals()}
      </DashboardLayout>
    );
  }

  // 4. Global Appointments Overview
  if (view === 'appointments') {
    const columns = [
      { header: 'Appt ID', accessor: 'id', cellClassName: 'font-semibold text-slate-900 font-mono' },
      { header: 'Patient', accessor: 'patientName' },
      { header: 'Doctor', accessor: 'doctorName' },
      { header: 'Department', accessor: 'department' },
      { header: 'Date & Time', render: (row) => `${row.date} at ${row.time}` },
      { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
      {
        header: 'Actions',
        render: (row) => (
          <button
            onClick={() => updateAppointmentStatus(row.id, row.status === 'Scheduled' ? 'Completed' : 'Scheduled')}
            className="px-2 py-1 text-xs border rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
          >
            Toggle Status
          </button>
        )
      }
    ];

    return (
      <DashboardLayout title="Global Appointments Roster">
        <PageHeader
          title="Hospital Appointments Registry"
          subtitle="Comprehensive overview of all patient consultations across hospital departments"
        />
        <DataTable columns={columns} data={appointments} emptyMessage="No appointments found." />
      </DashboardLayout>
    );
  }

  // 5. Global Medicines Management
  if (view === 'medicines') {
    const columns = [
      { header: 'Medicine ID', accessor: 'id', cellClassName: 'font-semibold text-slate-900 font-mono' },
      { header: 'Name', accessor: 'name', cellClassName: 'font-medium text-slate-900' },
      { header: 'Category', accessor: 'category' },
      { header: 'Stock Level', render: (row) => `${row.stock} ${row.unit}` },
      { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
      {
        header: 'Actions',
        render: (row) => (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setSelectedRecord(row); setDeptForm({ ...row }); setActiveModal('editMed'); }}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteMedicine(row.id)}
              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )
      }
    ];

    return (
      <DashboardLayout title="Formulary & Pharmacy Stock Management">
        <PageHeader title="Medicines Master Inventory" subtitle="Hospital central pharmacy inventory and stock replenishment" />
        <DataTable columns={columns} data={medicines} emptyMessage="No medicines found." />
      </DashboardLayout>
    );
  }

  // 6. Global Lab Tests Management
  if (view === 'lab-tests') {
    const columns = [
      { header: 'Test ID', accessor: 'id', cellClassName: 'font-semibold text-slate-900 font-mono' },
      { header: 'Investigation', accessor: 'testName', cellClassName: 'font-medium text-slate-900' },
      { header: 'Patient', accessor: 'patientName' },
      { header: 'Doctor', accessor: 'doctorName' },
      { header: 'Priority', accessor: 'priority', render: (row) => <StatusBadge status={row.priority} /> },
      { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> }
    ];

    return (
      <DashboardLayout title="Diagnostic Laboratory Workload">
        <PageHeader title="Laboratory Tests Registry" subtitle="Global pathology and biochemistry tests monitoring" />
        <DataTable columns={columns} data={labTests} emptyMessage="No lab tests found." />
      </DashboardLayout>
    );
  }

  // 7. Global Billing Management
  if (view === 'billing') {
    const columns = [
      { header: 'Invoice #', accessor: 'id', cellClassName: 'font-semibold text-slate-900 font-mono' },
      { header: 'Patient Name', accessor: 'patientName', cellClassName: 'font-medium text-slate-900' },
      { header: 'Date', accessor: 'date' },
      { header: 'Total Amount', render: (row) => <span className="font-bold text-slate-900">${Number(row.totalAmount).toFixed(2)}</span> },
      { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
      {
        header: 'Actions',
        render: (row) => (
          <button
            onClick={() => { setSelectedRecord(row); setActiveModal('printBill'); }}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
            title="Print Invoice"
          >
            <Printer className="w-4 h-4" />
          </button>
        )
      }
    ];

    return (
      <DashboardLayout title="Hospital Financial & Billing Records">
        <PageHeader title="Invoices & Billing Statement" subtitle="Hospital revenue accounts and patient payment receipts" />
        <DataTable columns={columns} data={bills} emptyMessage="No bills found." />
        {renderAdminModals()}
      </DashboardLayout>
    );
  }

  // 8. System Settings
  if (view === 'settings') {
    return (
      <DashboardLayout title="System Configurations & Settings">
        <PageHeader
          title="Hospital System Settings"
          subtitle="Hospital branding, legal licenses, emergency contacts, and working hours"
        />

        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs text-xs">
          {settingsSaved && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Hospital settings updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Hospital Official Name *</label>
                <input
                  type="text"
                  required
                  value={settingsForm.hospitalName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, hospitalName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tagline / Mission Motto</label>
                <input
                  type="text"
                  value={settingsForm.tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Hospital Email *</label>
                <input
                  type="email"
                  required
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">General Phone *</label>
                <input
                  type="text"
                  required
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">24/7 Emergency Dispatch Phone *</label>
                <input
                  type="text"
                  required
                  value={settingsForm.emergencyPhone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, emergencyPhone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Clinical License Number</label>
                <input
                  type="text"
                  value={settingsForm.licenseNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, licenseNumber: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Physical Campus Address *</label>
              <input
                type="text"
                required
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">OPD & Casualty Working Hours</label>
              <input
                type="text"
                value={settingsForm.workingHours}
                onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div className="flex justify-end pt-3 border-t">
              <button
                type="submit"
                className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-xs"
              >
                Save System Settings
              </button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    );
  }

  // 9. Profile & Notifications
  return (
    <DashboardLayout title="System Administrator Profile">
      <PageHeader title="Administrator Credentials" subtitle="Hospital enterprise root user privileges" />
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl border border-slate-200 text-xs space-y-3">
        <div className="font-bold text-sm text-slate-900">{currentUser?.name || 'Dr. Arthur Vance'}</div>
        <div className="text-slate-500">Role: Chief Medical Officer / Hospital Administrator</div>
        <div className="text-slate-500">Department: Enterprise Governance</div>
        <div className="text-slate-500">Email: {currentUser?.email || 'admin@carepoint.com'}</div>
      </div>
      {renderAdminModals()}
    </DashboardLayout>
  );

  // Helper modals
  function renderAdminModals() {
    return (
      <>
        {/* Add / Edit User Modal */}
        <Modal
          isOpen={activeModal === 'addUser' || activeModal === 'editUser'}
          onClose={() => setActiveModal(null)}
          title={activeModal === 'editUser' ? `Edit User: ${selectedRecord?.name}` : 'Create New System User'}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">System Role *</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Lab Technician">Lab Technician</option>
                  <option value="Patient">Patient</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Department</label>
                <select
                  value={userForm.department}
                  onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                  <option value="Hospital Administration">Hospital Administration</option>
                  <option value="Front Desk & Patient Services">Front Desk & Patient Services</option>
                  <option value="Central Pharmacy">Central Pharmacy</option>
                  <option value="Diagnostic Pathology & Biochemistry">Diagnostic Pathology & Biochemistry</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Phone</label>
                <input
                  type="tel"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Status</label>
                <select
                  value={userForm.status}
                  onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setActiveModal(null)} className="px-3 py-1.5 border rounded-lg">Cancel</button>
              <button type="submit" className="px-5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg">
                Save User Account
              </button>
            </div>
          </form>
        </Modal>

        {/* Add / Edit Department Modal */}
        <Modal
          isOpen={activeModal === 'addDept' || activeModal === 'editDept'}
          onClose={() => setActiveModal(null)}
          title={activeModal === 'editDept' ? `Edit Department: ${selectedRecord?.name}` : 'Add Medical Department'}
        >
          <form onSubmit={handleSaveDepartment} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Department Name *</label>
              <input
                type="text"
                required
                value={deptForm.name}
                onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Department Head Doctor *</label>
              <input
                type="text"
                required
                value={deptForm.headDoctor}
                onChange={(e) => setDeptForm({ ...deptForm, headDoctor: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Clinical Description</label>
              <textarea
                rows={3}
                value={deptForm.description}
                onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setActiveModal(null)} className="px-3 py-1.5 border rounded-lg">Cancel</button>
              <button type="submit" className="px-5 py-1.5 bg-rose-600 text-white font-semibold rounded-lg">
                Save Department
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete User Dialog */}
        <ConfirmDialog
          isOpen={activeModal === 'deleteUser'}
          onClose={() => setActiveModal(null)}
          onConfirm={() => {
            if (selectedRecord) deleteUser(selectedRecord.id);
          }}
          title="Delete System User Account?"
          message={`Are you sure you want to permanently remove ${selectedRecord?.name} (${selectedRecord?.role})?`}
          confirmText="Yes, Delete User"
        />

        {/* Delete Dept Dialog */}
        <ConfirmDialog
          isOpen={activeModal === 'deleteDept'}
          onClose={() => setActiveModal(null)}
          onConfirm={() => {
            if (selectedRecord) deleteDepartment(selectedRecord.id);
          }}
          title="Delete Medical Department?"
          message={`Are you sure you want to delete ${selectedRecord?.name}?`}
          confirmText="Yes, Delete Department"
        />

        {/* Printable Bill */}
        <PrintableDocumentModal
          isOpen={activeModal === 'printBill'}
          onClose={() => setActiveModal(null)}
          title="Hospital Service Invoice"
          documentData={selectedRecord}
          type="bill"
        />
      </>
    );
  }
};
