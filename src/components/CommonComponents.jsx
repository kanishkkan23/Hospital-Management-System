import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useHospital } from '../context/HospitalContext';
import {
  HeartPulse,
  LayoutDashboard,
  Calendar,
  CalendarPlus,
  Users,
  UserPlus,
  FileText,
  Pill,
  FlaskConical,
  Receipt,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Printer,
  ChevronRight,
  Shield,
  Activity,
  Stethoscope,
  Building2,
  Check,
  RefreshCw,
  UserCheck
} from 'lucide-react';

// Status Badge Component
export const StatusBadge = ({ status }) => {
  const getStyle = () => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'paid':
      case 'available':
      case 'normal':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'scheduled':
      case 'in progress':
      case 'low stock':
      case 'borderline high':
      case 'routine':
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled':
      case 'expired':
      case 'unpaid':
      case 'inactive':
      case 'emergency':
      case 'urgent':
      case 'no show':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'requested':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyle()}`}>
      {status}
    </span>
  );
};

// Modal Component
export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className={`relative bg-white rounded-xl shadow-xl w-full ${maxWidth} border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

// Confirmation Dialog Component
export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmColor = 'rose' }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{message}</p>
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => { onConfirm(); onClose(); }}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition ${
              confirmColor === 'rose' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-medical-600 hover:bg-medical-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Clean Search and Filter Bar (inspired by Library Management System)
export const SearchFilterBar = ({
  searchPlaceholder = 'Search records...',
  searchValue = '',
  onSearchChange,
  filters = [],
  onFilterChange,
  selectedFilters = {},
  onReset,
  children
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <div key={f.key} className="flex items-center">
              <select
                value={selectedFilters[f.key] || ''}
                onChange={(e) => onFilterChange(f.key, e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
              >
                <option value="">{f.label}: All</option>
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {(searchValue || Object.values(selectedFilters).some(Boolean)) && (
            <button
              onClick={onReset}
              className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Clear Filters
            </button>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

// Clean Data Table (inspired by Library Management System)
export const DataTable = ({
  columns,
  data,
  keyField = 'id',
  emptyMessage = 'No records found.',
  pagination = true,
  itemsPerPage = 8
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil((data?.length || 0) / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = pagination ? (data || []).slice(startIndex, startIndex + itemsPerPage) : data;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-medium">
              {columns.map((col, idx) => (
                <th key={idx} className={`py-3.5 px-4 font-semibold ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentData && currentData.length > 0 ? (
              currentData.map((row, rowIdx) => (
                <tr key={row[keyField] || rowIdx} className="hover:bg-rose-50/20 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`py-3.5 px-4 text-slate-700 ${col.cellClassName || ''}`}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && data?.length > itemsPerPage && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/30 text-xs text-slate-500">
          <div>
            Showing <span className="font-medium text-slate-700">{startIndex + 1}</span> to{' '}
            <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, data.length)}</span> of{' '}
            <span className="font-medium text-slate-700">{data.length}</span> records
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50"
            >
              Previous
            </button>
            <span className="px-2 font-medium text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Page Header
export const PageHeader = ({ title, subtitle, actionButton }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
};

// Operational Card (For non-statistical hospital summary tiles)
export const OperationalCard = ({ title, count, description, icon: Icon, color = 'red', actionLink, actionLabel = 'View All' }) => {
  const colorStyles = {
    red: 'bg-rose-50 text-rose-600 border-rose-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100'
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{count}</p>
          {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg border ${colorStyles[color] || colorStyles.red}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {actionLink && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
          <NavLink to={actionLink} className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1">
            {actionLabel} <ChevronRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>
      )}
    </div>
  );
};

// Print / View Report Modal
export const PrintableDocumentModal = ({ isOpen, onClose, title, documentData, type = 'prescription' }) => {
  if (!isOpen || !documentData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-3xl">
      <div id="printable-area" className="p-6 bg-white border border-slate-200 rounded-xl space-y-6 text-slate-800">
        {/* Hospital Letterhead */}
        <div className="flex items-center justify-between border-b-2 border-rose-600 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-600 flex items-center justify-center text-white">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-none">CarePoint Super Specialty Hospital</h2>
              <p className="text-xs text-slate-500 mt-0.5">Excellence in Healthcare & Patient Care</p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>742 Evergreen Healthcare Ave</p>
            <p>Phone: +1 (800) 456-7890 | Emergency: 911</p>
          </div>
        </div>

        {/* Dynamic content depending on type */}
        {type === 'prescription' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg text-xs">
              <div><strong>Rx ID:</strong> {documentData.id}</div>
              <div><strong>Date:</strong> {documentData.date}</div>
              <div><strong>Doctor:</strong> {documentData.doctorName} ({documentData.department})</div>
            </div>
            <div className="text-xs border p-3 rounded-lg grid grid-cols-2 gap-2">
              <div><strong>Patient Name:</strong> {documentData.patientName}</div>
              <div><strong>Patient ID:</strong> {documentData.patientId}</div>
              <div className="col-span-2"><strong>Diagnosis:</strong> {documentData.diagnosis}</div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-2">Prescribed Medicines</h4>
              <table className="w-full text-xs text-left border border-slate-200">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-2 border">Medicine</th>
                    <th className="p-2 border">Dosage</th>
                    <th className="p-2 border">Frequency</th>
                    <th className="p-2 border">Duration</th>
                    <th className="p-2 border">Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {documentData.medicines?.map((m, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2 border font-medium">{m.name}</td>
                      <td className="p-2 border">{m.dosage}</td>
                      <td className="p-2 border">{m.frequency}</td>
                      <td className="p-2 border">{m.duration}</td>
                      <td className="p-2 border">{m.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {documentData.instructions && (
              <div className="text-xs bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-900">
                <strong>Doctor's Advice:</strong> {documentData.instructions}
              </div>
            )}
          </div>
        )}

        {type === 'labReport' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg text-xs">
              <div><strong>Report ID:</strong> {documentData.id}</div>
              <div><strong>Test Date:</strong> {documentData.testDate || documentData.completedDate}</div>
              <div><strong>Technician:</strong> {documentData.technicianName || 'Dr. Priya Sharma'}</div>
            </div>
            <div className="text-xs border p-3 rounded-lg grid grid-cols-2 gap-2">
              <div><strong>Patient Name:</strong> {documentData.patientName}</div>
              <div><strong>Test Name:</strong> {documentData.testName}</div>
              <div><strong>Referring Doctor:</strong> {documentData.doctorName}</div>
              <div><strong>Sample:</strong> {documentData.sampleType || 'Venous Blood'}</div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-2">Test Findings & Reference Values</h4>
              <table className="w-full text-xs text-left border border-slate-200">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-2 border">Investigation Parameter</th>
                    <th className="p-2 border">Observed Value</th>
                    <th className="p-2 border">Unit</th>
                    <th className="p-2 border">Biological Reference Interval</th>
                    <th className="p-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {documentData.parameters?.map((p, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2 border font-medium">{p.parameter}</td>
                      <td className="p-2 border font-bold text-slate-900">{p.result}</td>
                      <td className="p-2 border">{p.unit}</td>
                      <td className="p-2 border text-slate-500">{p.referenceRange}</td>
                      <td className="p-2 border">
                        <StatusBadge status={p.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {documentData.remarks && (
              <div className="text-xs bg-slate-50 border border-slate-200 p-3 rounded-lg">
                <strong>Clinical Remarks:</strong> {documentData.remarks}
              </div>
            )}
          </div>
        )}

        {type === 'bill' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg text-xs">
              <div><strong>Invoice #:</strong> {documentData.id}</div>
              <div><strong>Date:</strong> {documentData.date}</div>
              <div><strong>Payment Status:</strong> <StatusBadge status={documentData.status} /></div>
            </div>
            <div className="text-xs border p-3 rounded-lg grid grid-cols-2 gap-2">
              <div><strong>Billed To:</strong> {documentData.patientName}</div>
              <div><strong>Patient ID:</strong> {documentData.patientId}</div>
              <div><strong>Phone:</strong> {documentData.patientPhone || 'N/A'}</div>
              <div><strong>Generated By:</strong> {documentData.generatedBy || 'Billing Counter'}</div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-2">Invoice Particulars</h4>
              <table className="w-full text-xs text-left border border-slate-200">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Description</th>
                    <th className="p-2 border">Department</th>
                    <th className="p-2 border text-right">Amount ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {documentData.items?.map((item, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2 border text-center">{i + 1}</td>
                      <td className="p-2 border font-medium">{item.description}</td>
                      <td className="p-2 border">{item.department}</td>
                      <td className="p-2 border text-right font-medium">${Number(item.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="p-2 text-right font-semibold">Subtotal:</td>
                    <td className="p-2 text-right font-semibold">${Number(documentData.subtotal || documentData.totalAmount).toFixed(2)}</td>
                  </tr>
                  {Number(documentData.discount) > 0 && (
                    <tr>
                      <td colSpan={3} className="p-2 text-right text-emerald-600 font-semibold">Discount:</td>
                      <td className="p-2 text-right text-emerald-600 font-semibold">-${Number(documentData.discount).toFixed(2)}</td>
                    </tr>
                  )}
                  <tr className="bg-slate-50">
                    <td colSpan={3} className="p-2 text-right font-bold text-sm text-slate-900">Total Due:</td>
                    <td className="p-2 text-right font-bold text-sm text-rose-600">${Number(documentData.totalAmount).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {documentData.paymentMethod && (
              <div className="text-xs bg-emerald-50 border border-emerald-200 p-2 rounded text-emerald-800">
                Paid via: <strong>{documentData.paymentMethod}</strong> on {documentData.paidDate || documentData.date}
              </div>
            )}
          </div>
        )}

        {/* Footer Signature */}
        <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-400">
          <div>This is a computer generated hospital document. No signature required.</div>
          <div className="text-right">
            <div className="w-32 border-b border-slate-400 mb-1"></div>
            <div>Authorized CarePoint Signatory</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
        >
          Close
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg flex items-center gap-1.5 transition"
        >
          <Printer className="w-4 h-4" /> Print Document
        </button>
      </div>
    </Modal>
  );
};

// Sidebar Nav Config by Role
export const getNavItemsForRole = (role) => {
  switch (role) {
    case 'Patient':
      return [
        { label: 'Dashboard', path: '/patient', icon: LayoutDashboard },
        { label: 'My Profile', path: '/patient/profile', icon: Users },
        { label: 'Book Appointment', path: '/patient/book', icon: CalendarPlus },
        { label: 'My Appointments', path: '/patient/appointments', icon: Calendar },
        { label: 'Medical History', path: '/patient/history', icon: FileText },
        { label: 'Prescriptions', path: '/patient/prescriptions', icon: Pill },
        { label: 'Lab Reports', path: '/patient/lab-reports', icon: FlaskConical },
        { label: 'Bills & Invoices', path: '/patient/bills', icon: Receipt },
        { label: 'Notifications', path: '/patient/notifications', icon: Bell }
      ];
    case 'Doctor':
      return [
        { label: 'Dashboard', path: '/doctor', icon: LayoutDashboard },
        { label: 'Appointments', path: '/doctor/appointments', icon: Calendar },
        { label: 'Patients', path: '/doctor/patients', icon: Users },
        { label: 'Medical Records', path: '/doctor/records', icon: FileText },
        { label: 'Prescriptions', path: '/doctor/prescriptions', icon: Pill },
        { label: 'Lab Tests', path: '/doctor/lab-tests', icon: FlaskConical },
        { label: 'My Profile', path: '/doctor/profile', icon: Users },
        { label: 'Notifications', path: '/doctor/notifications', icon: Bell }
      ];
    case 'Receptionist':
      return [
        { label: 'Dashboard', path: '/receptionist', icon: LayoutDashboard },
        { label: 'Patient Registration', path: '/receptionist/register', icon: UserPlus },
        { label: 'Patients List', path: '/receptionist/patients', icon: Users },
        { label: 'Appointments', path: '/receptionist/appointments', icon: Calendar },
        { label: 'Doctor Availability', path: '/receptionist/doctors', icon: Stethoscope },
        { label: 'Billing & Payments', path: '/receptionist/billing', icon: Receipt },
        { label: 'Profile', path: '/receptionist/profile', icon: Users },
        { label: 'Notifications', path: '/receptionist/notifications', icon: Bell }
      ];
    case 'Pharmacist':
      return [
        { label: 'Dashboard', path: '/pharmacist', icon: LayoutDashboard },
        { label: 'Prescriptions', path: '/pharmacist/prescriptions', icon: Pill },
        { label: 'Medicines List', path: '/pharmacist/medicines', icon: HeartPulse },
        { label: 'Stock & Inventory', path: '/pharmacist/inventory', icon: Activity },
        { label: 'Dispense Medicine', path: '/pharmacist/dispense', icon: CheckCircle2 },
        { label: 'Profile', path: '/pharmacist/profile', icon: Users },
        { label: 'Notifications', path: '/pharmacist/notifications', icon: Bell }
      ];
    case 'Lab Technician':
      return [
        { label: 'Dashboard', path: '/lab', icon: LayoutDashboard },
        { label: 'All Lab Tests', path: '/lab/tests', icon: FlaskConical },
        { label: 'Pending Tests', path: '/lab/pending', icon: Clock },
        { label: 'Completed Tests', path: '/lab/completed', icon: CheckCircle2 },
        { label: 'Generate Report', path: '/lab/reports', icon: FileText },
        { label: 'Profile', path: '/lab/profile', icon: Users },
        { label: 'Notifications', path: '/lab/notifications', icon: Bell }
      ];
    case 'Administrator':
    default:
      return [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { label: 'User Management', path: '/admin/users', icon: Shield },
        { label: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
        { label: 'Patients', path: '/admin/patients', icon: Users },
        { label: 'Receptionists', path: '/admin/receptionists', icon: UserCheck },
        { label: 'Pharmacists', path: '/admin/pharmacists', icon: Pill },
        { label: 'Lab Technicians', path: '/admin/lab-techs', icon: FlaskConical },
        { label: 'Departments', path: '/admin/departments', icon: Building2 },
        { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
        { label: 'Medicines & Stock', path: '/admin/medicines', icon: HeartPulse },
        { label: 'Lab Tests', path: '/admin/lab-tests', icon: FlaskConical },
        { label: 'Billing Records', path: '/admin/billing', icon: Receipt },
        { label: 'System Settings', path: '/admin/settings', icon: Settings },
        { label: 'Notifications', path: '/admin/notifications', icon: Bell }
      ];
  }
};

// Application Main Dashboard Layout (Left sidebar, top header, main content inspired by NexaCare)
export const DashboardLayout = ({ children, title = 'Hospital Management System' }) => {
  const { currentUser, login, logout, notifications, markAllNotificationsRead, resetToMockData } = useHospital();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const role = currentUser?.role || 'Administrator';
  const navItems = getNavItemsForRole(role);
  const unreadCount = notifications.filter(n => !n.read && (n.targetRole === role || !n.targetRole)).length;

  const handleRoleSwitch = (newRole) => {
    login(newRole);
    switch (newRole) {
      case 'Patient': navigate('/patient'); break;
      case 'Doctor': navigate('/doctor'); break;
      case 'Receptionist': navigate('/receptionist'); break;
      case 'Pharmacist': navigate('/pharmacist'); break;
      case 'Lab Technician': navigate('/lab'); break;
      case 'Administrator': navigate('/admin'); break;
      default: navigate('/admin'); break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar (inspired by NexaCare) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Hospital Branding */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-xs">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-base leading-none">CarePoint</span>
              <span className="text-[10px] block text-rose-600 font-semibold tracking-wider uppercase">Hospital MS</span>
            </div>
          </NavLink>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Role Badge */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Portal Mode</div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
              {role} Portal
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== `/${role.toLowerCase()}` && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-rose-50 text-rose-700 font-semibold border-l-3 border-rose-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Role Demo Switcher & Logout at bottom */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2">
            Switch Demo Role
          </div>
          <select
            value={role}
            onChange={(e) => handleRoleSwitch(e.target.value)}
            className="w-full text-xs py-1.5 px-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-rose-500 focus:outline-none"
          >
            <option value="Administrator">Administrator</option>
            <option value="Doctor">Doctor</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Pharmacist">Pharmacist</option>
            <option value="Lab Technician">Lab Technician</option>
            <option value="Patient">Patient</option>
          </select>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header (inspired by NexaCare) */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-bold text-slate-800">{title}</h2>
              <p className="text-[11px] text-slate-400">CarePoint Super Specialty Hospital System</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick Public Website Link */}
            <NavLink
              to="/"
              className="hidden md:flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 hover:text-rose-600 font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              Public Website
            </NavLink>

            {/* Reset Mock Data Button */}
            <button
              onClick={() => {
                if (window.confirm('Reset all hospital records back to original demo state?')) {
                  resetToMockData();
                }
              }}
              title="Reset Mock Data"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                    <div className="font-semibold text-xs text-slate-800">Notifications ({unreadCount} new)</div>
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-rose-600 hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 8).map((n) => (
                        <div key={n.id} className={`p-3 text-xs transition ${n.read ? 'bg-white opacity-75' : 'bg-rose-50/30'}`}>
                          <div className="font-semibold text-slate-800 flex items-center justify-between">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{n.timestamp}</span>
                          </div>
                          <p className="text-slate-600 mt-1">{n.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-400">No notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Area */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">{currentUser?.name || 'Arthur Vance'}</div>
                <div className="text-[10px] text-rose-600 font-medium">{currentUser?.role || 'Administrator'}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Inner Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
