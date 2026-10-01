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
  Calendar,
  CalendarPlus,
  Users,
  UserPlus,
  Stethoscope,
  Receipt,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Printer,
  ChevronRight,
  Search,
  Plus
} from 'lucide-react';

export const ReceptionistPortal = ({ view = 'dashboard' }) => {
  const {
    currentUser,
    patients,
    addPatient,
    updatePatient,
    appointments,
    addAppointment,
    updateAppointmentStatus,
    rescheduleAppointment,
    departments,
    users,
    bills,
    createBill,
    markBillPaid,
    cancelBill,
    activityLogs
  } = useHospital();

  const navigate = useNavigate();
  const doctors = users.filter(u => u.role === 'Doctor' && u.status === 'Active');

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'createAppt', 'rescheduleAppt', 'cancelAppt', 'createBill', 'payBill', 'printBill', 'editPatient', 'viewPatient'
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  // Patient Registration Form State
  const [patientForm, setPatientForm] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '',
    emergencyContact: '',
    allergies: ''
  });
  const [regSuccessMessage, setRegSuccessMessage] = useState('');

  // Appointment Form State
  const [apptForm, setApptForm] = useState({
    patientId: 'PAT-1001',
    patientName: 'Johnathan Doe',
    department: 'Cardiology',
    doctorId: 'USR-002',
    doctorName: 'Dr. Sarah Jenkins',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    reason: 'Front Desk Walk-in Consultation',
    type: 'Walk-in / In-Person'
  });

  // Reschedule State
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' });

  // Bill Creation Form State
  const [billForm, setBillForm] = useState({
    patientId: 'PAT-1001',
    patientName: 'Johnathan Doe',
    patientPhone: '+1 (555) 019-1100',
    items: [
      { description: 'Specialist Consultation Fee', department: 'General', amount: 80.00 }
    ],
    discount: 0,
    status: 'Unpaid'
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // Handle Patient Registration
  const handleRegisterPatient = (e) => {
    e.preventDefault();
    const newPat = addPatient(patientForm);
    setRegSuccessMessage(`Patient successfully registered! Generated Medical Record ID: ${newPat.id}`);
    setPatientForm({
      name: '',
      email: '',
      phone: '',
      dob: '',
      gender: 'Male',
      bloodGroup: 'O+',
      address: '',
      emergencyContact: '',
      allergies: ''
    });
  };

  // Handle Appointment Booking
  const handleCreateAppointment = (e) => {
    e.preventDefault();
    const doc = users.find(u => u.id === apptForm.doctorId) || { name: 'Dr. Sarah Jenkins', department: 'Cardiology' };
    const pat = patients.find(p => p.id === apptForm.patientId) || { name: 'Patient', phone: '' };

    addAppointment({
      patientId: pat.id,
      patientName: pat.name,
      patientPhone: pat.phone,
      doctorId: apptForm.doctorId,
      doctorName: doc.name,
      department: apptForm.department,
      date: apptForm.date,
      time: apptForm.time,
      reason: apptForm.reason,
      type: apptForm.type,
      roomNo: doc.roomNo || 'OPD Room 204'
    });

    setActiveModal(null);
    alert(`Appointment successfully created for ${pat.name}!`);
  };

  // Handle Bill Creation
  const handleSaveBill = (e) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === billForm.patientId) || patients[0];
    createBill({
      patientId: pat.id,
      patientName: pat.name,
      patientPhone: pat.phone,
      items: billForm.items,
      discount: Number(billForm.discount || 0),
      status: billForm.status
    });
    setActiveModal(null);
  };

  const handleAddBillItem = () => {
    setBillForm({
      ...billForm,
      items: [
        ...billForm.items,
        { description: 'Laboratory Routine Panel', department: 'Laboratory', amount: 45.00 }
      ]
    });
  };

  const handleRemoveBillItem = (index) => {
    setBillForm({
      ...billForm,
      items: billForm.items.filter((_, i) => i !== index)
    });
  };

  // 1. Receptionist Dashboard View (Strictly Operational - No Statistics)
  if (view === 'dashboard') {
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysAppts = appointments.filter(a => a.status === 'Scheduled');
    const unpaidBills = bills.filter(b => b.status === 'Unpaid');

    return (
      <DashboardLayout title="Receptionist Front Desk Portal">
        <PageHeader
          title="Front Desk & Patient Management"
          subtitle="CarePoint Patient Check-in, OPD Registration, and Counter Invoices"
          actionButton={
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/receptionist/register')}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <UserPlus className="w-4 h-4" /> Register Patient
              </button>
              <button
                onClick={() => setActiveModal('createAppt')}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <CalendarPlus className="w-4 h-4" /> Schedule Visit
              </button>
            </div>
          }
        />

        {/* Operational Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <OperationalCard
            title="Scheduled Appointments"
            count={`${todaysAppts.length} Pending`}
            description="Patients awaiting doctor consultation"
            icon={Calendar}
            color="red"
            actionLink="/receptionist/appointments"
            actionLabel="Manage Queue"
          />
          <OperationalCard
            title="Registered Patients"
            count={`${patients.length} Records`}
            description="Active patient database"
            icon={Users}
            color="blue"
            actionLink="/receptionist/patients"
            actionLabel="View Directory"
          />
          <OperationalCard
            title="Doctors On Duty"
            count={`${doctors.length} Specialists`}
            description="Available across 8 departments"
            icon={Stethoscope}
            color="emerald"
            actionLink="/receptionist/doctors"
            actionLabel="Doctor Timetable"
          />
          <OperationalCard
            title="Unpaid Counter Bills"
            count={`${unpaidBills.length} Invoices`}
            description="Awaiting patient counter settlement"
            icon={Receipt}
            color="amber"
            actionLink="/receptionist/billing"
            actionLabel="Billing Counter"
          />
        </div>

        {/* Operational Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Active Appointments & Patient Check-in */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-600" /> Active Appointments Queue
                </h3>
                <button
                  onClick={() => setActiveModal('createAppt')}
                  className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Book Walk-in
                </button>
              </div>

              <div className="mt-3 divide-y divide-slate-100 text-xs">
                {todaysAppts.slice(0, 4).map((appt) => (
                  <div key={appt.id} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{appt.patientName}</span>
                        <StatusBadge status={appt.status} />
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        {appt.doctorName} &bull; {appt.department} &bull; <strong>{appt.date} at {appt.time}</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateAppointmentStatus(appt.id, 'Completed')}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg"
                      >
                        Check-In
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRecord(appt);
                          setRescheduleData({ date: appt.date, time: appt.time });
                          setActiveModal('rescheduleAppt');
                        }}
                        className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 border rounded-lg"
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Patient Registrations */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-blue-600" /> Recent Patient Registrations
                </h3>
                <button onClick={() => navigate('/receptionist/register')} className="text-xs font-semibold text-rose-600 hover:underline">
                  + New Registration
                </button>
              </div>

              <div className="mt-3 divide-y divide-slate-100 text-xs">
                {patients.slice(0, 4).map((pat) => (
                  <div key={pat.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{pat.name} <span className="font-mono text-slate-400 font-normal">({pat.id})</span></div>
                      <div className="text-slate-500 text-[11px]">{pat.phone} &bull; Blood Group: <strong className="text-rose-600">{pat.bloodGroup}</strong></div>
                    </div>
                    <button
                      onClick={() => { setSelectedRecord(pat); setActiveModal('viewPatient'); }}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Unpaid Counter Invoices & Fast Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-amber-600" /> Pending Counter Settlements
                </h3>
                <button onClick={() => setActiveModal('createBill')} className="text-xs font-semibold text-emerald-600 hover:underline">
                  + Create Invoice
                </button>
              </div>

              <div className="mt-3 space-y-2.5 text-xs">
                {unpaidBills.length > 0 ? (
                  unpaidBills.map((bill) => (
                    <div key={bill.id} className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/70 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{bill.patientName}</div>
                        <div className="text-[11px] text-slate-500">{bill.id} &bull; {bill.date}</div>
                        <div className="font-bold text-rose-600 mt-0.5">${Number(bill.totalAmount).toFixed(2)}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => { setSelectedRecord(bill); setActiveModal('payBill'); }}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                        >
                          Settle
                        </button>
                        <button
                          onClick={() => { setSelectedRecord(bill); setActiveModal('printBill'); }}
                          className="p-1 text-slate-500 hover:bg-white rounded"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-xs text-slate-400">All invoices settled.</div>
                )}
              </div>
            </div>

            {/* Recent Audit Activities */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">Front Desk Activity Feed</h3>
              <div className="mt-3 space-y-2.5 text-xs">
                {activityLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="p-2 bg-slate-50 rounded border border-slate-100">
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>{log.action}</span>
                      <span className="text-[10px] text-slate-400">{log.time}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {renderReceptionistModals()}
      </DashboardLayout>
    );
  }

  // 2. Patient Registration Page
  if (view === 'register') {
    return (
      <DashboardLayout title="New Patient Registration">
        <PageHeader
          title="Patient OPD Registration"
          subtitle="Generate permanent hospital medical record ID and patient demographic file"
        />

        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs text-xs">
          {regSuccessMessage && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{regSuccessMessage}</span>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => navigate('/receptionist/patients')}
                  className="px-3 py-1.5 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800"
                >
                  View in Patient Directory
                </button>
                <button
                  onClick={() => setRegSuccessMessage('')}
                  className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 font-semibold rounded-lg"
                >
                  Register Another Patient
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleRegisterPatient} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={patientForm.name}
                  onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                  placeholder="e.g. Samuel Green"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={patientForm.email}
                  onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                  placeholder="samuel@example.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={patientForm.phone}
                  onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={patientForm.dob}
                  onChange={(e) => setPatientForm({ ...patientForm, dob: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                <select
                  value={patientForm.gender}
                  onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Blood Group *</label>
                <select
                  value={patientForm.bloodGroup}
                  onChange={(e) => setPatientForm({ ...patientForm, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Residential Address *</label>
              <input
                type="text"
                required
                value={patientForm.address}
                onChange={(e) => setPatientForm({ ...patientForm, address: e.target.value })}
                placeholder="Street address, apartment, city, state"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emergency Contact (Relation & Phone) *</label>
                <input
                  type="text"
                  required
                  value={patientForm.emergencyContact}
                  onChange={(e) => setPatientForm({ ...patientForm, emergencyContact: e.target.value })}
                  placeholder="e.g. Mary Green (Wife) - +1 555-019-2233"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Allergies / Special Alerts</label>
                <input
                  type="text"
                  value={patientForm.allergies}
                  onChange={(e) => setPatientForm({ ...patientForm, allergies: e.target.value })}
                  placeholder="e.g. Penicillin, Aspirin, None"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t">
              <button
                type="button"
                onClick={() => navigate('/receptionist/patients')}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-xs"
              >
                Complete Registration & Generate ID
              </button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    );
  }

  // 3. Patients Directory
  if (view === 'patients') {
    const filtered = patients.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
    );

    const columns = [
      { header: 'Patient ID', accessor: 'id', cellClassName: 'font-semibold text-slate-900 font-mono' },
      { header: 'Patient Name', accessor: 'name', cellClassName: 'font-medium text-slate-900' },
      { header: 'Gender / Age', render: (row) => `${row.gender} / ${row.age || 36} Yrs` },
      { header: 'Blood Group', render: (row) => <span className="font-bold text-rose-600">{row.bloodGroup}</span> },
      { header: 'Phone', accessor: 'phone' },
      { header: 'Emergency Contact', accessor: 'emergencyContact', className: 'max-w-xs truncate' },
      { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
      {
        header: 'Actions',
        render: (row) => (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setSelectedRecord(row); setActiveModal('viewPatient'); }}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              title="View File"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setApptForm({ ...apptForm, patientId: row.id, patientName: row.name });
                setActiveModal('createAppt');
              }}
              className="px-2.5 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg"
            >
              Book Appt
            </button>
          </div>
        )
      }
    ];

    return (
      <DashboardLayout title="Registered Hospital Patients">
        <PageHeader
          title="Patients Directory"
          subtitle="Search, review, and manage registered patient profiles and contacts"
          actionButton={
            <button
              onClick={() => navigate('/receptionist/register')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <UserPlus className="w-4 h-4" /> Register Patient
            </button>
          }
        />
        <SearchFilterBar
          searchPlaceholder="Search by patient name, ID, phone..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onReset={() => setSearchTerm('')}
        />
        <DataTable columns={columns} data={filtered} emptyMessage="No patients found." />
        {renderReceptionistModals()}
      </DashboardLayout>
    );
  }

  // 4. Appointments Management
  if (view === 'appointments') {
    const filtered = appointments.filter(a => {
      const matchSearch = a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter ? a.status === statusFilter : true;
      const matchDept = deptFilter ? a.department === deptFilter : true;
      return matchSearch && matchStatus && matchDept;
    });

    const columns = [
      { header: 'Appt ID', accessor: 'id', cellClassName: 'font-semibold text-slate-900' },
      { header: 'Patient', accessor: 'patientName' },
      { header: 'Doctor & Department', render: (row) => `${row.doctorName} (${row.department})` },
      { header: 'Date & Time', render: (row) => `${row.date} at ${row.time}` },
      { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
      {
        header: 'Front Desk Actions',
        render: (row) => (
          <div className="flex items-center gap-1.5">
            {row.status === 'Scheduled' && (
              <>
                <button
                  onClick={() => updateAppointmentStatus(row.id, 'Completed')}
                  className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg"
                >
                  Check-In
                </button>
                <button
                  onClick={() => {
                    setSelectedRecord(row);
                    setRescheduleData({ date: row.date, time: row.time });
                    setActiveModal('rescheduleAppt');
                  }}
                  className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 border rounded-lg"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => { setSelectedRecord(row); setActiveModal('cancelAppt'); }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                  title="Cancel"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            {row.status !== 'Scheduled' && (
              <span className="text-xs text-slate-400">Archived</span>
            )}
          </div>
        )
      }
    ];

    return (
      <DashboardLayout title="OPD Appointments Desk">
        <PageHeader
          title="Appointments Management"
          subtitle="Monitor patient queue, check-in arrivals, and handle rescheduling"
          actionButton={
            <button
              onClick={() => setActiveModal('createAppt')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <CalendarPlus className="w-4 h-4" /> Schedule Appointment
            </button>
          }
        />

        <SearchFilterBar
          searchPlaceholder="Search by patient, doctor, or ID..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: [
                { label: 'Scheduled', value: 'Scheduled' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Cancelled', value: 'Cancelled' }
              ]
            }
          ]}
          selectedFilters={{ status: statusFilter }}
          onFilterChange={(_, val) => setStatusFilter(val)}
          onReset={() => { setSearchTerm(''); setStatusFilter(''); }}
        />

        <DataTable columns={columns} data={filtered} emptyMessage="No appointments found." />
        {renderReceptionistModals()}
      </DashboardLayout>
    );
  }

  // 5. Doctor Availability Timetable
  if (view === 'doctors') {
    return (
      <DashboardLayout title="Doctor OPD Availability">
        <PageHeader
          title="Physician Availability & Roster"
          subtitle="Check active OPD rooms, working days, and consultation hours"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <img src={doc.avatar} alt={doc.name} className="w-12 h-12 rounded-xl object-cover border" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{doc.name}</h4>
                  <p className="text-rose-600 font-semibold">{doc.department}</p>
                  <p className="text-[11px] text-slate-500">{doc.specialization}</p>
                </div>
              </div>

              <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-slate-500">Room:</span>
                  <span className="font-bold text-slate-800">{doc.roomNo || 'OPD Room 204'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hours:</span>
                  <span className="font-medium text-slate-800">{doc.availableHours || '09:00 AM - 02:00 PM'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Days:</span>
                  <span className="font-medium text-slate-800">{doc.availableDays?.join(', ') || 'Mon - Fri'}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setApptForm({
                    ...apptForm,
                    department: doc.department,
                    doctorId: doc.id,
                    doctorName: doc.name
                  });
                  setActiveModal('createAppt');
                }}
                className="w-full py-2 text-center bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg border border-rose-200 transition"
              >
                Book Patient for {doc.name.split(' ')[1]}
              </button>
            </div>
          ))}
        </div>
        {renderReceptionistModals()}
      </DashboardLayout>
    );
  }

  // 6. Billing & Payments Desk
  if (view === 'billing') {
    const filtered = bills.filter(b => {
      const matchSearch = b.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter ? b.status === statusFilter : true;
      return matchSearch && matchStatus;
    });

    const columns = [
      { header: 'Invoice #', accessor: 'id', cellClassName: 'font-semibold text-slate-900 font-mono' },
      { header: 'Patient Name', accessor: 'patientName', cellClassName: 'font-medium text-slate-900' },
      { header: 'Date', accessor: 'date' },
      { header: 'Items Count', render: (row) => `${row.items?.length || 1} items` },
      { header: 'Total Due', render: (row) => <span className="font-bold text-slate-900">${Number(row.totalAmount).toFixed(2)}</span> },
      { header: 'Payment Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
      {
        header: 'Actions',
        render: (row) => (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setSelectedRecord(row); setActiveModal('printBill'); }}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            {row.status === 'Unpaid' && (
              <button
                onClick={() => { setSelectedRecord(row); setActiveModal('payBill'); }}
                className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
              >
                Collect Payment
              </button>
            )}
          </div>
        )
      }
    ];

    return (
      <DashboardLayout title="Hospital Billing & Cash Desk">
        <PageHeader
          title="Billing & Invoices Management"
          subtitle="Create patient invoices for OPD consultations, laboratory assays, and medicines"
          actionButton={
            <button
              onClick={() => setActiveModal('createBill')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Generate New Bill
            </button>
          }
        />

        <SearchFilterBar
          searchPlaceholder="Search by invoice # or patient name..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: [
                { label: 'Unpaid', value: 'Unpaid' },
                { label: 'Paid', value: 'Paid' },
                { label: 'Cancelled', value: 'Cancelled' }
              ]
            }
          ]}
          selectedFilters={{ status: statusFilter }}
          onFilterChange={(_, val) => setStatusFilter(val)}
          onReset={() => { setSearchTerm(''); setStatusFilter(''); }}
        />

        <DataTable columns={columns} data={filtered} emptyMessage="No billing records found." />
        {renderReceptionistModals()}
      </DashboardLayout>
    );
  }

  // 7. Profile
  return (
    <DashboardLayout title="Receptionist Staff Profile">
      <PageHeader title="Staff Profile" subtitle="Front desk workstation details" />
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl border border-slate-200 text-xs space-y-3">
        <div className="font-bold text-sm text-slate-900">{currentUser?.name || 'Rachel Cooper'}</div>
        <div className="text-slate-500">Role: Receptionist / Patient Coordinator</div>
        <div className="text-slate-500">Department: Front Desk & OPD Administration</div>
        <div className="text-slate-500">Email: {currentUser?.email || 'reception@carepoint.com'}</div>
      </div>
      {renderReceptionistModals()}
    </DashboardLayout>
  );

  // Helper to render modals
  function renderReceptionistModals() {
    return (
      <>
        {/* Create Appointment Modal */}
        <Modal
          isOpen={activeModal === 'createAppt'}
          onClose={() => setActiveModal(null)}
          title="Schedule Patient Consultation"
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleCreateAppointment} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Select Patient *</label>
                <select
                  value={apptForm.patientId}
                  onChange={(e) => {
                    const p = patients.find(pat => pat.id === e.target.value);
                    setApptForm({ ...apptForm, patientId: e.target.value, patientName: p?.name || 'Patient' });
                  }}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Department *</label>
                <select
                  value={apptForm.department}
                  onChange={(e) => {
                    const docs = users.filter(u => u.role === 'Doctor' && u.department === e.target.value);
                    setApptForm({
                      ...apptForm,
                      department: e.target.value,
                      doctorId: docs[0]?.id || 'USR-002',
                      doctorName: docs[0]?.name || 'Dr. Sarah Jenkins'
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Doctor *</label>
                <select
                  value={apptForm.doctorId}
                  onChange={(e) => {
                    const doc = users.find(u => u.id === e.target.value);
                    setApptForm({ ...apptForm, doctorId: e.target.value, doctorName: doc?.name || 'Doctor' });
                  }}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {doctors.filter(d => d.department === apptForm.department).map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.roomNo || 'OPD'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Visit Type</label>
                <select
                  value={apptForm.type}
                  onChange={(e) => setApptForm({ ...apptForm, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="Regular Consultation">Regular Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Walk-in Emergency">Walk-in Emergency</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={apptForm.date}
                  onChange={(e) => setApptForm({ ...apptForm, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Time Slot *</label>
                <select
                  value={apptForm.time}
                  onChange={(e) => setApptForm({ ...apptForm, time: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Reason / Symptoms *</label>
              <textarea
                rows={2}
                required
                value={apptForm.reason}
                onChange={(e) => setApptForm({ ...apptForm, reason: e.target.value })}
                placeholder="Enter patient primary symptoms or purpose of appointment..."
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setActiveModal(null)} className="px-3 py-1.5 border rounded-lg">Cancel</button>
              <button type="submit" className="px-5 py-1.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700">
                Confirm Appointment
              </button>
            </div>
          </form>
        </Modal>

        {/* Create Bill Modal */}
        <Modal
          isOpen={activeModal === 'createBill'}
          onClose={() => setActiveModal(null)}
          title="Create New Hospital Invoice"
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSaveBill} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Select Patient *</label>
                <select
                  value={billForm.patientId}
                  onChange={(e) => {
                    const pat = patients.find(p => p.id === e.target.value);
                    setBillForm({ ...billForm, patientId: e.target.value, patientName: pat?.name || 'Patient', patientPhone: pat?.phone || '' });
                  }}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Payment Status</label>
                <select
                  value={billForm.status}
                  onChange={(e) => setBillForm({ ...billForm, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="Unpaid">Unpaid (Counter Due)</option>
                  <option value="Paid">Paid Immediately</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900">Particulars & Charges</span>
                <button
                  type="button"
                  onClick={handleAddBillItem}
                  className="px-2 py-1 text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Charge Item
                </button>
              </div>

              <div className="space-y-2">
                {billForm.items.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border rounded-lg grid grid-cols-6 gap-2 items-center">
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...billForm.items];
                          updated[idx].description = e.target.value;
                          setBillForm({ ...billForm, items: updated });
                        }}
                        placeholder="Description"
                        className="w-full px-2 py-1 border rounded bg-white text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        step="0.01"
                        value={item.amount}
                        onChange={(e) => {
                          const updated = [...billForm.items];
                          updated[idx].amount = Number(e.target.value);
                          setBillForm({ ...billForm, items: updated });
                        }}
                        placeholder="Amount ($)"
                        className="w-full px-2 py-1 border rounded bg-white text-xs"
                      />
                    </div>
                    <div className="text-right">
                      {billForm.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBillItem(idx)}
                          className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center bg-slate-100 p-3 rounded-lg font-bold text-slate-900">
              <span>Total Invoice Amount:</span>
              <span className="text-sm text-rose-600">
                ${billForm.items.reduce((a,c) => a + Number(c.amount || 0), 0).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setActiveModal(null)} className="px-3 py-1.5 border rounded-lg">Cancel</button>
              <button type="submit" className="px-5 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700">
                Generate Invoice
              </button>
            </div>
          </form>
        </Modal>

        {/* Settle Bill Modal */}
        <Modal
          isOpen={activeModal === 'payBill'}
          onClose={() => setActiveModal(null)}
          title="Hospital Counter Bill Settlement"
        >
          {selectedRecord && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900">{selectedRecord.id}</div>
                  <div className="text-slate-500">Patient: {selectedRecord.patientName}</div>
                </div>
                <div className="text-right font-bold text-sm text-rose-600">
                  ${Number(selectedRecord.totalAmount).toFixed(2)}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Payment Method Collected</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Cash', 'Credit Card', 'Insurance / TPA'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`p-2 rounded-lg border text-center font-medium ${
                        paymentMethod === m ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold' : 'border-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button onClick={() => setActiveModal(null)} className="px-3 py-1.5 border rounded-lg">Cancel</button>
                <button
                  onClick={() => {
                    markBillPaid(selectedRecord.id, paymentMethod);
                    setActiveModal(null);
                  }}
                  className="px-4 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700"
                >
                  Mark Paid & Issue Receipt
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Reschedule Modal */}
        <Modal
          isOpen={activeModal === 'rescheduleAppt'}
          onClose={() => setActiveModal(null)}
          title="Reschedule Patient Appointment"
        >
          {selectedRecord && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                Updating appointment slot for <strong>{selectedRecord.patientName}</strong> with {selectedRecord.doctorName}.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">New Date</label>
                  <input
                    type="date"
                    value={rescheduleData.date}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">New Time Slot</label>
                  <select
                    value={rescheduleData.time}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:45 AM">11:45 AM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button onClick={() => setActiveModal(null)} className="px-3 py-1.5 border rounded-lg">Cancel</button>
                <button
                  onClick={() => {
                    rescheduleAppointment(selectedRecord.id, rescheduleData.date, rescheduleData.time);
                    setActiveModal(null);
                  }}
                  className="px-4 py-1.5 bg-rose-600 text-white font-semibold rounded-lg"
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Printable Bill Modal */}
        <PrintableDocumentModal
          isOpen={activeModal === 'printBill'}
          onClose={() => setActiveModal(null)}
          title="Hospital Service Invoice"
          documentData={selectedRecord}
          type="bill"
        />

        {/* View Patient Details */}
        <Modal
          isOpen={activeModal === 'viewPatient'}
          onClose={() => setActiveModal(null)}
          title={`Patient Record: ${selectedRecord?.name || ''}`}
        >
          {selectedRecord && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-4 rounded-xl border">
                <div><strong>Patient ID:</strong> {selectedRecord.id}</div>
                <div><strong>Blood Group:</strong> <span className="text-rose-600 font-bold">{selectedRecord.bloodGroup}</span></div>
                <div><strong>DOB:</strong> {selectedRecord.dob}</div>
                <div><strong>Gender:</strong> {selectedRecord.gender}</div>
                <div><strong>Phone:</strong> {selectedRecord.phone}</div>
                <div><strong>Email:</strong> {selectedRecord.email}</div>
                <div className="col-span-2"><strong>Address:</strong> {selectedRecord.address}</div>
                <div className="col-span-2"><strong>Emergency Contact:</strong> {selectedRecord.emergencyContact}</div>
              </div>
            </div>
          )}
        </Modal>

        {/* Cancel Dialog */}
        <ConfirmDialog
          isOpen={activeModal === 'cancelAppt'}
          onClose={() => setActiveModal(null)}
          onConfirm={() => {
            if (selectedRecord) updateAppointmentStatus(selectedRecord.id, 'Cancelled');
          }}
          title="Cancel Appointment?"
          message={`Cancel appointment ${selectedRecord?.id} for ${selectedRecord?.patientName}?`}
          confirmText="Yes, Cancel"
        />
      </>
    );
  }
};
