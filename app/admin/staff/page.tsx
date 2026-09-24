"use client";

import React, { useState } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { useToast } from '@/components/ui/Toast';
import { Staff } from '@/types';
import {
  HeartHandshake,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Phone,
  Mail,
  Shield
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { AddStaffModal } from '@/components/admin/modals/AddStaffModal';
import { formatDate } from '@/lib/utils';

export default function StaffManagementPage() {
  const { staff, deleteStaff } = useHospitalData();
  const { success } = useToast();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [shiftFilter, setShiftFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);

  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || s.role === roleFilter;
    const matchesShift = shiftFilter === 'ALL' || s.shift.includes(shiftFilter);
    return matchesSearch && matchesRole && matchesShift;
  });

  const totalPages = Math.ceil(filteredStaff.length / pageSize) || 1;
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDelete = () => {
    if (!staffToDelete) return;
    deleteStaff(staffToDelete.id);
    success('Staff Member Removed', `${staffToDelete.name} has been removed.`);
    setStaffToDelete(null);
  };

  const columns: Column<Staff>[] = [
    {
      key: 'name',
      header: 'Staff Member Name',
      render: (s) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
            {s.name[0] || 'S'}
          </div>
          <div>
            <span className="font-semibold text-slate-900 block text-xs">{s.name}</span>
            <span className="text-[11px] text-slate-500">{s.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Designation / Role',
      render: (s) => (
        <span className="font-semibold text-hospital-800 text-xs bg-hospital-50 px-2 py-0.5 rounded border border-hospital-100">
          {s.role}
        </span>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      render: (s) => (
        <span className="text-xs text-slate-700 font-medium">{s.department}</span>
      ),
    },
    {
      key: 'shift',
      header: 'Shift Timing',
      render: (s) => (
        <div className="text-xs text-slate-600 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{s.shift}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Duty Status',
      render: (s) => (
        <Badge
          variant={
            s.status === 'Active'
              ? 'emerald'
              : s.status === 'On Leave'
              ? 'amber'
              : 'slate'
          }
          size="sm"
          dot
        >
          {s.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (s) => (
        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStaffToDelete(s)}
            title="Remove Staff"
            className="h-7 w-7 p-0 text-rose-500 hover:bg-rose-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <Breadcrumbs items={[{ label: 'Staff' }]} className="mb-2" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Hospital Clinical & Administrative Staff
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage nursing teams, laboratory technicians, pharmacists, and shift rosters.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Staff Member
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
          placeholder="Search staff by name or department..."
          className="max-w-md"
        />

        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          <FilterDropdown
            label="Role"
            value={roleFilter}
            onChange={(val) => {
              setRoleFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Roles' },
              { value: 'Nurse', label: 'Nurses' },
              { value: 'Ward In-Charge', label: 'Ward In-Charge' },
              { value: 'Lab Technician', label: 'Lab Technicians' },
              { value: 'Pharmacist', label: 'Pharmacists' },
              { value: 'Radiologist', label: 'Radiology Techs' },
              { value: 'Receptionist', label: 'Receptionists' },
            ]}
          />

          <FilterDropdown
            label="Shift"
            value={shiftFilter}
            onChange={(val) => {
              setShiftFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Shifts' },
              { value: 'Morning', label: 'Morning Shift' },
              { value: 'Evening', label: 'Evening Shift' },
              { value: 'Night', label: 'Night Shift' },
              { value: 'General', label: 'General Day' },
            ]}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginatedStaff}
        keyExtractor={(s) => s.id}
        emptyTitle="No Staff Found"
        emptyDescription="No staff records match the current filter."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredStaff.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <ConfirmDialog
        isOpen={!!staffToDelete}
        onClose={() => setStaffToDelete(null)}
        onConfirm={handleDelete}
        title="Remove Staff Member"
        description={`Are you sure you want to remove ${staffToDelete?.name} (${staffToDelete?.role}) from the staff registry?`}
        confirmText="Remove Staff"
        variant="danger"
      />
    </div>
  );
}
