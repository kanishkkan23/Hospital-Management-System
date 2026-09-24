"use client";

import React, { useState } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { useToast } from '@/components/ui/Toast';
import { Invoice } from '@/types';
import {
  Receipt,
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  Printer,
  CreditCard,
  Building
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { CreateInvoiceModal } from '@/components/admin/modals/CreateInvoiceModal';
import { ViewInvoiceModal } from '@/components/admin/modals/ViewInvoiceModal';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function BillingManagementPage() {
  const { invoices, updateInvoiceStatus } = useHospitalData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.patientUhid.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInvoices.length / pageSize) || 1;
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: Column<Invoice>[] = [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      render: (inv) => (
        <span className="font-mono font-bold text-hospital-700 bg-hospital-50 px-2 py-0.5 rounded text-xs">
          {inv.invoiceNumber}
        </span>
      ),
    },
    {
      key: 'patient',
      header: 'Patient Name & UHID',
      render: (inv) => (
        <div>
          <span className="font-semibold text-slate-900 block text-xs">{inv.patientName}</span>
          <span className="text-[11px] text-slate-500 font-mono">{inv.patientUhid}</span>
        </div>
      ),
    },
    {
      key: 'dates',
      header: 'Date / Due',
      render: (inv) => (
        <div className="text-xs">
          <span className="text-slate-700 block">{formatDate(inv.issueDate)}</span>
          <span className="text-[11px] text-slate-400">Due: {formatDate(inv.dueDate)}</span>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Total Bill Amount',
      render: (inv) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{formatCurrency(inv.totalAmount)}</span>
          {inv.discount > 0 && (
            <span className="text-[10px] text-emerald-700 font-medium">
              Disc: -{formatCurrency(inv.discount)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'balance',
      header: 'Balance Due',
      render: (inv) => (
        <span className={`font-semibold text-xs ${inv.balanceAmount > 0 ? 'text-rose-700' : 'text-slate-400'}`}>
          {inv.balanceAmount > 0 ? formatCurrency(inv.balanceAmount) : 'Settled'}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Payment Mode',
      render: (inv) => (
        <span className="text-xs text-slate-600 font-medium">{inv.paymentMethod || 'Cash'}</span>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Status',
      render: (inv) => (
        <Badge
          variant={
            inv.paymentStatus === 'Paid'
              ? 'emerald'
              : inv.paymentStatus === 'Partially Paid'
              ? 'amber'
              : 'rose'
          }
          size="sm"
          dot
        >
          {inv.paymentStatus}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (inv) => (
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedInvoiceForView(inv)}
            leftIcon={<FileText className="w-3.5 h-3.5" />}
            className="h-7 text-xs px-2.5"
          >
            View Bill
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <Breadcrumbs items={[{ label: 'Billing' }]} className="mb-2" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Patient Billing & Accounts Ledger
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Itemized hospital charges, insurance TPA claims, receipt printing, and payment tracking.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Generate Invoice
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
          placeholder="Search by invoice #, patient name, UHID..."
          className="max-w-md"
        />

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <FilterDropdown
            label="Payment Status"
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Payment Statuses' },
              { value: 'Paid', label: 'Paid / Settled' },
              { value: 'Pending', label: 'Pending / Unpaid' },
              { value: 'Partially Paid', label: 'Partially Paid' },
            ]}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginatedInvoices}
        keyExtractor={(inv) => inv.id}
        onRowClick={(inv) => setSelectedInvoiceForView(inv)}
        emptyTitle="No Invoices Found"
        emptyDescription="No billing records match the query."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredInvoices.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <ViewInvoiceModal
        isOpen={!!selectedInvoiceForView}
        onClose={() => setSelectedInvoiceForView(null)}
        invoice={selectedInvoiceForView}
      />
    </div>
  );
}
