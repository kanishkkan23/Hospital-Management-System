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
  FlaskConical,
  Clock,
  CheckCircle2,
  FileText,
  Eye,
  Plus,
  Trash2,
  Printer,
  ChevronRight,
  Activity,
  AlertTriangle,
  Play
} from 'lucide-react';

export const LabTechnicianPortal = ({ view = 'dashboard' }) => {
  const {
    currentUser,
    labTests,
    updateLabTestStatus,
    labReports,
    submitLabReport,
    activityLogs
  } = useHospital();

  const navigate = useNavigate();

  // Modals
  const [activeModal, setActiveModal] = useState(null); // 'processReport', 'viewReport', 'viewTestDetails'
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Result Entry Form State
  const [reportForm, setReportForm] = useState({
    testId: '',
    patientId: '',
    patientName: '',
    doctorId: '',
    doctorName: '',
    testName: '',
    category: 'Hematology',
    sampleType: 'Whole Blood (EDTA)',
    parameters: [
      { parameter: 'Hemoglobin (Hb)', result: '14.5', unit: 'g/dL', referenceRange: '13.5 - 17.5', status: 'Normal' },
      { parameter: 'Total Leucocyte Count (TLC)', result: '6,500', unit: '/cumm', referenceRange: '4,000 - 11,000', status: 'Normal' },
      { parameter: 'Platelet Count', result: '250,000', unit: '/cumm', referenceRange: '150,000 - 450,000', status: 'Normal' }
    ],
    remarks: 'Sample indices within physiological reference limits.',
    technicianNotes: 'Processed on automated calibrated analyzer without pre-analytical hemolysis.'
  });

  const handleAddParameter = () => {
    setReportForm({
      ...reportForm,
      parameters: [
        ...reportForm.parameters,
        { parameter: 'New Parameter', result: '', unit: '', referenceRange: '', status: 'Normal' }
      ]
    });
  };

  const handleRemoveParameter = (index) => {
    setReportForm({
      ...reportForm,
      parameters: reportForm.parameters.filter((_, i) => i !== index)
    });
  };

  // Open Report Builder for Test
  const handleStartReport = (test) => {
    setSelectedRecord(test);
    setReportForm({
      testId: test.id,
      patientId: test.patientId,
      patientName: test.patientName,
      doctorId: test.doctorId,
      doctorName: test.doctorName,
      testName: test.testName,
      category: test.category || 'Biochemistry',
      sampleType: test.sampleType || 'Venous Blood',
      parameters: [
        { parameter: test.testName.includes('Lipid') ? 'Total Cholesterol' : 'Observed Parameter', result: '185', unit: 'mg/dL', referenceRange: '< 200', status: 'Normal' },
        { parameter: test.testName.includes('Lipid') ? 'Triglycerides' : 'Secondary Parameter', result: '140', unit: 'mg/dL', referenceRange: '< 150', status: 'Normal' }
      ],
      remarks: 'All test values within biological reference range. Verified by pathology bench.',
      technicianNotes: 'Calibrated specimen run.'
    });
    setActiveModal('processReport');
  };

  // Save and Complete Lab Report
  const handleSaveReport = (e) => {
    e.preventDefault();
    submitLabReport({
      testId: reportForm.testId,
      patientId: reportForm.patientId,
      patientName: reportForm.patientName,
      doctorId: reportForm.doctorId,
      doctorName: reportForm.doctorName,
      testName: reportForm.testName,
      category: reportForm.category,
      sampleType: reportForm.sampleType,
      parameters: reportForm.parameters,
      remarks: reportForm.remarks,
      technicianNotes: reportForm.technicianNotes
    });

    setActiveModal(null);
    alert(`Report for ${reportForm.testName} successfully generated and released to Doctor and Patient!`);
  };

  const pendingTests = labTests.filter(t => t.status === 'Requested');
  const inProgressTests = labTests.filter(t => t.status === 'In Progress');
  const completedTests = labTests.filter(t => t.status === 'Completed');

  // 1. Dashboard View (Strictly Operational - No Statistics)
  if (view === 'dashboard') {
    return (
      <DashboardLayout title="Diagnostic Pathology & Lab Portal">
        <PageHeader
          title="Laboratory Workstation & Analysis"
          subtitle="Process doctor test requisitions, record assay values, and publish verified reports"
        />

        {/* Operational Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <OperationalCard
            title="Pending Test Requests"
            count={`${pendingTests.length} Samples`}
            description="Specimens awaiting lab analysis"
            icon={Clock}
            color="red"
            actionLink="/lab/pending"
            actionLabel="View Queue"
          />
          <OperationalCard
            title="In-Progress Analyses"
            count={`${inProgressTests.length} Testing`}
            description="Specimens on laboratory analyzer"
            icon={FlaskConical}
            color="amber"
            actionLink="/lab/tests"
            actionLabel="Active Bench"
          />
          <OperationalCard
            title="Completed Reports"
            count={`${labReports.length} Reports`}
            description="Published to Doctor & Patient portals"
            icon={CheckCircle2}
            color="emerald"
            actionLink="/lab/completed"
            actionLabel="Completed Archives"
          />
          <OperationalCard
            title="Urgent / STAT Orders"
            count={`${labTests.filter(t => t.priority === 'Urgent' || t.priority === 'Emergency').length} Urgent`}
            description="High clinical priority requisitions"
            icon={AlertTriangle}
            color="purple"
            actionLink="/lab/tests"
            actionLabel="Priority Queue"
          />
        </div>

        {/* Split Operational Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Active Diagnostic Queue */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-purple-600" /> Pending & Active Lab Tests
                </h3>
                <span className="text-xs bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded border border-purple-200">
                  {pendingTests.length + inProgressTests.length} Active
                </span>
              </div>

              <div className="mt-3 divide-y divide-slate-100 text-xs">
                {labTests.filter(t => t.status !== 'Completed').length > 0 ? (
                  labTests.filter(t => t.status !== 'Completed').map((test) => (
                    <div key={test.id} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{test.testName}</span>
                          <span className="font-mono text-slate-400 font-normal">({test.id})</span>
                          <StatusBadge status={test.priority} />
                          <StatusBadge status={test.status} />
                        </div>
                        <div className="text-slate-500 mt-0.5">
                          Patient: <strong>{test.patientName}</strong> &bull; Referring: <strong>{test.doctorName}</strong>
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          Sample: {test.sampleType || 'Venous Blood'} &bull; Ordered: {test.requestedDate}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {test.status === 'Requested' && (
                          <button
                            onClick={() => updateLabTestStatus(test.id, 'In Progress')}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg flex items-center gap-1"
                          >
                            <Play className="w-3.5 h-3.5" /> Start
                          </button>
                        )}
                        <button
                          onClick={() => handleStartReport(test)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-xs"
                        >
                          Enter Results
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">All requested lab tests have been completed!</div>
                )}
              </div>
            </div>

            {/* Recently Published Reports */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Recently Published Diagnostic Findings
              </h3>
              <div className="mt-3 divide-y divide-slate-100 text-xs">
                {labReports.slice(0, 3).map((rep) => (
                  <div key={rep.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{rep.patientName} &bull; <span className="font-semibold text-rose-600">{rep.testName}</span></div>
                      <div className="text-[11px] text-slate-500">Verified by {rep.technicianName} on {rep.completedDate || rep.testDate}</div>
                    </div>
                    <button
                      onClick={() => { setSelectedRecord(rep); setActiveModal('viewReport'); }}
                      className="p-1.5 text-slate-500 hover:bg-slate-100 rounded"
                      title="Inspect Report"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Lab Stream & Equipment Health */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-600" /> Laboratory Audit Stream
              </h3>
              <div className="mt-3 space-y-2.5 text-xs">
                {activityLogs.filter(l => l.action.includes('Lab') || l.details.includes('lab')).slice(0, 5).map((log) => (
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

            {/* Quality Control & Calibration Card */}
            <div className="p-4 bg-slate-900 text-white rounded-xl text-xs space-y-2">
              <div className="font-bold flex items-center gap-2 text-rose-400">
                <FlaskConical className="w-4 h-4" /> Quality Control (QC) Status
              </div>
              <p className="text-slate-300">
                Automated 5-part hematology and clinical biochemistry analyzers passed daily calibration benchmarks with zero coefficient of variation drift.
              </p>
            </div>
          </div>
        </div>

        {renderLabModals()}
      </DashboardLayout>
    );
  }

  // 2. All Lab Tests View
  if (view === 'tests' || view === 'pending' || view === 'completed') {
    let filtered = labTests.filter(t => {
      const matchSearch = t.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter ? t.status === statusFilter : true;
      const matchPriority = priorityFilter ? t.priority === priorityFilter : true;
      return matchSearch && matchStatus && matchPriority;
    });

    if (view === 'pending') filtered = filtered.filter(t => t.status === 'Requested' || t.status === 'In Progress');
    if (view === 'completed') filtered = filtered.filter(t => t.status === 'Completed');

    const columns = [
      { header: 'Test ID', accessor: 'id', cellClassName: 'font-semibold text-slate-900 font-mono' },
      { header: 'Investigation', accessor: 'testName', cellClassName: 'font-medium text-slate-900' },
      { header: 'Patient Name', accessor: 'patientName' },
      { header: 'Referring Doctor', accessor: 'doctorName' },
      { header: 'Priority', accessor: 'priority', render: (row) => <StatusBadge status={row.priority} /> },
      { header: 'Requested Date', accessor: 'requestedDate' },
      { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
      {
        header: 'Bench Actions',
        render: (row) => {
          const matchingRep = labReports.find(r => r.testId === row.id || (r.patientName === row.patientName && r.testName === row.testName));
          return (
            <div className="flex items-center gap-1.5">
              {row.status !== 'Completed' ? (
                <button
                  onClick={() => handleStartReport(row)}
                  className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
                >
                  Enter Results
                </button>
              ) : (
                <button
                  onClick={() => { setSelectedRecord(matchingRep); setActiveModal('viewReport'); }}
                  className="px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg"
                >
                  View Report
                </button>
              )}
            </div>
          );
        }
      }
    ];

    return (
      <DashboardLayout title="Laboratory Requisitions">
        <PageHeader
          title={view === 'pending' ? 'Pending Lab Requisitions' : (view === 'completed' ? 'Completed Test Archives' : 'All Laboratory Tests')}
          subtitle="Process diagnostic specimens and document test findings"
        />

        <SearchFilterBar
          searchPlaceholder="Search by test name, patient, or doctor..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filters={[
            {
              key: 'status',
              label: 'Test Status',
              options: [
                { label: 'Requested', value: 'Requested' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Completed', value: 'Completed' }
              ]
            },
            {
              key: 'priority',
              label: 'Priority',
              options: [
                { label: 'Routine', value: 'Routine' },
                { label: 'Urgent', value: 'Urgent' },
                { label: 'Emergency', value: 'Emergency' }
              ]
            }
          ]}
          selectedFilters={{ status: statusFilter, priority: priorityFilter }}
          onFilterChange={(key, val) => {
            if (key === 'status') setStatusFilter(val);
            if (key === 'priority') setPriorityFilter(val);
          }}
          onReset={() => { setSearchTerm(''); setStatusFilter(''); setPriorityFilter(''); }}
        />

        <DataTable columns={columns} data={filtered} emptyMessage="No laboratory tests found." />
        {renderLabModals()}
      </DashboardLayout>
    );
  }

  // 3. Reports Direct View
  if (view === 'reports') {
    const columns = [
      { header: 'Report ID', accessor: 'id', cellClassName: 'font-semibold text-slate-900 font-mono' },
      { header: 'Test Name', accessor: 'testName', cellClassName: 'font-medium text-slate-900' },
      { header: 'Patient', accessor: 'patientName' },
      { header: 'Doctor', accessor: 'doctorName' },
      { header: 'Date Completed', render: (row) => row.completedDate || row.testDate },
      { header: 'Parameters', render: (row) => `${row.parameters?.length || 0} findings` },
      {
        header: 'Actions',
        render: (row) => (
          <button
            onClick={() => { setSelectedRecord(row); setActiveModal('viewReport'); }}
            className="px-3 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1"
          >
            <Printer className="w-3.5 h-3.5" /> View / Print
          </button>
        )
      }
    ];

    return (
      <DashboardLayout title="Completed Lab Reports Registry">
        <PageHeader
          title="Diagnostic Reports Registry"
          subtitle="Review, print, and verify final diagnostic pathology & biochemistry reports"
        />
        <DataTable columns={columns} data={labReports} emptyMessage="No lab reports found." />
        {renderLabModals()}
      </DashboardLayout>
    );
  }

  // 4. Profile
  return (
    <DashboardLayout title="Lab Technician Profile">
      <PageHeader title="Staff Profile" subtitle="Diagnostic laboratory workstation credentials" />
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl border border-slate-200 text-xs space-y-3">
        <div className="font-bold text-sm text-slate-900">{currentUser?.name || 'Dr. Priya Sharma'}</div>
        <div className="text-slate-500">Role: Senior Laboratory Technologist / Biochemist</div>
        <div className="text-slate-500">Department: Diagnostic Pathology & Biochemistry</div>
        <div className="text-slate-500">Email: {currentUser?.email || 'lab@carepoint.com'}</div>
      </div>
      {renderLabModals()}
    </DashboardLayout>
  );

  // Helper modals
  function renderLabModals() {
    return (
      <>
        {/* Enter Test Results & Generate Report Modal */}
        <Modal
          isOpen={activeModal === 'processReport'}
          onClose={() => setActiveModal(null)}
          title={`Generate Report: ${reportForm.testName} (${reportForm.patientName})`}
          maxWidth="max-w-3xl"
        >
          <form onSubmit={handleSaveReport} className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border">
              <div><strong>Patient:</strong> {reportForm.patientName} ({reportForm.patientId})</div>
              <div><strong>Referring Doctor:</strong> {reportForm.doctorName}</div>
              <div><strong>Specimen:</strong> {reportForm.sampleType}</div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900">Investigation Parameters & Observed Values</span>
                <button
                  type="button"
                  onClick={handleAddParameter}
                  className="px-2 py-1 text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Parameter
                </button>
              </div>

              <div className="space-y-2">
                {reportForm.parameters.map((param, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border rounded-lg grid grid-cols-1 sm:grid-cols-6 gap-2 items-center">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-slate-500">Parameter</label>
                      <input
                        type="text"
                        value={param.parameter}
                        onChange={(e) => {
                          const updated = [...reportForm.parameters];
                          updated[idx].parameter = e.target.value;
                          setReportForm({ ...reportForm, parameters: updated });
                        }}
                        className="w-full px-2 py-1 border rounded bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">Observed Value</label>
                      <input
                        type="text"
                        value={param.result}
                        onChange={(e) => {
                          const updated = [...reportForm.parameters];
                          updated[idx].result = e.target.value;
                          setReportForm({ ...reportForm, parameters: updated });
                        }}
                        className="w-full px-2 py-1 border rounded bg-white text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">Unit</label>
                      <input
                        type="text"
                        value={param.unit}
                        onChange={(e) => {
                          const updated = [...reportForm.parameters];
                          updated[idx].unit = e.target.value;
                          setReportForm({ ...reportForm, parameters: updated });
                        }}
                        className="w-full px-2 py-1 border rounded bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">Ref Interval</label>
                      <input
                        type="text"
                        value={param.referenceRange}
                        onChange={(e) => {
                          const updated = [...reportForm.parameters];
                          updated[idx].referenceRange = e.target.value;
                          setReportForm({ ...reportForm, parameters: updated });
                        }}
                        className="w-full px-2 py-1 border rounded bg-white text-xs"
                      />
                    </div>
                    <div className="text-right">
                      {reportForm.parameters.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveParameter(idx)}
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
              <label className="block font-semibold mb-1">Clinical Remarks / Interpretation *</label>
              <textarea
                rows={2}
                required
                value={reportForm.remarks}
                onChange={(e) => setReportForm({ ...reportForm, remarks: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Bench Notes & Verification</label>
              <input
                type="text"
                value={reportForm.technicianNotes}
                onChange={(e) => setReportForm({ ...reportForm, technicianNotes: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setActiveModal(null)} className="px-3 py-1.5 border rounded-lg">Cancel</button>
              <button type="submit" className="px-5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg">
                Verify & Publish Report
              </button>
            </div>
          </form>
        </Modal>

        {/* Printable Lab Report */}
        <PrintableDocumentModal
          isOpen={activeModal === 'viewReport'}
          onClose={() => setActiveModal(null)}
          title="Diagnostic Report"
          documentData={selectedRecord}
          type="labReport"
        />
      </>
    );
  }
};
