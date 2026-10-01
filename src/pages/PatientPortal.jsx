import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Pill,
  FlaskConical,
  Receipt,
  FileText,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Printer,
  ChevronRight,
  CreditCard,
  XCircle,
  ArrowRight,
  ShieldAlert,
  Bell
} from 'lucide-react';

export const PatientPortal = ({ view = 'dashboard' }) => {
  const {
    currentUser,
    patients,
    updatePatient,
    appointments,
    addAppointment,
    cancelAppointment,
    rescheduleAppointment,
    prescriptions,
    labReports,
    labTests,
    bills,
    markBillPaid,
    medicalHistory,
    departments,
    users,
    notifications,
    markNotificationRead
  } = useHospital();

  const navigate = useNavigate();

  // Active patient record
  const currentPatId = currentUser?.patientId || 'PAT-1001';
  const patientData = patients.find(p => p.id === currentPatId) || patients[0] || {};

  // Filtered data for this patient
  const myAppointments = appointments.filter(a => a.patientId === currentPatId || a.patientName === patientData.name);
  const myPrescriptions = prescriptions.filter(p => p.patientId === currentPatId || p.patientName === patientData.name);
  const myLabReports = labReports.filter(r => r.patientId === currentPatId || r.patientName === patientData.name);
  const myBills = bills.filter(b => b.patientId === currentPatId || b.patientName === patientData.name);
  const myHistory = medicalHistory.filter(h => h.patientId === currentPatId);
  const myNotifications = notifications.filter(n => n.targetRole === 'Patient' || n.targetUserId === currentUser?.id);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'viewAppt', 'rescheduleAppt', 'cancelAppt', 'printRx', 'printReport', 'printBill', 'payBill'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({ ...patientData });
  const [profileSaved, setProfileSaved] = useState(false);

  // Book Appointment State
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingForm, setBookingForm] = useState({
    department: 'Cardiology',
    doctorId: 'USR-002',
    doctorName: 'Dr. Sarah Jenkins',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '10:00 AM',
    reason: '',
    type: 'Regular Consultation'
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Profile update handler
  const handleProfileSave = (e) => {
    e.preventDefault();
    updatePatient(patientData.id, profileForm);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  // Appointment booking handler
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const doc = users.find(u => u.id === bookingForm.doctorId) || { name: 'Dr. Sarah Jenkins', department: 'Cardiology' };
    addAppointment({
      patientId: patientData.id,
      patientName: patientData.name,
      patientPhone: patientData.phone,
      doctorId: bookingForm.doctorId,
      doctorName: doc.name,
      department: bookingForm.department,
      date: bookingForm.date,
      time: bookingForm.time,
      reason: bookingForm.reason || 'General Specialist Consultation',
      type: bookingForm.type,
      roomNo: doc.roomNo || 'OPD Room 204'
    });
    setBookingSuccess(true);
  };

  // 1. Patient Dashboard View (Strictly Operational - No Statistics)
  if (view === 'dashboard') {
    const upcomingAppt = myAppointments.find(a => a.status === 'Scheduled');
    const pendingBills = myBills.filter(b => b.status === 'Unpaid');
    const recentRx = myPrescriptions[0];

    return (
      <DashboardLayout title="Patient Portal">
        <PageHeader
          title={`Welcome back, ${patientData.name || 'Patient'}`}
          subtitle={`Patient ID: ${patientData.id || 'PAT-1001'} | Blood Group: ${patientData.bloodGroup || 'O+'}`}
          actionButton={
            <button
              onClick={() => navigate('/patient/book')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shadow-xs"
            >
              <CalendarPlus className="w-4 h-4" /> Book New Appointment
            </button>
          }
        />

        {/* Operational Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <OperationalCard
            title="Next Appointment"
            count={upcomingAppt ? upcomingAppt.date : 'No Upcoming'}
            description={upcomingAppt ? `${upcomingAppt.doctorName} (${upcomingAppt.time})` : 'All consultations up to date'}
            icon={Calendar}
            color="red"
            actionLink="/patient/appointments"
            actionLabel="View Appointments"
          />
          <OperationalCard
            title="Active Prescriptions"
            count={`${myPrescriptions.length} Records`}
            description={recentRx ? `Latest: ${recentRx.diagnosis?.slice(0, 24)}...` : 'No active prescriptions'}
            icon={Pill}
            color="emerald"
            actionLink="/patient/prescriptions"
            actionLabel="View Prescriptions"
          />
          <OperationalCard
            title="Laboratory Reports"
            count={`${myLabReports.length} Available`}
            description="Verified diagnostic test findings"
            icon={FlaskConical}
            color="purple"
            actionLink="/patient/lab-reports"
            actionLabel="View Test Reports"
          />
          <OperationalCard
            title="Outstanding Invoices"
            count={`${pendingBills.length} Pending`}
            description={pendingBills.length > 0 ? `Total Due: $${pendingBills.reduce((a,c) => a + Number(c.totalAmount), 0).toFixed(2)}` : 'All invoices settled'}
            icon={Receipt}
            color="amber"
            actionLink="/patient/bills"
            actionLabel="Manage Bills"
          />
        </div>

        {/* Operational Split Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Next Scheduled Visit & Recent Prescriptions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Upcoming Appointment Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-600" /> Upcoming Hospital Appointment
                </h3>
                <Link to="/patient/appointments" className="text-xs text-rose-600 font-semibold hover:underline">
                  View All
                </Link>
              </div>

              {upcomingAppt ? (
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{upcomingAppt.doctorName}</h4>
                      <p className="text-xs text-rose-600 font-medium">{upcomingAppt.department} &bull; {upcomingAppt.roomNo || 'OPD Room 204'}</p>
                    </div>
                    <StatusBadge status={upcomingAppt.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-100">
                    <div><strong>Date:</strong> {upcomingAppt.date}</div>
                    <div><strong>Time:</strong> {upcomingAppt.time}</div>
                    <div className="col-span-2"><strong>Reason:</strong> {upcomingAppt.reason}</div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => { setSelectedRecord(upcomingAppt); setActiveModal('rescheduleAppt'); setRescheduleData({ date: upcomingAppt.date, time: upcomingAppt.time }); }}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => { setSelectedRecord(upcomingAppt); setActiveModal('cancelAppt'); }}
                      className="px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-lg hover:bg-rose-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p>You currently have no scheduled appointments.</p>
                  <button
                    onClick={() => navigate('/patient/book')}
                    className="mt-3 px-3 py-1.5 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700"
                  >
                    Schedule Consultation
                  </button>
                </div>
              )}
            </div>

            {/* Recent Prescriptions Summary */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-emerald-600" /> Recent Prescriptions
                </h3>
                <Link to="/patient/prescriptions" className="text-xs text-rose-600 font-semibold hover:underline">
                  All Prescriptions
                </Link>
              </div>

              <div className="mt-4 divide-y divide-slate-100">
                {myPrescriptions.length > 0 ? (
                  myPrescriptions.slice(0, 2).map((rx) => (
                    <div key={rx.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{rx.diagnosis}</div>
                        <div className="text-[11px] text-slate-500">Dr. {rx.doctorName} &bull; {rx.date}</div>
                        <div className="text-[11px] text-emerald-700 mt-1 font-medium">
                          {rx.medicines?.map(m => m.name).join(', ')}
                        </div>
                      </div>
                      <button
                        onClick={() => { setSelectedRecord(rx); setActiveModal('printRx'); }}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="View & Print Prescription"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-xs text-slate-400">No prescriptions on record.</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Pending Lab Reports & Bills & Emergency Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Recent Verified Lab Reports */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-purple-600" /> Lab Test Results
                </h3>
                <Link to="/patient/lab-reports" className="text-xs text-rose-600 font-semibold hover:underline">
                  All Reports
                </Link>
              </div>

              <div className="mt-3 divide-y divide-slate-100">
                {myLabReports.length > 0 ? (
                  myLabReports.slice(0, 3).map((rep) => (
                    <div key={rep.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{rep.testName}</div>
                        <div className="text-[11px] text-slate-500">Date: {rep.completedDate || rep.testDate}</div>
                      </div>
                      <button
                        onClick={() => { setSelectedRecord(rep); setActiveModal('printReport'); }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition"
                      >
                        View Report
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-xs text-slate-400">No lab test reports found.</div>
                )}
              </div>
            </div>

            {/* Unpaid Invoices Quick Action */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-amber-600" /> Hospital Billing
                </h3>
                <Link to="/patient/bills" className="text-xs text-rose-600 font-semibold hover:underline">
                  View Invoices
                </Link>
              </div>

              <div className="mt-3 space-y-3">
                {pendingBills.length > 0 ? (
                  pendingBills.map((bill) => (
                    <div key={bill.id} className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/60 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{bill.id}</span>
                        <div className="text-[11px] text-slate-500">{bill.date} &bull; {bill.items?.length || 1} items</div>
                        <div className="font-bold text-rose-600 mt-0.5">${Number(bill.totalAmount).toFixed(2)}</div>
                      </div>
                      <button
                        onClick={() => { setSelectedRecord(bill); setActiveModal('payBill'); }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
                      >
                        Pay Online
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>All your hospital service invoices are settled in full.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Hospital Contact Assistance */}
            <div className="p-4 bg-slate-900 text-white rounded-xl text-xs space-y-2">
              <div className="font-bold flex items-center gap-2 text-rose-400">
                <ShieldAlert className="w-4 h-4" /> Need Immediate Assistance?
              </div>
              <p className="text-slate-300">
                Call our 24/7 patient helpline at <strong>+1 (800) 456-7890</strong> or emergency dispatch at <strong>+1 (800) 911-CARE</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Global Modals */}
        {renderModals()}
      </DashboardLayout>
    );
  }

  // 2. Book Appointment View
  if (view === 'book') {
    const selectedDeptDoctors = users.filter(u => u.role === 'Doctor' && u.department?.toLowerCase() === bookingForm.department?.toLowerCase() && u.status === 'Active');

    return (
      <DashboardLayout title="Book Specialist Consultation">
        <PageHeader
          title="Book an Appointment"
          subtitle="Select clinical department, doctor, and convenient time slot"
        />

        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs text-xs">
          {bookingSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Appointment Confirmed!</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                Your consultation has been scheduled with <strong>{bookingForm.doctorName}</strong> ({bookingForm.department}) on <strong>{bookingForm.date}</strong> at <strong>{bookingForm.time}</strong>.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => navigate('/patient/appointments')}
                  className="px-4 py-2 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700"
                >
                  View My Appointments
                </button>
                <button
                  onClick={() => { setBookingSuccess(false); setBookingForm({ ...bookingForm, reason: '' }); }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200"
                >
                  Book Another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              {/* Step 1: Department Selection */}
              <div>
                <label className="block font-semibold text-slate-800 mb-2">1. Select Medical Department *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {departments.map((dept) => (
                    <button
                      key={dept.id}
                      type="button"
                      onClick={() => {
                        const docs = users.filter(u => u.role === 'Doctor' && u.department === dept.name);
                        setBookingForm({
                          ...bookingForm,
                          department: dept.name,
                          doctorId: docs[0]?.id || 'USR-002',
                          doctorName: docs[0]?.name || 'Dr. Sarah Jenkins'
                        });
                      }}
                      className={`p-3 rounded-lg border text-left transition ${
                        bookingForm.department === dept.name
                          ? 'bg-rose-50 border-rose-500 text-rose-800 font-bold shadow-2xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="text-xs">{dept.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{dept.doctorsCount} Specialists</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Doctor Selection */}
              <div>
                <label className="block font-semibold text-slate-800 mb-2">2. Choose Specialist Physician *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedDeptDoctors.length > 0 ? (
                    selectedDeptDoctors.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => setBookingForm({ ...bookingForm, doctorId: doc.id, doctorName: doc.name })}
                        className={`p-3.5 rounded-lg border cursor-pointer transition flex items-center gap-3 ${
                          bookingForm.doctorId === doc.id
                            ? 'bg-rose-50 border-rose-500 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img src={doc.avatar} alt={doc.name} className="w-10 h-10 rounded-full object-cover border" />
                        <div>
                          <h4 className="font-bold text-slate-900">{doc.name}</h4>
                          <p className="text-[11px] text-slate-500">{doc.specialization || doc.qualification}</p>
                          <p className="text-[10px] text-rose-600 font-medium mt-0.5">{doc.roomNo || 'OPD Room'}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 p-3 text-slate-400 bg-slate-50 rounded-lg">
                      Dr. Sarah Jenkins (Senior Consultant) assigned for this specialty.
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Date and Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">3. Consultation Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">4. Available Time Slot *</label>
                  <select
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  >
                    <option value="09:00 AM">09:00 AM - 09:30 AM</option>
                    <option value="09:30 AM">09:30 AM - 10:00 AM</option>
                    <option value="10:00 AM">10:00 AM - 10:30 AM</option>
                    <option value="10:30 AM">10:30 AM - 11:00 AM</option>
                    <option value="11:15 AM">11:15 AM - 11:45 AM</option>
                    <option value="12:00 PM">12:00 PM - 12:30 PM</option>
                    <option value="02:00 PM">02:00 PM - 02:30 PM</option>
                    <option value="03:30 PM">03:30 PM - 04:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Step 4: Reason for Consultation */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">5. Chief Complaint / Reason for Visit *</label>
                <textarea
                  rows={3}
                  required
                  value={bookingForm.reason}
                  onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
                  placeholder="Describe your symptoms, discomfort, or reason for this follow-up..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              {/* Booking Summary Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-800">Booking Summary</div>
                <div className="text-slate-600">
                  Patient: <strong>{patientData.name}</strong> ({patientData.id}) &bull; Doctor: <strong>{bookingForm.doctorName}</strong> ({bookingForm.department})
                </div>
                <div className="text-slate-600">
                  Date: <strong>{bookingForm.date}</strong> at <strong>{bookingForm.time}</strong>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/patient')}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Confirm & Schedule Appointment
                </button>
              </div>
            </form>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // 3. My Appointments View (Library Management System style clean table + search & filter)
  if (view === 'appointments') {
    const filtered = myAppointments.filter(a => {
      const matchSearch = a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.reason.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter ? a.status === statusFilter : true;
      return matchSearch && matchStatus;
    });

    const columns = [
      { header: 'Appt ID', accessor: 'id', cellClassName: 'font-semibold text-slate-900' },
      { header: 'Doctor', accessor: 'doctorName', render: (row) => (
        <div>
          <div className="font-medium text-slate-900">{row.doctorName}</div>
          <div className="text-[11px] text-slate-500">{row.department}</div>
        </div>
      )},
      { header: 'Date & Time', render: (row) => (
        <div>
          <div className="font-medium text-slate-800">{row.date}</div>
          <div className="text-[11px] text-slate-500">{row.time}</div>
        </div>
      )},
      { header: 'Reason for Visit', accessor: 'reason', className: 'max-w-xs truncate' },
      { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
      {
        header: 'Actions',
        render: (row) => (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setSelectedRecord(row); setActiveModal('viewAppt'); }}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            {row.status === 'Scheduled' && (
              <>
                <button
                  onClick={() => { setSelectedRecord(row); setActiveModal('rescheduleAppt'); setRescheduleData({ date: row.date, time: row.time }); }}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition text-xs font-medium"
                  title="Reschedule"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => { setSelectedRecord(row); setActiveModal('cancelAppt'); }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Cancel Appointment"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )
      }
    ];

    return (
      <DashboardLayout title="My Scheduled Appointments">
        <PageHeader
          title="My Appointments"
          subtitle="View, reschedule, or cancel your hospital consultations"
          actionButton={
            <button
              onClick={() => navigate('/patient/book')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shadow-xs"
            >
              <CalendarPlus className="w-4 h-4" /> Book Appointment
            </button>
          }
        />

        <SearchFilterBar
          searchPlaceholder="Search by doctor, department, or reason..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: [
                { label: 'Scheduled', value: 'Scheduled' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Cancelled', value: 'Cancelled' },
                { label: 'No Show', value: 'No Show' }
              ]
            }
          ]}
          selectedFilters={{ status: statusFilter }}
          onFilterChange={(_, val) => setStatusFilter(val)}
          onReset={() => { setSearchTerm(''); setStatusFilter(''); }}
        />

        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="No consultations found matching your criteria."
        />

        {renderModals()}
      </DashboardLayout>
    );
  }

  // 4. Medical History View
  if (view === 'history') {
    return (
      <DashboardLayout title="Medical History & Consultations">
        <PageHeader
          title="Clinical Consultations History"
          subtitle="Chronological record of previous hospital visits, diagnoses, and physician recommendations"
        />

        <div className="space-y-4">
          {myHistory.length > 0 ? (
            myHistory.map((rec) => (
              <div key={rec.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{rec.diagnosis}</span>
                    <p className="text-slate-500 text-xs mt-0.5">{rec.doctorName} &bull; {rec.department}</p>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">
                    Consultation Date: {rec.date}
                  </span>
                </div>

                <div className="text-slate-700 bg-slate-50 p-3 rounded-lg leading-relaxed">
                  <strong>Clinical Findings & Physician Notes:</strong>
                  <p className="mt-1">{rec.notes}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-lg border border-slate-100">
                    <span className="font-semibold text-rose-700 block mb-1">Prescribed Regimen:</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      {rec.prescriptions?.map((rx, idx) => (
                        <li key={idx}>{rx}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-100">
                    <span className="font-semibold text-purple-700 block mb-1">Diagnostic Investigations:</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      {rec.labTests?.map((lab, idx) => (
                        <li key={idx}>{lab}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 text-center text-slate-400 rounded-xl border border-slate-200 text-xs">
              No previous consultation histories found.
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // 5. Prescriptions View
  if (view === 'prescriptions') {
    const columns = [
      { header: 'Prescription ID', accessor: 'id', cellClassName: 'font-semibold text-slate-900' },
      { header: 'Doctor', accessor: 'doctorName', render: (row) => `${row.doctorName} (${row.department})` },
      { header: 'Date', accessor: 'date' },
      { header: 'Clinical Diagnosis', accessor: 'diagnosis', className: 'max-w-xs truncate' },
      {
        header: 'Prescribed Drugs',
        render: (row) => (
          <div className="text-xs text-slate-700 font-medium">
            {row.medicines?.map(m => m.name).join(', ')}
          </div>
        )
      },
      { header: 'Pharmacy Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
      {
        header: 'Actions',
        render: (row) => (
          <button
            onClick={() => { setSelectedRecord(row); setActiveModal('printRx'); }}
            className="px-3 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1 transition"
          >
            <Printer className="w-3.5 h-3.5" /> View / Print
          </button>
        )
      }
    ];

    return (
      <DashboardLayout title="My Prescriptions">
        <PageHeader
          title="Digital Medical Prescriptions"
          subtitle="Review doctor-issued electronic prescriptions and dosage schedules"
        />
        <DataTable columns={columns} data={myPrescriptions} emptyMessage="No prescriptions on record." />
        {renderModals()}
      </DashboardLayout>
    );
  }

  // 6. Lab Reports View
  if (view === 'lab-reports') {
    const columns = [
      { header: 'Report ID', accessor: 'id', cellClassName: 'font-semibold text-slate-900' },
      { header: 'Diagnostic Test', accessor: 'testName', cellClassName: 'font-medium text-slate-900' },
      { header: 'Referring Doctor', accessor: 'doctorName' },
      { header: 'Test Date', render: (row) => row.completedDate || row.testDate },
      { header: 'Category', accessor: 'category' },
      { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
      {
        header: 'Actions',
        render: (row) => (
          <button
            onClick={() => { setSelectedRecord(row); setActiveModal('printReport'); }}
            className="px-3 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1 transition"
          >
            <Printer className="w-3.5 h-3.5" /> View Report
          </button>
        )
      }
    ];

    return (
      <DashboardLayout title="Laboratory Reports">
        <PageHeader
          title="Diagnostic Lab Reports"
          subtitle="Access verified biochemical, hematological, and pathology reports"
        />
        <DataTable columns={columns} data={myLabReports} emptyMessage="No laboratory reports available." />
        {renderModals()}
      </DashboardLayout>
    );
  }

  // 7. Bills View
  if (view === 'bills') {
    const columns = [
      { header: 'Invoice #', accessor: 'id', cellClassName: 'font-semibold text-slate-900' },
      { header: 'Invoice Date', accessor: 'date' },
      {
        header: 'Particulars',
        render: (row) => (
          <div className="text-xs text-slate-600">
            {row.items?.map(i => i.description).slice(0, 2).join('; ')}
            {row.items?.length > 2 && ` (+${row.items.length - 2} more)`}
          </div>
        )
      },
      {
        header: 'Total Amount',
        render: (row) => <span className="font-bold text-slate-900">${Number(row.totalAmount).toFixed(2)}</span>
      },
      { header: 'Payment Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
      {
        header: 'Actions',
        render: (row) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setSelectedRecord(row); setActiveModal('printBill'); }}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            {row.status === 'Unpaid' && (
              <button
                onClick={() => { setSelectedRecord(row); setActiveModal('payBill'); }}
                className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
              >
                Pay Now
              </button>
            )}
          </div>
        )
      }
    ];

    return (
      <DashboardLayout title="Bills & Invoices">
        <PageHeader
          title="Hospital Invoices & Payments"
          subtitle="Itemized billing statements, payment receipts, and counter settlements"
        />
        <DataTable columns={columns} data={myBills} emptyMessage="No hospital billing invoices found." />
        {renderModals()}
      </DashboardLayout>
    );
  }

  // 8. Notifications View
  if (view === 'notifications') {
    return (
      <DashboardLayout title="Patient Notifications">
        <PageHeader
          title="System Notifications"
          subtitle="Updates regarding appointments, prescriptions, diagnostic results, and invoices"
        />

        <div className="max-w-3xl mx-auto space-y-3">
          {myNotifications.length > 0 ? (
            myNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-4 rounded-xl border text-xs transition cursor-pointer ${
                  n.read ? 'bg-white border-slate-200 opacity-80' : 'bg-rose-50/40 border-rose-200 font-medium'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{n.title}</span>
                  <span className="text-[11px] text-slate-400">{n.timestamp}</span>
                </div>
                <p className="text-slate-600 mt-1">{n.message}</p>
              </div>
            ))
          ) : (
            <div className="bg-white p-8 text-center text-slate-400 rounded-xl border border-slate-200 text-xs">
              No notifications at this time.
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // 9. Profile View
  return (
    <DashboardLayout title="Patient Profile">
      <PageHeader
        title="My Patient Profile"
        subtitle="Manage your personal information, emergency contacts, and medical alerts"
      />

      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs text-xs">
        {profileSaved && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile information successfully updated!</span>
          </div>
        )}

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Patient ID (Permanent)</label>
              <input
                type="text"
                disabled
                value={patientData.id || 'PAT-1001'}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                value={profileForm.name || ''}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={profileForm.email || ''}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={profileForm.phone || ''}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                required
                value={profileForm.dob || ''}
                onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Blood Group *</label>
              <select
                value={profileForm.bloodGroup || 'O+'}
                onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
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
            <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
            <input
              type="text"
              value={profileForm.address || ''}
              onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Emergency Contact</label>
              <input
                type="text"
                value={profileForm.emergencyContact || ''}
                onChange={(e) => setProfileForm({ ...profileForm, emergencyContact: e.target.value })}
                placeholder="Name & Contact Number"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Known Drug Allergies</label>
              <input
                type="text"
                value={profileForm.allergies || ''}
                onChange={(e) => setProfileForm({ ...profileForm, allergies: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-xs"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );

  // Helper helper to render modals
  function renderModals() {
    return (
      <>
        {/* View Appointment Details Modal */}
        <Modal
          isOpen={activeModal === 'viewAppt'}
          onClose={() => setActiveModal(null)}
          title="Appointment Details"
        >
          {selectedRecord && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div><strong>Appointment ID:</strong> {selectedRecord.id}</div>
                <div><strong>Status:</strong> <StatusBadge status={selectedRecord.status} /></div>
                <div><strong>Doctor:</strong> {selectedRecord.doctorName}</div>
                <div><strong>Department:</strong> {selectedRecord.department}</div>
                <div><strong>Date & Time:</strong> {selectedRecord.date} at {selectedRecord.time}</div>
                <div><strong>Location:</strong> {selectedRecord.roomNo || 'OPD Room 204'}</div>
              </div>
              <div>
                <strong>Reason for Visit:</strong>
                <p className="text-slate-600 mt-1 bg-white p-3 rounded-lg border">{selectedRecord.reason}</p>
              </div>
              {selectedRecord.notes && (
                <div>
                  <strong>Doctor Notes:</strong>
                  <p className="text-slate-600 mt-1 bg-white p-3 rounded-lg border">{selectedRecord.notes}</p>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Reschedule Appointment Modal */}
        <Modal
          isOpen={activeModal === 'rescheduleAppt'}
          onClose={() => setActiveModal(null)}
          title="Reschedule Appointment"
        >
          {selectedRecord && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                Select a new date and time slot for your consultation with <strong>{selectedRecord.doctorName}</strong>.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">New Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={rescheduleData.date}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">New Time</label>
                  <select
                    value={rescheduleData.time}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setActiveModal(null)} className="px-3 py-1.5 border rounded-lg">Cancel</button>
                <button
                  onClick={() => {
                    rescheduleAppointment(selectedRecord.id, rescheduleData.date, rescheduleData.time);
                    setActiveModal(null);
                  }}
                  className="px-4 py-1.5 bg-rose-600 text-white font-semibold rounded-lg"
                >
                  Save Reschedule
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Cancel Appointment Confirmation Dialog */}
        <ConfirmDialog
          isOpen={activeModal === 'cancelAppt'}
          onClose={() => setActiveModal(null)}
          onConfirm={() => {
            if (selectedRecord) cancelAppointment(selectedRecord.id);
          }}
          title="Cancel Consultation Appointment?"
          message={`Are you sure you want to cancel appointment ${selectedRecord?.id} with ${selectedRecord?.doctorName}? This slot will be released for other patients.`}
          confirmText="Yes, Cancel Appointment"
          confirmColor="rose"
        />

        {/* Pay Bill Modal */}
        <Modal
          isOpen={activeModal === 'payBill'}
          onClose={() => setActiveModal(null)}
          title="Hospital Bill Counter / Online Settlement"
        >
          {selectedRecord && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900">{selectedRecord.id}</div>
                  <div className="text-slate-500">Patient: {selectedRecord.patientName}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-500">Amount Due</div>
                  <div className="text-base font-bold text-rose-600">${Number(selectedRecord.totalAmount).toFixed(2)}</div>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Credit Card', 'Debit Card', 'Online UPI / Bank'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2.5 rounded-lg border text-center transition ${
                        paymentMethod === method ? 'bg-rose-50 border-rose-500 text-rose-800 font-bold' : 'border-slate-200'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-800 text-[11px]">
                Demo Payment Simulator: Clicking 'Confirm Payment' immediately updates this invoice as Paid and dispatches a confirmation notice.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setActiveModal(null)} className="px-3 py-1.5 border rounded-lg">Cancel</button>
                <button
                  onClick={() => {
                    markBillPaid(selectedRecord.id, paymentMethod);
                    setActiveModal(null);
                  }}
                  className="px-4 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700"
                >
                  Confirm & Pay ${Number(selectedRecord.totalAmount).toFixed(2)}
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Printable Prescription Modal */}
        <PrintableDocumentModal
          isOpen={activeModal === 'printRx'}
          onClose={() => setActiveModal(null)}
          title="Electronic Prescription"
          documentData={selectedRecord}
          type="prescription"
        />

        {/* Printable Lab Report Modal */}
        <PrintableDocumentModal
          isOpen={activeModal === 'printReport'}
          onClose={() => setActiveModal(null)}
          title="Laboratory Investigation Report"
          documentData={selectedRecord}
          type="labReport"
        />

        {/* Printable Hospital Bill Modal */}
        <PrintableDocumentModal
          isOpen={activeModal === 'printBill'}
          onClose={() => setActiveModal(null)}
          title="Hospital Service Invoice & Receipt"
          documentData={selectedRecord}
          type="bill"
        />
      </>
    );
  }
};
