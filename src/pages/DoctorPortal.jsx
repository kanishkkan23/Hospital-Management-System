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
  Users,
  FileText,
  Pill,
  FlaskConical,
  Stethoscope,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  Trash2,
  Printer,
  ChevronRight,
  ClipboardList,
  Activity,
  UserPlus
} from 'lucide-react';

export const DoctorPortal = ({ view = 'dashboard' }) => {
  const {
    currentUser,
    patients,
    appointments,
    updateAppointmentStatus,
    prescriptions,
    addPrescription,
    labTests,
    requestLabTest,
    labReports,
    medicalHistory,
    addMedicalRecord,
    medicines,
    notifications,
    markNotificationRead,
    activityLogs
  } = useHospital();

  const navigate = useNavigate();
  const currentDocName = currentUser?.name || 'Dr. Sarah Jenkins';
  const currentDocDept = currentUser?.department || 'Cardiology';

  // Doctor's specific appointments & records
  const docAppointments = appointments.filter(a => a.doctorName?.toLowerCase().includes(currentDocName.toLowerCase()) || a.doctorId === currentUser?.id);
  const docPrescriptions = prescriptions.filter(p => p.doctorName?.toLowerCase().includes(currentDocName.toLowerCase()) || p.doctorId === currentUser?.id);
  const docLabTests = labTests.filter(t => t.doctorName?.toLowerCase().includes(currentDocName.toLowerCase()) || t.doctorId === currentUser?.id);
  const docLabReports = labReports.filter(r => r.doctorName?.toLowerCase().includes(currentDocName.toLowerCase()) || r.doctorId === currentUser?.id);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'consultation', 'newPrescription', 'orderLabTest', 'viewPatient', 'viewReport', 'printRx', 'cancelAppt'
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Consultation Modal State
  const [consultForm, setConsultForm] = useState({
    patientId: 'PAT-1001',
    patientName: 'Johnathan Doe',
    appointmentId: '',
    diagnosis: '',
    notes: '',
    bp: '120/80 mmHg',
    pulse: '72 bpm',
    weight: '70 kg',
    temperature: '98.6 °F',
    prescribeNow: false,
    orderLabNow: false
  });

  // New Prescription Form State
  const [rxForm, setRxForm] = useState({
    patientId: 'PAT-1001',
    patientName: 'Johnathan Doe',
    diagnosis: '',
    instructions: 'Take medications as prescribed after food. Drink plenty of water.',
    medicinesList: [
      { id: 'MED-101', name: 'Amlodipine 5mg', dosage: '5mg', frequency: 'Once daily (Morning)', duration: '30 Days', quantity: 30, instructions: 'Take after breakfast' }
    ]
  });

  // Order Lab Test Form State
  const [labOrderForm, setLabOrderForm] = useState({
    patientId: 'PAT-1001',
    patientName: 'Johnathan Doe',
    testName: 'Complete Blood Count (CBC) with ESR',
    category: 'Hematology',
    priority: 'Routine',
    sampleType: 'Whole Blood (EDTA)',
    notes: 'Check baseline hematological parameters.'
  });

  // Medicine list item addition
  const handleAddMedicineRow = () => {
    setRxForm({
      ...rxForm,
      medicinesList: [
        ...rxForm.medicinesList,
        { id: 'MED-109', name: 'Paracetamol 650mg', dosage: '650mg', frequency: 'Twice daily', duration: '5 Days', quantity: 10, instructions: 'SOS for fever/pain' }
      ]
    });
  };

  const handleRemoveMedicineRow = (index) => {
    setRxForm({
      ...rxForm,
      medicinesList: rxForm.medicinesList.filter((_, i) => i !== index)
    });
  };

  // Submit Consultation
  const handleSaveConsultation = (e) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === consultForm.patientId) || patients[0];

    // Add medical history entry
    addMedicalRecord({
      patientId: pat.id,
      patientName: pat.name,
      doctorName: currentDocName,
      department: currentDocDept,
      diagnosis: consultForm.diagnosis || 'General Clinical Evaluation',
      notes: `Vitals: BP ${consultForm.bp}, Pulse ${consultForm.pulse}, Temp ${consultForm.temperature}, Weight ${consultForm.weight}. Clinical Observations: ${consultForm.notes}`,
      prescriptions: consultForm.prescribeNow ? ['Prescription generated'] : [],
      labTests: consultForm.orderLabNow ? ['Laboratory investigation requested'] : []
    });

    // Mark appointment as Completed if associated
    if (consultForm.appointmentId) {
      updateAppointmentStatus(consultForm.appointmentId, 'Completed');
    }

    // Auto-create prescription if flagged
    if (consultForm.prescribeNow) {
      addPrescription({
        patientId: pat.id,
        patientName: pat.name,
        doctorId: currentUser?.id || 'USR-002',
        doctorName: currentDocName,
        department: currentDocDept,
        diagnosis: consultForm.diagnosis || 'Clinical Follow-up',
        instructions: rxForm.instructions,
        medicines: rxForm.medicinesList
      });
    }

    // Auto-order lab test if flagged
    if (consultForm.orderLabNow) {
      requestLabTest({
        patientId: pat.id,
        patientName: pat.name,
        doctorId: currentUser?.id || 'USR-002',
        doctorName: currentDocName,
        department: currentDocDept,
        testName: labOrderForm.testName,
        category: labOrderForm.category,
        priority: labOrderForm.priority,
        sampleType: labOrderForm.sampleType,
        notes: labOrderForm.notes
      });
    }

    setActiveModal(null);
    alert(`Consultation completed and clinical records updated for ${pat.name}!`);
  };

  // Submit Standalone Prescription
  const handleSavePrescription = (e) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === rxForm.patientId) || patients[0];
    addPrescription({
      patientId: pat.id,
      patientName: pat.name,
      doctorId: currentUser?.id || 'USR-002',
      doctorName: currentDocName,
      department: currentDocDept,
      diagnosis: rxForm.diagnosis,
      instructions: rxForm.instructions,
      medicines: rxForm.medicinesList
    });
    setActiveModal(null);
  };

  // Submit Standalone Lab Order
  const handleSaveLabOrder = (e) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === labOrderForm.patientId) || patients[0];
    requestLabTest({
      patientId: pat.id,
      patientName: pat.name,
      doctorId: currentUser?.id || 'USR-002',
      doctorName: currentDocName,
      department: currentDocDept,
      testName: labOrderForm.testName,
      category: labOrderForm.category,
      priority: labOrderForm.priority,
      sampleType: labOrderForm.sampleType,
      notes: labOrderForm.notes
    });
    setActiveModal(null);
  };

  // 1. Doctor Dashboard View (Strictly Operational - No Statistical Graphs)
  if (view === 'dashboard') {
    const todayStr = '2026-09-30';
    const todaysAppts = docAppointments.filter(a => a.date === todayStr || a.status === 'Scheduled');
    const pendingLabs = docLabTests.filter(t => t.status === 'Requested' || t.status === 'In Progress');

    return (
      <DashboardLayout title="Doctor Clinical Portal">
        <PageHeader
          title={`Welcome, ${currentDocName}`}
          subtitle={`${currentDocDept} &bull; Room: ${currentUser?.roomNo || 'OPD Room 204'} &bull; Status: On Duty`}
          actionButton={
            <div className="flex gap-2">
              <button
                onClick={() => setActiveModal('newPrescription')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shadow-xs"
              >
                <Pill className="w-4 h-4" /> Issue Prescription
              </button>
              <button
                onClick={() => setActiveModal('orderLabTest')}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shadow-xs"
              >
                <FlaskConical className="w-4 h-4" /> Order Lab Test
              </button>
            </div>
          }
        />

        {/* Operational Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <OperationalCard
            title="Today's Appointments"
            count={`${todaysAppts.length} Scheduled`}
            description="Active OPD consultations queue"
            icon={Calendar}
            color="red"
            actionLink="/doctor/appointments"
            actionLabel="View Queue"
          />
          <OperationalCard
            title="Assigned Patients"
            count={`${patients.length} Registered`}
            description="Active clinical records"
            icon={Users}
            color="blue"
            actionLink="/doctor/patients"
            actionLabel="Patient Directory"
          />
          <OperationalCard
            title="Pending Lab Work"
            count={`${pendingLabs.length} Ordered`}
            description="Awaiting diagnostic laboratory completion"
            icon={FlaskConical}
            color="amber"
            actionLink="/doctor/lab-tests"
            actionLabel="Track Lab Tests"
          />
          <OperationalCard
            title="Completed Lab Reports"
            count={`${docLabReports.length} Ready`}
            description="Verified by pathology technician"
            icon={CheckCircle2}
            color="emerald"
            actionLink="/doctor/lab-tests"
            actionLabel="Review Findings"
          />
        </div>

        {/* Operational Split Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Today's Consultation Queue */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-rose-600" /> Today's Consultation Queue
                </h3>
                <span className="text-xs bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded border border-rose-200">
                  {todaysAppts.length} Patients
                </span>
              </div>

              <div className="mt-4 divide-y divide-slate-100">
                {todaysAppts.length > 0 ? (
                  todaysAppts.map((appt) => (
                    <div key={appt.id} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{appt.patientName}</span>
                          <span className="text-slate-400">({appt.patientId})</span>
                          <StatusBadge status={appt.status} />
                        </div>
                        <div className="text-slate-500 mt-0.5">
                          <strong>Slot:</strong> {appt.time} &bull; <strong>Reason:</strong> {appt.reason}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {appt.status === 'Scheduled' && (
                          <button
                            onClick={() => {
                              setConsultForm({
                                ...consultForm,
                                patientId: appt.patientId,
                                patientName: appt.patientName,
                                appointmentId: appt.id,
                                diagnosis: appt.reason,
                                notes: ''
                              });
                              setActiveModal('consultation');
                            }}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition"
                          >
                            Start Consultation
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const pat = patients.find(p => p.id === appt.patientId);
                            setSelectedRecord(pat || { name: appt.patientName, id: appt.patientId });
                            setActiveModal('viewPatient');
                          }}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                          title="Patient Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">No scheduled consultations for today.</div>
                )}
              </div>
            </div>

            {/* Recent Prescriptions Issued */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-emerald-600" /> Recent Prescriptions Issued
                </h3>
                <button
                  onClick={() => setActiveModal('newPrescription')}
                  className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> New Rx
                </button>
              </div>

              <div className="mt-3 divide-y divide-slate-100 text-xs">
                {docPrescriptions.slice(0, 3).map((rx) => (
                  <div key={rx.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{rx.patientName} &bull; <span className="font-normal text-slate-500">{rx.diagnosis}</span></div>
                      <div className="text-[11px] text-emerald-700 mt-0.5">{rx.medicines?.map(m => m.name).join(', ')}</div>
                    </div>
                    <button
                      onClick={() => { setSelectedRecord(rx); setActiveModal('printRx'); }}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded"
                      title="Print Prescription"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Verified Lab Findings & Quick Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Lab Reports Available */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-purple-600" /> Verified Diagnostic Reports
                </h3>
                <button onClick={() => setActiveModal('orderLabTest')} className="text-xs font-semibold text-rose-600 hover:underline">
                  + Order Test
                </button>
              </div>

              <div className="mt-3 divide-y divide-slate-100 text-xs">
                {docLabReports.length > 0 ? (
                  docLabReports.slice(0, 3).map((rep) => (
                    <div key={rep.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{rep.patientName}</div>
                        <div className="text-[11px] text-slate-500">{rep.testName} &bull; {rep.completedDate || rep.testDate}</div>
                      </div>
                      <button
                        onClick={() => { setSelectedRecord(rep); setActiveModal('viewReport'); }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200"
                      >
                        Inspect Result
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-xs text-slate-400">No completed lab reports.</div>
                )}
              </div>
            </div>

            {/* Operational Activities Stream */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-600" /> Hospital Operational Feed
              </h3>
              <div className="mt-3 space-y-3 text-xs">
                {activityLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
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

        {renderDoctorModals()}
      </DashboardLayout>
    );
  }

  // 2. Doctor Appointments View
  if (view === 'appointments') {
    const filtered = docAppointments.filter(a => {
      const matchSearch = a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.reason.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter ? a.status === statusFilter : true;
      return matchSearch && matchStatus;
    });

    const columns = [
      { header: 'Appt ID', accessor: 'id', cellClassName: 'font-semibold text-slate-900' },
      { header: 'Patient', accessor: 'patientName', render: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.patientName}</div>
          <div className="text-[11px] text-slate-500">ID: {row.patientId}</div>
        </div>
      )},
      { header: 'Date & Time', render: (row) => `${row.date} at ${row.time}` },
      { header: 'Consultation Reason', accessor: 'reason', className: 'max-w-xs truncate' },
      { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
      {
        header: 'Clinical Actions',
        render: (row) => (
          <div className="flex items-center gap-1.5">
            {row.status === 'Scheduled' ? (
              <button
                onClick={() => {
                  setConsultForm({
                    ...consultForm,
                    patientId: row.patientId,
                    patientName: row.patientName,
                    appointmentId: row.id,
                    diagnosis: row.reason,
                    notes: ''
                  });
                  setActiveModal('consultation');
                }}
                className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition"
              >
                Consult
              </button>
            ) : (
              <span className="text-xs text-slate-400 font-medium">Completed</span>
            )}
            <button
              onClick={() => {
                const pat = patients.find(p => p.id === row.patientId);
                setSelectedRecord(pat || { name: row.patientName, id: row.patientId });
                setActiveModal('viewPatient');
              }}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              title="Patient Profile"
            >
              <Eye className="w-4 h-4" />
            </button>
            {row.status === 'Scheduled' && (
              <button
                onClick={() => { setSelectedRecord(row); setActiveModal('cancelAppt'); }}
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                title="Cancel Appointment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )
      }
    ];

    return (
      <DashboardLayout title="Doctor Appointments Queue">
        <PageHeader
          title="Patient Consultation Appointments"
          subtitle="Manage scheduled patient appointments and start clinical consultations"
        />

        <SearchFilterBar
          searchPlaceholder="Search by patient name, ID, or symptoms..."
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
        {renderDoctorModals()}
      </DashboardLayout>
    );
  }

  // 3. Patients View
  if (view === 'patients') {
    const filtered = patients.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
    );

    const columns = [
      { header: 'Patient ID', accessor: 'id', cellClassName: 'font-semibold text-slate-900 font-mono' },
      { header: 'Patient Name', accessor: 'name', cellClassName: 'font-medium text-slate-900' },
      { header: 'Age / Gender', render: (row) => `${row.age || 35} Yrs / ${row.gender}` },
      { header: 'Blood Group', render: (row) => <span className="font-bold text-rose-700">{row.bloodGroup || 'O+'}</span> },
      { header: 'Contact Phone', accessor: 'phone' },
      { header: 'Last Visit', accessor: 'lastVisit' },
      {
        header: 'Actions',
        render: (row) => (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setSelectedRecord(row); setActiveModal('viewPatient'); }}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              title="View Profile & Records"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setConsultForm({
                  ...consultForm,
                  patientId: row.id,
                  patientName: row.name,
                  appointmentId: '',
                  diagnosis: '',
                  notes: ''
                });
                setActiveModal('consultation');
              }}
              className="px-2.5 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg"
            >
              Consult
            </button>
          </div>
        )
      }
    ];

    return (
      <DashboardLayout title="Hospital Patients Directory">
        <PageHeader
          title="Patients List"
          subtitle="Directory of registered patients, vital parameters, and clinical history"
        />
        <SearchFilterBar
          searchPlaceholder="Search patients by name, ID, or phone..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onReset={() => setSearchTerm('')}
        />
        <DataTable columns={columns} data={filtered} emptyMessage="No patients found." />
        {renderDoctorModals()}
      </DashboardLayout>
    );
  }

  // 4. Medical Records View
  if (view === 'records') {
    return (
      <DashboardLayout title="Clinical Medical Records">
        <PageHeader
          title="Patient Medical Consultation Records"
          subtitle="Comprehensive diagnosis notes, vital indicators, and historical treatments"
          actionButton={
            <button
              onClick={() => {
                setConsultForm({ ...consultForm, patientId: patients[0]?.id || 'PAT-1001', patientName: patients[0]?.name || 'Johnathan Doe' });
                setActiveModal('consultation');
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add Consultation Record
            </button>
          }
        />

        <div className="space-y-4">
          {medicalHistory.map((rec) => (
            <div key={rec.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div>
                  <span className="font-bold text-slate-900 text-sm">{rec.diagnosis}</span>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Patient ID: <strong>{rec.patientId}</strong> &bull; Physician: <strong>{rec.doctorName}</strong> ({rec.department})
                  </p>
                </div>
                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">
                  Date: {rec.date}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg text-slate-700 leading-relaxed">
                <strong>Clinical Examination & Assessment:</strong>
                <p className="mt-1">{rec.notes}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border">
                  <span className="font-semibold text-emerald-700 block mb-1">Prescription Details:</span>
                  <ul className="list-disc list-inside text-slate-600">
                    {rec.prescriptions?.map((rx, i) => <li key={i}>{rx}</li>)}
                  </ul>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <span className="font-semibold text-purple-700 block mb-1">Ordered Laboratory Tests:</span>
                  <ul className="list-disc list-inside text-slate-600">
                    {rec.labTests?.map((l, i) => <li key={i}>{l}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        {renderDoctorModals()}
      </DashboardLayout>
    );
  }

  // 5. Prescriptions View
  if (view === 'prescriptions') {
    const columns = [
      { header: 'Rx ID', accessor: 'id', cellClassName: 'font-semibold text-slate-900' },
      { header: 'Patient Name', accessor: 'patientName', cellClassName: 'font-medium text-slate-900' },
      { header: 'Date', accessor: 'date' },
      { header: 'Diagnosis', accessor: 'diagnosis', className: 'max-w-xs truncate' },
      { header: 'Medicines Count', render: (row) => `${row.medicines?.length || 0} drugs` },
      { header: 'Pharmacy Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
      {
        header: 'Actions',
        render: (row) => (
          <button
            onClick={() => { setSelectedRecord(row); setActiveModal('printRx'); }}
            className="px-3 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1"
          >
            <Printer className="w-3.5 h-3.5" /> View / Print
          </button>
        )
      }
    ];

    return (
      <DashboardLayout title="Doctor Issued Prescriptions">
        <PageHeader
          title="Prescriptions Management"
          subtitle="Generate, review, and print patient medication schedules"
          actionButton={
            <button
              onClick={() => setActiveModal('newPrescription')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Create New Prescription
            </button>
          }
        />
        <DataTable columns={columns} data={docPrescriptions} emptyMessage="No prescriptions issued yet." />
        {renderDoctorModals()}
      </DashboardLayout>
    );
  }

  // 6. Lab Tests View
  if (view === 'lab-tests') {
    const columns = [
      { header: 'Test ID', accessor: 'id', cellClassName: 'font-semibold text-slate-900' },
      { header: 'Patient', accessor: 'patientName' },
      { header: 'Investigation', accessor: 'testName', cellClassName: 'font-medium text-slate-900' },
      { header: 'Priority', accessor: 'priority', render: (row) => <StatusBadge status={row.priority} /> },
      { header: 'Requested Date', accessor: 'requestedDate' },
      { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
      {
        header: 'Actions',
        render: (row) => {
          const matchingReport = docLabReports.find(r => r.testId === row.id || (r.patientName === row.patientName && r.testName === row.testName));
          return (
            <div className="flex items-center gap-1.5">
              {matchingReport ? (
                <button
                  onClick={() => { setSelectedRecord(matchingReport); setActiveModal('viewReport'); }}
                  className="px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg"
                >
                  View Findings
                </button>
              ) : (
                <span className="text-xs text-slate-400">Processing</span>
              )}
            </div>
          );
        }
      }
    ];

    return (
      <DashboardLayout title="Diagnostic Lab Orders">
        <PageHeader
          title="Laboratory Investigation Requests"
          subtitle="Request diagnostic panels and review pathology/biochemistry reports"
          actionButton={
            <button
              onClick={() => setActiveModal('orderLabTest')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Order New Lab Test
            </button>
          }
        />
        <DataTable columns={columns} data={docLabTests} emptyMessage="No lab test orders." />
        {renderDoctorModals()}
      </DashboardLayout>
    );
  }

  // 7. Profile & Notifications View
  return (
    <DashboardLayout title="Doctor Profile & Schedule">
      <PageHeader
        title="Doctor Profile & Availability"
        subtitle="Manage consultation schedule, room allocation, and credentials"
      />

      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs text-xs space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'}
            alt="Doctor"
            className="w-16 h-16 rounded-xl object-cover border"
          />
          <div>
            <h3 className="text-base font-bold text-slate-900">{currentDocName}</h3>
            <p className="text-xs text-rose-600 font-medium">{currentUser?.specialization || 'Consultant Specialist'}</p>
            <p className="text-[11px] text-slate-500">{currentUser?.qualification || 'MBBS, MD'} &bull; {currentUser?.experience || '10 Years Experience'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Department</label>
            <input type="text" disabled value={currentDocDept} className="w-full px-3 py-2 border rounded-lg bg-slate-50" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Assigned OPD Room</label>
            <input type="text" disabled value={currentUser?.roomNo || 'OPD Room 204'} className="w-full px-3 py-2 border rounded-lg bg-slate-50" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Consultation Timings</label>
            <input type="text" disabled value={currentUser?.availableHours || '09:00 AM - 02:00 PM'} className="w-full px-3 py-2 border rounded-lg bg-slate-50" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Working Days</label>
            <input type="text" disabled value={currentUser?.availableDays?.join(', ') || 'Monday - Friday'} className="w-full px-3 py-2 border rounded-lg bg-slate-50" />
          </div>
        </div>
      </div>
      {renderDoctorModals()}
    </DashboardLayout>
  );

  // Helper to render doctor modals
  function renderDoctorModals() {
    return (
      <>
        {/* Full Consultation Modal */}
        <Modal
          isOpen={activeModal === 'consultation'}
          onClose={() => setActiveModal(null)}
          title={`Doctor Clinical Consultation: ${consultForm.patientName}`}
          maxWidth="max-w-3xl"
        >
          <form onSubmit={handleSaveConsultation} className="space-y-4 text-xs">
            <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border">
              <div>
                <label className="block font-semibold text-slate-600 mb-0.5">Blood Pressure</label>
                <input
                  type="text"
                  value={consultForm.bp}
                  onChange={(e) => setConsultForm({ ...consultForm, bp: e.target.value })}
                  className="w-full px-2 py-1.5 border rounded bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-0.5">Pulse Rate</label>
                <input
                  type="text"
                  value={consultForm.pulse}
                  onChange={(e) => setConsultForm({ ...consultForm, pulse: e.target.value })}
                  className="w-full px-2 py-1.5 border rounded bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-0.5">Body Temp</label>
                <input
                  type="text"
                  value={consultForm.temperature}
                  onChange={(e) => setConsultForm({ ...consultForm, temperature: e.target.value })}
                  className="w-full px-2 py-1.5 border rounded bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-0.5">Weight</label>
                <input
                  type="text"
                  value={consultForm.weight}
                  onChange={(e) => setConsultForm({ ...consultForm, weight: e.target.value })}
                  className="w-full px-2 py-1.5 border rounded bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Primary Clinical Diagnosis *</label>
              <input
                type="text"
                required
                value={consultForm.diagnosis}
                onChange={(e) => setConsultForm({ ...consultForm, diagnosis: e.target.value })}
                placeholder="e.g. Essential Hypertension Stage 1 / Migraine without aura"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Physician Clinical Notes & Recommendations *</label>
              <textarea
                rows={4}
                required
                value={consultForm.notes}
                onChange={(e) => setConsultForm({ ...consultForm, notes: e.target.value })}
                placeholder="Enter physical examination findings, heart sounds, symptoms history, and follow-up advice..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            {/* Quick Action Toggles */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-2 p-3 bg-slate-50 border rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={consultForm.prescribeNow}
                  onChange={(e) => setConsultForm({ ...consultForm, prescribeNow: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="font-semibold text-slate-800">Generate Prescription with this Consultation</span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-slate-50 border rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={consultForm.orderLabNow}
                  onChange={(e) => setConsultForm({ ...consultForm, orderLabNow: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="font-semibold text-slate-800">Order Diagnostic Lab Panel</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg">
                Complete Consultation & Save Record
              </button>
            </div>
          </form>
        </Modal>

        {/* Create Standalone Prescription Modal */}
        <Modal
          isOpen={activeModal === 'newPrescription'}
          onClose={() => setActiveModal(null)}
          title="Create New Electronic Prescription"
          maxWidth="max-w-3xl"
        >
          <form onSubmit={handleSavePrescription} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Select Patient *</label>
                <select
                  value={rxForm.patientId}
                  onChange={(e) => {
                    const pat = patients.find(p => p.id === e.target.value);
                    setRxForm({ ...rxForm, patientId: e.target.value, patientName: pat?.name || 'Patient' });
                  }}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Diagnosis *</label>
                <input
                  type="text"
                  required
                  value={rxForm.diagnosis}
                  onChange={(e) => setRxForm({ ...rxForm, diagnosis: e.target.value })}
                  placeholder="e.g. Acute Bronchitis / Hypertension"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900">Medications List</span>
                <button
                  type="button"
                  onClick={handleAddMedicineRow}
                  className="px-2 py-1 text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Drug
                </button>
              </div>

              <div className="space-y-2">
                {rxForm.medicinesList.map((med, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border rounded-lg grid grid-cols-1 sm:grid-cols-6 gap-2 items-center">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-slate-500">Medicine Name</label>
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => {
                          const updated = [...rxForm.medicinesList];
                          updated[idx].name = e.target.value;
                          setRxForm({ ...rxForm, medicinesList: updated });
                        }}
                        className="w-full px-2 py-1 border rounded bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">Dosage</label>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => {
                          const updated = [...rxForm.medicinesList];
                          updated[idx].dosage = e.target.value;
                          setRxForm({ ...rxForm, medicinesList: updated });
                        }}
                        className="w-full px-2 py-1 border rounded bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">Frequency</label>
                      <input
                        type="text"
                        value={med.frequency}
                        onChange={(e) => {
                          const updated = [...rxForm.medicinesList];
                          updated[idx].frequency = e.target.value;
                          setRxForm({ ...rxForm, medicinesList: updated });
                        }}
                        className="w-full px-2 py-1 border rounded bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">Duration</label>
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => {
                          const updated = [...rxForm.medicinesList];
                          updated[idx].duration = e.target.value;
                          setRxForm({ ...rxForm, medicinesList: updated });
                        }}
                        className="w-full px-2 py-1 border rounded bg-white text-xs"
                      />
                    </div>
                    <div className="text-right">
                      {rxForm.medicinesList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicineRow(idx)}
                          className="p-1 text-rose-600 hover:bg-rose-100 rounded mt-3"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Doctor's Dietary / Lifestyle Advice</label>
              <textarea
                rows={2}
                value={rxForm.instructions}
                onChange={(e) => setRxForm({ ...rxForm, instructions: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setActiveModal(null)} className="px-3 py-1.5 border rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700">
                Save & Issue Prescription
              </button>
            </div>
          </form>
        </Modal>

        {/* Order Lab Test Modal */}
        <Modal
          isOpen={activeModal === 'orderLabTest'}
          onClose={() => setActiveModal(null)}
          title="Order Diagnostic Laboratory Test"
        >
          <form onSubmit={handleSaveLabOrder} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Patient *</label>
                <select
                  value={labOrderForm.patientId}
                  onChange={(e) => {
                    const pat = patients.find(p => p.id === e.target.value);
                    setLabOrderForm({ ...labOrderForm, patientId: e.target.value, patientName: pat?.name || 'Patient' });
                  }}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Priority *</label>
                <select
                  value={labOrderForm.priority}
                  onChange={(e) => setLabOrderForm({ ...labOrderForm, priority: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="Routine">Routine</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Test Name *</label>
              <input
                type="text"
                required
                value={labOrderForm.testName}
                onChange={(e) => setLabOrderForm({ ...labOrderForm, testName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={labOrderForm.category}
                  onChange={(e) => setLabOrderForm({ ...labOrderForm, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="Hematology">Hematology</option>
                  <option value="Biochemistry">Biochemistry</option>
                  <option value="Serology">Serology</option>
                  <option value="Microbiology">Microbiology</option>
                  <option value="Pathology">Pathology</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Sample Type</label>
                <input
                  type="text"
                  value={labOrderForm.sampleType}
                  onChange={(e) => setLabOrderForm({ ...labOrderForm, sampleType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Clinical Instructions for Lab Technician</label>
              <textarea
                rows={2}
                value={labOrderForm.notes}
                onChange={(e) => setLabOrderForm({ ...labOrderForm, notes: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setActiveModal(null)} className="px-3 py-1.5 border rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-1.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700">
                Submit Test Order to Laboratory
              </button>
            </div>
          </form>
        </Modal>

        {/* View Patient Details Modal */}
        <Modal
          isOpen={activeModal === 'viewPatient'}
          onClose={() => setActiveModal(null)}
          title={`Patient Medical Card: ${selectedRecord?.name || ''}`}
        >
          {selectedRecord && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-4 rounded-xl border">
                <div><strong>Patient ID:</strong> {selectedRecord.id}</div>
                <div><strong>Blood Group:</strong> <span className="text-rose-600 font-bold">{selectedRecord.bloodGroup || 'O+'}</span></div>
                <div><strong>DOB / Age:</strong> {selectedRecord.dob || '1988-05-14'} ({selectedRecord.age || 38} Yrs)</div>
                <div><strong>Gender:</strong> {selectedRecord.gender || 'Male'}</div>
                <div><strong>Phone:</strong> {selectedRecord.phone}</div>
                <div><strong>Emergency Contact:</strong> {selectedRecord.emergencyContact || 'N/A'}</div>
                <div className="col-span-2"><strong>Allergies:</strong> {selectedRecord.allergies || 'None reported'}</div>
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
          isOpen={activeModal === 'viewReport'}
          onClose={() => setActiveModal(null)}
          title="Laboratory Investigation Findings"
          documentData={selectedRecord}
          type="labReport"
        />

        {/* Cancel Appointment Dialog */}
        <ConfirmDialog
          isOpen={activeModal === 'cancelAppt'}
          onClose={() => setActiveModal(null)}
          onConfirm={() => {
            if (selectedRecord) updateAppointmentStatus(selectedRecord.id, 'Cancelled');
          }}
          title="Cancel Consultation Appointment?"
          message={`Cancel consultation appointment ${selectedRecord?.id} for patient ${selectedRecord?.patientName}?`}
          confirmText="Yes, Cancel"
        />
      </>
    );
  }
};
