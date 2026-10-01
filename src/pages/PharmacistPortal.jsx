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
  Pill,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Edit,
  Trash2,
  Printer,
  Eye,
  Activity,
  Package,
  Boxes,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const PharmacistPortal = ({ view = 'dashboard' }) => {
  const {
    currentUser,
    prescriptions,
    dispensePrescription,
    medicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    activityLogs
  } = useHospital();

  const navigate = useNavigate();

  // Modals
  const [activeModal, setActiveModal] = useState(null); // 'dispense', 'addMed', 'editMed', 'deleteMed', 'printRx', 'viewMed'
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Medicine Form State
  const [medForm, setMedForm] = useState({
    name: '',
    category: 'Antibiotics',
    genericName: '',
    stock: 100,
    unit: 'Tablets',
    minThreshold: 30,
    batchNo: 'BATCH-2026-01',
    expiryDate: '2027-12-31',
    price: 15.00,
    manufacturer: 'Pfizer Global Health'
  });

  // Handle Add Medicine
  const handleSaveMedicine = (e) => {
    e.preventDefault();
    if (activeModal === 'editMed' && selectedRecord) {
      updateMedicine(selectedRecord.id, medForm);
    } else {
      addMedicine(medForm);
    }
    setActiveModal(null);
  };

  // Handle Dispense
  const handleConfirmDispense = () => {
    if (selectedRecord) {
      dispensePrescription(selectedRecord.id);
      setActiveModal(null);
      alert(`Prescription ${selectedRecord.id} successfully dispensed and inventory stocks updated!`);
    }
  };

  const pendingRx = prescriptions.filter(p => p.status === 'Pending');
  const dispensedRx = prescriptions.filter(p => p.status === 'Dispensed');
  const lowStockMeds = medicines.filter(m => m.status === 'Low Stock' || m.status === 'Expired');

  // 1. Dashboard View (Strictly Operational - No Statistics)
  if (view === 'dashboard') {
    return (
      <DashboardLayout title="Central Pharmacy Management">
        <PageHeader
          title="Pharmacy Operations & Dispensing Desk"
          subtitle="Electronic prescription verification, stock maintenance, and drug dispensing"
          actionButton={
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMedForm({
                    name: '',
                    category: 'Cardiovascular',
                    genericName: '',
                    stock: 100,
                    unit: 'Tablets',
                    minThreshold: 30,
                    batchNo: 'MED-2026-X',
                    expiryDate: '2027-12-31',
                    price: 10.00,
                    manufacturer: 'Standard Pharma'
                  });
                  setActiveModal('addMed');
                }}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" /> Add New Medicine
              </button>
            </div>
          }
        />

        {/* Operational Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <OperationalCard
            title="Pending Prescriptions"
            count={`${pendingRx.length} Orders`}
            description="Waiting for pharmacist dispensing"
            icon={Clock}
            color="amber"
            actionLink="/pharmacist/dispense"
            actionLabel="Open Dispense Queue"
          />
          <OperationalCard
            title="Dispensed Prescriptions"
            count={`${dispensedRx.length} Fulfilled`}
            description="Completed and released to patients"
            icon={CheckCircle2}
            color="emerald"
            actionLink="/pharmacist/prescriptions"
            actionLabel="View Records"
          />
          <OperationalCard
            title="Total Medicines in Stock"
            count={`${medicines.length} Types`}
            description="Active hospital formulary inventory"
            icon={Pill}
            color="blue"
            actionLink="/pharmacist/medicines"
            actionLabel="Medicine Catalog"
          />
          <OperationalCard
            title="Stock Alerts"
            count={`${lowStockMeds.length} Items`}
            description="Low stock or expired medications"
            icon={AlertTriangle}
            color="red"
            actionLink="/pharmacist/inventory"
            actionLabel="Inspect Inventory"
          />
        </div>

        {/* Split Operational Views */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Pending Prescriptions Queue */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-amber-600" /> Pending Dispensing Queue
                </h3>
                <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                  {pendingRx.length} Pending
                </span>
              </div>

              <div className="mt-3 divide-y divide-slate-100 text-xs">
                {pendingRx.length > 0 ? (
                  pendingRx.map((rx) => (
                    <div key={rx.id} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{rx.patientName}</span>
                          <span className="font-mono text-slate-400 font-normal">({rx.id})</span>
                          <StatusBadge status={rx.status} />
                        </div>
                        <div className="text-slate-500 mt-0.5">
                          Prescribed by <strong>{rx.doctorName}</strong> &bull; {rx.date}
                        </div>
                        <div className="text-emerald-700 font-medium mt-1">
                          {rx.medicines?.map(m => `${m.name} (${m.quantity || 10} ${m.dosage})`).join(', ')}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setSelectedRecord(rx); setActiveModal('dispense'); }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition"
                        >
                          Dispense
                        </button>
                        <button
                          onClick={() => { setSelectedRecord(rx); setActiveModal('printRx'); }}
                          className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">All pending prescriptions have been dispensed.</div>
                )}
              </div>
            </div>

            {/* Recently Dispensed Logs */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Recently Fulfilled Prescriptions
              </h3>
              <div className="mt-3 divide-y divide-slate-100 text-xs">
                {dispensedRx.slice(0, 3).map((rx) => (
                  <div key={rx.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{rx.patientName} &bull; <span className="font-mono text-slate-500">{rx.id}</span></div>
                      <div className="text-slate-500 text-[11px]">{rx.medicines?.map(m => m.name).join(', ')}</div>
                    </div>
                    <span className="text-[11px] text-slate-400">Dispensed on {rx.dispensedDate || rx.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Low Stock Alerts & Inventory Attention */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Medicines Requiring Attention
                </h3>
                <span className="text-xs text-rose-600 font-semibold">{lowStockMeds.length} Items</span>
              </div>

              <div className="mt-3 space-y-2.5 text-xs">
                {lowStockMeds.map((med) => (
                  <div key={med.id} className="p-3 bg-rose-50/50 rounded-lg border border-rose-200/70 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{med.name}</div>
                      <div className="text-[11px] text-slate-500">Stock: <strong>{med.stock} {med.unit}</strong> (Min: {med.minThreshold})</div>
                      <div className="text-[10px] text-slate-400">Exp: {med.expiryDate} &bull; {med.manufacturer}</div>
                    </div>
                    <StatusBadge status={med.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Pharmacy Operational Logs */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">Dispensing Audit Stream</h3>
              <div className="mt-3 space-y-2.5 text-xs">
                {activityLogs.filter(l => l.action.includes('Prescription') || l.action.includes('Medicine')).slice(0, 4).map((log) => (
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

        {renderPharmacistModals()}
      </DashboardLayout>
    );
  }

  // 2. Prescriptions Page
  if (view === 'prescriptions') {
    const filtered = prescriptions.filter(p => {
      const matchSearch = p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter ? p.status === statusFilter : true;
      return matchSearch && matchStatus;
    });

    const columns = [
      { header: 'Rx ID', accessor: 'id', cellClassName: 'font-semibold text-slate-900 font-mono' },
      { header: 'Patient Name', accessor: 'patientName', cellClassName: 'font-medium text-slate-900' },
      { header: 'Prescribing Doctor', render: (row) => `${row.doctorName} (${row.department})` },
      { header: 'Date', accessor: 'date' },
      { header: 'Diagnosis', accessor: 'diagnosis', className: 'max-w-xs truncate' },
      {
        header: 'Drugs Included',
        render: (row) => (
          <div className="text-xs text-slate-700">
            {row.medicines?.map(m => m.name).join(', ')}
          </div>
        )
      },
      { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
      {
        header: 'Pharmacy Actions',
        render: (row) => (
          <div className="flex items-center gap-1.5">
            {row.status === 'Pending' && (
              <button
                onClick={() => { setSelectedRecord(row); setActiveModal('dispense'); }}
                className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
              >
                Dispense
              </button>
            )}
            <button
              onClick={() => { setSelectedRecord(row); setActiveModal('printRx'); }}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              title="Print Prescription"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        )
      }
    ];

    return (
      <DashboardLayout title="Prescriptions Fulfillment">
        <PageHeader
          title="Prescriptions Registry"
          subtitle="Verify doctor medical prescriptions and manage drug release"
        />

        <SearchFilterBar
          searchPlaceholder="Search by patient, doctor, or Rx ID..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: [
                { label: 'Pending', value: 'Pending' },
                { label: 'Dispensed', value: 'Dispensed' }
              ]
            }
          ]}
          selectedFilters={{ status: statusFilter }}
          onFilterChange={(_, val) => setStatusFilter(val)}
          onReset={() => { setSearchTerm(''); setStatusFilter(''); }}
        />

        <DataTable columns={columns} data={filtered} emptyMessage="No prescriptions found." />
        {renderPharmacistModals()}
      </DashboardLayout>
    );
  }

  // 3. Medicines Catalog
  if (view === 'medicines') {
    const filtered = medicines.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter ? m.status === statusFilter : true;
      return matchSearch && matchStatus;
    });

    const columns = [
      { header: 'Medicine ID', accessor: 'id', cellClassName: 'font-semibold text-slate-900 font-mono' },
      {
        header: 'Medicine Name',
        accessor: 'name',
        render: (row) => (
          <div>
            <div className="font-semibold text-slate-900">{row.name}</div>
            <div className="text-[11px] text-slate-400">{row.genericName} &bull; {row.manufacturer}</div>
          </div>
        )
      },
      { header: 'Category', accessor: 'category' },
      { header: 'Quantity in Stock', render: (row) => <span className="font-bold text-slate-800">{row.stock} {row.unit}</span> },
      { header: 'Unit Price', render: (row) => `$${Number(row.price).toFixed(2)}` },
      { header: 'Expiry Date', accessor: 'expiryDate' },
      { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
      {
        header: 'Actions',
        render: (row) => (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setSelectedRecord(row);
                setMedForm({ ...row });
                setActiveModal('editMed');
              }}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
              title="Edit Medicine"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setSelectedRecord(row); setActiveModal('deleteMed'); }}
              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
              title="Remove Medicine"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )
      }
    ];

    return (
      <DashboardLayout title="Hospital Formulary Medicines">
        <PageHeader
          title="Medicines Master List"
          subtitle="Formulary drugs database, dosages, manufacturer batches, and unit rates"
          actionButton={
            <button
              onClick={() => {
                setMedForm({
                  name: '',
                  category: 'Antibiotics',
                  genericName: '',
                  stock: 100,
                  unit: 'Tablets',
                  minThreshold: 30,
                  batchNo: 'BATCH-2026-X',
                  expiryDate: '2027-12-31',
                  price: 12.00,
                  manufacturer: 'Standard Pharma'
                });
                setActiveModal('addMed');
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add Medicine
            </button>
          }
        />

        <SearchFilterBar
          searchPlaceholder="Search by medicine name, generic name, or ID..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filters={[
            {
              key: 'status',
              label: 'Stock Status',
              options: [
                { label: 'Available', value: 'Available' },
                { label: 'Low Stock', value: 'Low Stock' },
                { label: 'Expired', value: 'Expired' }
              ]
            }
          ]}
          selectedFilters={{ status: statusFilter }}
          onFilterChange={(_, val) => setStatusFilter(val)}
          onReset={() => { setSearchTerm(''); setStatusFilter(''); }}
        />

        <DataTable columns={columns} data={filtered} emptyMessage="No medicines found." />
        {renderPharmacistModals()}
      </DashboardLayout>
    );
  }

  // 4. Stock & Inventory Management
  if (view === 'inventory') {
    return (
      <DashboardLayout title="Pharmacy Inventory & Stock Levels">
        <PageHeader
          title="Stock & Inventory Control"
          subtitle="Batch inspection, minimum stock thresholds, and expiry surveillance"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((med) => (
            <div key={med.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{med.name}</h4>
                  <p className="text-slate-500 text-[11px]">{med.category}</p>
                </div>
                <StatusBadge status={med.status} />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Stock:</span>
                  <span className="font-bold text-slate-900">{med.stock} {med.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Safety Threshold:</span>
                  <span className="text-slate-700">{med.minThreshold || 30} {med.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Batch Number:</span>
                  <span className="font-mono text-slate-700">{med.batchNo || 'AML-2025'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expiry Date:</span>
                  <span className={new Date(med.expiryDate) < new Date() ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                    {med.expiryDate}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500 text-[11px]">{med.manufacturer}</span>
                <button
                  onClick={() => {
                    setSelectedRecord(med);
                    setMedForm({ ...med });
                    setActiveModal('editMed');
                  }}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
                >
                  Adjust Stock
                </button>
              </div>
            </div>
          ))}
        </div>
        {renderPharmacistModals()}
      </DashboardLayout>
    );
  }

  // 5. Dispense Dedicated View
  if (view === 'dispense') {
    return (
      <DashboardLayout title="Prescription Dispensing Terminal">
        <PageHeader
          title="Direct Dispensing Terminal"
          subtitle="Validate electronic prescriptions and deduct medicine quantities from stock"
        />

        <div className="space-y-4 max-w-4xl mx-auto">
          {pendingRx.length > 0 ? (
            pendingRx.map((rx) => (
              <div key={rx.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">Prescription #{rx.id}</span>
                    <p className="text-slate-500 mt-0.5">
                      Patient: <strong>{rx.patientName}</strong> &bull; Doctor: <strong>{rx.doctorName}</strong> ({rx.department})
                    </p>
                  </div>
                  <StatusBadge status={rx.status} />
                </div>

                <div className="bg-slate-50 p-3 rounded-lg text-slate-700">
                  <strong>Clinical Diagnosis:</strong> {rx.diagnosis}
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Drugs to Dispense</h4>
                  <table className="w-full text-left border">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-2 border">Medicine</th>
                        <th className="p-2 border">Dosage</th>
                        <th className="p-2 border">Frequency</th>
                        <th className="p-2 border">Duration</th>
                        <th className="p-2 border">Dispense Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rx.medicines?.map((m, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-2 border font-medium">{m.name}</td>
                          <td className="p-2 border">{m.dosage}</td>
                          <td className="p-2 border">{m.frequency}</td>
                          <td className="p-2 border">{m.duration}</td>
                          <td className="p-2 border font-bold text-rose-600">{m.quantity || 30} units</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    onClick={() => { setSelectedRecord(rx); setActiveModal('printRx'); }}
                    className="px-3 py-1.5 border rounded-lg hover:bg-slate-50 flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Rx
                  </button>
                  <button
                    onClick={() => { setSelectedRecord(rx); setActiveModal('dispense'); }}
                    className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs"
                  >
                    Verify & Confirm Dispensing
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 text-center text-slate-400 rounded-xl border border-slate-200 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              All current prescriptions have been dispensed. No pending queues.
            </div>
          )}
        </div>
        {renderPharmacistModals()}
      </DashboardLayout>
    );
  }

  // 6. Profile
  return (
    <DashboardLayout title="Pharmacist Profile">
      <PageHeader title="Staff Profile" subtitle="Central pharmacy workstation credentials" />
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl border border-slate-200 text-xs space-y-3">
        <div className="font-bold text-sm text-slate-900">{currentUser?.name || 'James Wilson'}</div>
        <div className="text-slate-500">Role: Registered Pharmacist</div>
        <div className="text-slate-500">Department: Central In-House Pharmacy</div>
        <div className="text-slate-500">Email: {currentUser?.email || 'pharmacy@carepoint.com'}</div>
      </div>
      {renderPharmacistModals()}
    </DashboardLayout>
  );

  // Helper modals
  function renderPharmacistModals() {
    return (
      <>
        {/* Dispense Confirmation Modal */}
        <Modal
          isOpen={activeModal === 'dispense'}
          onClose={() => setActiveModal(null)}
          title={`Dispense Prescription #${selectedRecord?.id || ''}`}
        >
          {selectedRecord && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                You are about to dispense medications for <strong>{selectedRecord.patientName}</strong> prescribed by <strong>{selectedRecord.doctorName}</strong>.
              </p>

              <div className="bg-slate-50 p-3 rounded-lg border space-y-1">
                <div className="font-bold text-slate-900">Medications & Auto Stock Deduction:</div>
                <ul className="list-disc list-inside text-slate-600">
                  {selectedRecord.medicines?.map((m, i) => (
                    <li key={i}>{m.name} - {m.quantity || 30} units ({m.dosage}, {m.frequency})</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-[11px]">
                Upon confirmation, inventory quantities for these medicines will be deducted automatically in the system.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button onClick={() => setActiveModal(null)} className="px-3 py-1.5 border rounded-lg">Cancel</button>
                <button
                  onClick={handleConfirmDispense}
                  className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Confirm & Release Medication
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Add / Edit Medicine Modal */}
        <Modal
          isOpen={activeModal === 'addMed' || activeModal === 'editMed'}
          onClose={() => setActiveModal(null)}
          title={activeModal === 'editMed' ? `Edit Medicine: ${selectedRecord?.name}` : 'Add New Medicine to Formulary'}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSaveMedicine} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={medForm.name}
                  onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                  placeholder="e.g. Amlodipine 5mg"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Generic / Chemical Name *</label>
                <input
                  type="text"
                  required
                  value={medForm.genericName}
                  onChange={(e) => setMedForm({ ...medForm, genericName: e.target.value })}
                  placeholder="e.g. Amlodipine Besylate"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Therapeutic Category *</label>
                <select
                  value={medForm.category}
                  onChange={(e) => setMedForm({ ...medForm, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="Cardiovascular">Cardiovascular</option>
                  <option value="Antibiotics">Antibiotics</option>
                  <option value="Respiratory">Respiratory</option>
                  <option value="Antihistamine">Antihistamine</option>
                  <option value="Analgesic / Antipyretic">Analgesic / Antipyretic</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Gastroenterology">Gastroenterology</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  required
                  value={medForm.stock}
                  onChange={(e) => setMedForm({ ...medForm, stock: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Unit of Measurement</label>
                <select
                  value={medForm.unit}
                  onChange={(e) => setMedForm({ ...medForm, unit: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="Tablets">Tablets</option>
                  <option value="Capsules">Capsules</option>
                  <option value="Vials">Vials</option>
                  <option value="Bottles">Bottles</option>
                  <option value="Tubes">Tubes</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Unit Selling Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={medForm.price}
                  onChange={(e) => setMedForm({ ...medForm, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Batch Number</label>
                <input
                  type="text"
                  value={medForm.batchNo}
                  onChange={(e) => setMedForm({ ...medForm, batchNo: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Expiry Date *</label>
                <input
                  type="date"
                  required
                  value={medForm.expiryDate}
                  onChange={(e) => setMedForm({ ...medForm, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Pharmaceutical Manufacturer</label>
              <input
                type="text"
                value={medForm.manufacturer}
                onChange={(e) => setMedForm({ ...medForm, manufacturer: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setActiveModal(null)} className="px-3 py-1.5 border rounded-lg">Cancel</button>
              <button type="submit" className="px-5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg">
                Save Medicine
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Medicine Confirmation */}
        <ConfirmDialog
          isOpen={activeModal === 'deleteMed'}
          onClose={() => setActiveModal(null)}
          onConfirm={() => {
            if (selectedRecord) deleteMedicine(selectedRecord.id);
          }}
          title="Delete Medicine from Inventory?"
          message={`Are you sure you want to remove ${selectedRecord?.name} from active inventory?`}
          confirmText="Yes, Delete"
        />

        {/* Printable Rx */}
        <PrintableDocumentModal
          isOpen={activeModal === 'printRx'}
          onClose={() => setActiveModal(null)}
          title="Electronic Prescription"
          documentData={selectedRecord}
          type="prescription"
        />
      </>
    );
  }
};
