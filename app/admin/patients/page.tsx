"use client";

import React, { useState } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { useToast } from '@/components/ui/Toast';
import { Patient, PatientStatus, BloodGroup } from '@/types';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  FileText,
  Phone,
  Mail,
  User,
  HeartPulse,
  Activity,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import { AddPatientModal } from '@/components/admin/modals/AddPatientModal';
import { formatDate } from '@/lib/utils';

export default function PatientsManagementPage() {
  const { patients, deletePatient } = useHospitalData();
  const { success } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [selectedPatientView, setSelectedPatientView] = useState<Patient | null>(null);

  // Filter logic
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.uhid.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search);
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesBlood = bloodGroupFilter === 'ALL' || p.bloodGroup === bloodGroupFilter;
    return matchesSearch && matchesStatus && matchesBlood;
  });

  const totalPages = Math.ceil(filteredPatients.length / pageSize) || 1;
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDelete = () => {
    if (!patientToDelete) return;
    deletePatient(patientToDelete.id);
    success('Patient Record Removed', `${patientToDelete.name} (${patientToDelete.uhid}) deleted.`);
    setPatientToDelete(null);
  };

  const columns: Column<Patient>[] = [
    {
      key: 'uhid',
      header: 'UHID / ID',
      render: (p) => (
        <span className="font-mono font-bold text-hospital-700 bg-hospital-50 px-2 py-0.5 rounded text-xs">
          {p.uhid}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Patient Name & Demographic',
      render: (p) => (
        <div>
          <span className="font-semibold text-slate-900 block">{p.name}</span>
          <span className="text-[11px] text-slate-500">
            {p.age} yrs • {p.gender} • Blood: <strong className="text-slate-700">{p.bloodGroup}</strong>
          </span>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact & Phone',
      render: (p) => (
        <div className="text-xs text-slate-700">
          <div>{p.phone}</div>
          <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{p.email}</div>
        </div>
      ),
    },
    {
      key: 'assignment',
      header: 'Department / Room',
      render: (p) => (
        <div className="text-xs">
          <span className="font-medium text-slate-800 block truncate max-w-[180px]">
            {p.assignedDepartment || 'General Medicine'}
          </span>
          <span className="text-[11px] text-slate-500 block">
            {p.roomBed ? `Bed: ${p.roomBed}` : `Doc: ${p.assignedDoctor || 'On-Call'}`}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => (
        <Badge
          variant={
            p.status === 'Inpatient'
              ? 'emerald'
              : p.status === 'Emergency'
              ? 'rose'
              : p.status === 'Outpatient'
              ? 'sky'
              : 'slate'
          }
          size="sm"
          dot
        >
          {p.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedPatientView(p)}
            title="View Patient Chart"
            className="h-7 w-7 p-0"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPatientToEdit(p);
              setIsAddModalOpen(true);
            }}
            title="Edit Record"
            className="h-7 w-7 p-0"
          >
            <Edit2 className="w-3.5 h-3.5 text-hospital-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPatientToDelete(p)}
            title="Delete Record"
            className="h-7 w-7 p-0 hover:text-rose-600"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header with Breadcrumbs */}
      <div>
        <Breadcrumbs items={[{ label: 'Patients' }]} className="mb-2" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Patient Registration & Inpatient Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage medical health records, admissions, bed assignments, and patient contacts.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setPatientToEdit(null);
              setIsAddModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Register Patient
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          placeholder="Search by UHID, patient name, phone..."
          className="max-w-md"
        />

        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'Inpatient', label: 'Inpatient (Admitted)' },
              { value: 'Outpatient', label: 'Outpatient (OPD)' },
              { value: 'Emergency', label: 'Emergency' },
              { value: 'Discharged', label: 'Discharged' },
            ]}
          />

          <FilterDropdown
            label="Blood Group"
            value={bloodGroupFilter}
            onChange={(val) => {
              setBloodGroupFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Blood Groups' },
              { value: 'A+', label: 'A+' },
              { value: 'A-', label: 'A-' },
              { value: 'B+', label: 'B+' },
              { value: 'B-', label: 'B-' },
              { value: 'AB+', label: 'AB+' },
              { value: 'AB-', label: 'AB-' },
              { value: 'O+', label: 'O+' },
              { value: 'O-', label: 'O-' },
            ]}
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={paginatedPatients}
        keyExtractor={(p) => p.id}
        onRowClick={(p) => setSelectedPatientView(p)}
        emptyTitle="No Patients Found"
        emptyDescription="No patient records match the selected search and filter criteria."
        emptyAction={
          <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
            Register New Patient
          </Button>
        }
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredPatients.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Modals & Dialogs */}
      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        patientToEdit={patientToEdit}
      />

      <ConfirmDialog
        isOpen={!!patientToDelete}
        onClose={() => setPatientToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Patient Record"
        description={`Are you sure you want to permanently delete the medical profile for ${patientToDelete?.name} (${patientToDelete?.uhid})? This action cannot be reversed.`}
        confirmText="Delete Patient"
        variant="danger"
      />

      {/* Patient Clinical Summary Detail Modal */}
      {selectedPatientView && (
        <Modal
          isOpen={!!selectedPatientView}
          onClose={() => setSelectedPatientView(null)}
          title={`Clinical Profile: ${selectedPatientView.name}`}
          description={`UHID: ${selectedPatientView.uhid} • Registered: ${formatDate(selectedPatientView.createdAt)}`}
          size="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <Badge
                variant={
                  selectedPatientView.status === 'Inpatient'
                    ? 'emerald'
                    : selectedPatientView.status === 'Emergency'
                    ? 'rose'
                    : 'sky'
                }
              >
                {selectedPatientView.status.toUpperCase()}
              </Badge>
              <Button size="sm" onClick={() => setSelectedPatientView(null)}>
                Close Chart
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Demographic Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">Age & Gender</span>
                <span className="font-semibold text-slate-900">{selectedPatientView.age} yrs, {selectedPatientView.gender}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Blood Group</span>
                <span className="font-bold text-rose-700">{selectedPatientView.bloodGroup}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Assigned Doctor</span>
                <span className="font-semibold text-slate-900 truncate block">{selectedPatientView.assignedDoctor || 'General Pool'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Location / Bed</span>
                <span className="font-semibold text-slate-900 block">{selectedPatientView.roomBed || 'OPD'}</span>
              </div>
            </div>

            {/* Diagnoses & Allergies */}
            <div className="space-y-2">
              <span className="font-semibold text-slate-800 uppercase tracking-wider text-[11px] block">
                Clinical Diagnoses & Treatment Plan
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedPatientView.diagnoses.map((diag, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-hospital-50 border border-hospital-200 text-hospital-800 font-medium">
                    {diag}
                  </span>
                ))}
              </div>
            </div>

            {selectedPatientView.allergies && selectedPatientView.allergies.length > 0 && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                <span className="font-semibold text-rose-800 flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Drug & Environmental Allergies Alert
                </span>
                <p className="text-rose-900 font-medium">{selectedPatientView.allergies.join(', ')}</p>
              </div>
            )}

            {/* Contact Details */}
            <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
              <div>
                <span className="text-slate-500 block">Contact Phone & Email:</span>
                <span className="font-medium">{selectedPatientView.phone} • {selectedPatientView.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Emergency Contact:</span>
                <span className="font-medium">{selectedPatientView.emergencyContact}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
