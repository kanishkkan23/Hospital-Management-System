"use client";

import React, { useState } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { useToast } from '@/components/ui/Toast';
import { Appointment, AppointmentStatus } from '@/types';
import {
  CalendarDays,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  Play,
  FileText
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ScheduleAppointmentModal } from '@/components/admin/modals/ScheduleAppointmentModal';
import { formatDate } from '@/lib/utils';

export default function AppointmentsManagementPage() {
  const { appointments, updateAppointmentStatus, deleteAppointment } = useHospitalData();
  const { success } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [aptToDelete, setAptToDelete] = useState<Appointment | null>(null);

  const filteredAppointments = appointments.filter((a) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.appointmentNumber.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      a.patientUhid.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAppointments.length / pageSize) || 1;
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    updateAppointmentStatus(id, status);
    success('Appointment Status Updated', `Appointment marked as ${status}.`);
  };

  const handleDelete = () => {
    if (!aptToDelete) return;
    deleteAppointment(aptToDelete.id);
    success('Appointment Cancelled', `Appointment ${aptToDelete.appointmentNumber} deleted.`);
    setAptToDelete(null);
  };

  const columns: Column<Appointment>[] = [
    {
      key: 'appointmentNumber',
      header: 'Appt #',
      render: (a) => (
        <span className="font-mono font-bold text-hospital-700 bg-hospital-50 px-2 py-0.5 rounded text-xs">
          {a.appointmentNumber}
        </span>
      ),
    },
    {
      key: 'patient',
      header: 'Patient Details',
      render: (a) => (
        <div>
          <span className="font-semibold text-slate-900 block text-xs">{a.patientName}</span>
          <span className="text-[11px] text-slate-500">{a.patientUhid} • {a.patientPhone}</span>
        </div>
      ),
    },
    {
      key: 'doctor',
      header: 'Consultant & Specialty',
      render: (a) => (
        <div>
          <span className="font-semibold text-slate-800 block text-xs">{a.doctorName}</span>
          <span className="text-[11px] text-slate-500">{a.department}</span>
        </div>
      ),
    },
    {
      key: 'slot',
      header: 'Date & Time Slot',
      render: (a) => (
        <div className="text-xs">
          <span className="font-medium text-slate-800 block">{formatDate(a.date)}</span>
          <span className="text-[11px] text-hospital-700 font-semibold">{a.timeSlot}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Consultation Type',
      render: (a) => (
        <span className="text-xs font-medium text-slate-700">{a.type}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (a) => (
        <Badge
          variant={
            a.status === 'Completed'
              ? 'emerald'
              : a.status === 'In Progress'
              ? 'sky'
              : a.status === 'Cancelled'
              ? 'rose'
              : 'amber'
          }
          size="sm"
          dot
        >
          {a.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (a) => (
        <div className="flex items-center justify-end gap-1.5">
          {a.status === 'Scheduled' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleStatusChange(a.id, 'In Progress')}
              title="Start Consultation"
              className="h-7 w-7 p-0 text-sky-600 hover:bg-sky-50"
            >
              <Play className="w-3.5 h-3.5" />
            </Button>
          )}

          {(a.status === 'Scheduled' || a.status === 'In Progress') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleStatusChange(a.id, 'Completed')}
              title="Mark Completed"
              className="h-7 w-7 p-0 text-emerald-600 hover:bg-emerald-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </Button>
          )}

          {a.status !== 'Cancelled' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleStatusChange(a.id, 'Cancelled')}
              title="Cancel Appointment"
              className="h-7 w-7 p-0 text-amber-600 hover:bg-amber-50"
            >
              <XCircle className="w-3.5 h-3.5" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAptToDelete(a)}
            title="Delete Record"
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
        <Breadcrumbs items={[{ label: 'Appointments' }]} className="mb-2" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Outpatient (OPD) Appointments Schedule
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Live consultation queues, doctor slot booking, and appointment status tracking.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setIsScheduleModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Schedule Appointment
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
          placeholder="Search by appointment #, patient, doctor..."
          className="max-w-md"
        />

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'Scheduled', label: 'Scheduled' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Cancelled', label: 'Cancelled' },
            ]}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginatedAppointments}
        keyExtractor={(a) => a.id}
        emptyTitle="No Appointments Scheduled"
        emptyDescription="No consultation records match the active filters."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredAppointments.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      <ScheduleAppointmentModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      <ConfirmDialog
        isOpen={!!aptToDelete}
        onClose={() => setAptToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Appointment"
        description={`Are you sure you want to delete appointment ${aptToDelete?.appointmentNumber} for ${aptToDelete?.patientName}?`}
        confirmText="Delete Appointment"
        variant="danger"
      />
    </div>
  );
}
