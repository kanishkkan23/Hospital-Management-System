"use client";

import React, { useState } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { useToast } from '@/components/ui/Toast';
import { Doctor } from '@/types';
import {
  UserCheck,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  MapPin,
  Star,
  Phone,
  Mail
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { AddDoctorModal } from '@/components/admin/modals/AddDoctorModal';
import { formatCurrency } from '@/lib/utils';

export default function DoctorsManagementPage() {
  const { doctors, departments, deleteDoctor } = useHospitalData();
  const { success } = useToast();

  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState<Doctor | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);

  const filteredDoctors = doctors.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase()) ||
      d.department.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter === 'ALL' || d.department.toLowerCase().includes(departmentFilter.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDoctors.length / pageSize) || 1;
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDelete = () => {
    if (!doctorToDelete) return;
    deleteDoctor(doctorToDelete.id);
    success('Doctor Removed', `${doctorToDelete.name} has been removed.`);
    setDoctorToDelete(null);
  };

  const columns: Column<Doctor>[] = [
    {
      key: 'name',
      header: 'Doctor Name & Credentials',
      render: (d) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-hospital-50 border border-hospital-200 text-hospital-700 font-bold flex items-center justify-center text-xs shrink-0">
            {d.name.split(' ')[1]?.[0] || 'D'}
          </div>
          <div>
            <span className="font-semibold text-slate-900 block">{d.name}</span>
            <span className="text-[11px] text-slate-500 block truncate max-w-[200px]">
              {d.qualifications}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'specialization',
      header: 'Department & Specialization',
      render: (d) => (
        <div>
          <span className="font-semibold text-hospital-800 block text-xs">{d.specialization}</span>
          <span className="text-[11px] text-slate-500 block">{d.department}</span>
        </div>
      ),
    },
    {
      key: 'schedule',
      header: 'OPD Schedule & Room',
      render: (d) => (
        <div className="text-xs text-slate-700">
          <div className="font-medium">{d.availableHours}</div>
          <div className="text-[11px] text-slate-500">
            Room: <strong className="text-slate-800">{d.roomNumber}</strong> • {d.availableDays.join(', ')}
          </div>
        </div>
      ),
    },
    {
      key: 'fee',
      header: 'Fee',
      render: (d) => (
        <span className="font-bold text-slate-900 text-xs">
          {formatCurrency(d.consultationFee)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (d) => (
        <Badge
          variant={
            d.status === 'Active'
              ? 'emerald'
              : d.status === 'In Surgery'
              ? 'amber'
              : 'slate'
          }
          size="sm"
          dot
        >
          {d.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (d) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDoctorToEdit(d);
              setIsAddModalOpen(true);
            }}
            title="Edit Doctor"
            className="h-7 w-7 p-0"
          >
            <Edit2 className="w-3.5 h-3.5 text-hospital-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDoctorToDelete(d)}
            title="Remove Doctor"
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
      <div>
        <Breadcrumbs items={[{ label: 'Doctors' }]} className="mb-2" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Medical Faculty & Specialist Doctors
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage physician rosters, OPD timings, consultation rooms, and professional qualifications.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setDoctorToEdit(null);
              setIsAddModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Doctor
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          placeholder="Search by doctor name or specialization..."
          className="max-w-md"
        />

        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          <FilterDropdown
            label="Department"
            value={departmentFilter}
            onChange={(val) => {
              setDepartmentFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Departments' },
              ...departments.map((d) => ({ value: d.code, label: d.name.split('&')[0].trim() })),
            ]}
          />

          <FilterDropdown
            label="Duty Status"
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'Active', label: 'Active / On Duty' },
              { value: 'In Surgery', label: 'In Surgery' },
              { value: 'On Leave', label: 'On Leave' },
              { value: 'Off Duty', label: 'Off Duty' },
            ]}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginatedDoctors}
        keyExtractor={(d) => d.id}
        emptyTitle="No Doctors Found"
        emptyDescription="No specialist records match the search query."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredDoctors.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      <AddDoctorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        doctorToEdit={doctorToEdit}
      />

      <ConfirmDialog
        isOpen={!!doctorToDelete}
        onClose={() => setDoctorToDelete(null)}
        onConfirm={handleDelete}
        title="Remove Doctor Record"
        description={`Are you sure you want to remove ${doctorToDelete?.name} from the medical roster?`}
        confirmText="Remove Doctor"
        variant="danger"
      />
    </div>
  );
}
