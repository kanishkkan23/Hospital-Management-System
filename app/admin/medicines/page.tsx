"use client";

import React, { useState } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { useToast } from '@/components/ui/Toast';
import { Medicine } from '@/types';
import {
  Pill,
  Plus,
  Trash2,
  AlertTriangle,
  PackageCheck,
  RefreshCw,
  Search
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { AddMedicineModal } from '@/components/admin/modals/AddMedicineModal';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function MedicinesManagementPage() {
  const { medicines, updateMedicineStock, deleteMedicine } = useHospitalData();
  const { success } = useToast();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [medToDelete, setMedToDelete] = useState<Medicine | null>(null);
  const [restockMed, setRestockMed] = useState<Medicine | null>(null);
  const [restockAmount, setRestockAmount] = useState('100');

  const filteredMeds = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.genericName.toLowerCase().includes(search.toLowerCase()) ||
      m.batchNumber.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || m.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const totalPages = Math.ceil(filteredMeds.length / pageSize) || 1;
  const paginatedMeds = filteredMeds.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleRestock = () => {
    if (!restockMed) return;
    const addQty = parseInt(restockAmount) || 0;
    const newStock = restockMed.stockQuantity + addQty;
    updateMedicineStock(restockMed.id, newStock);
    success('Inventory Restocked', `${restockMed.name} stock increased to ${newStock} units.`);
    setRestockMed(null);
  };

  const handleDelete = () => {
    if (!medToDelete) return;
    deleteMedicine(medToDelete.id);
    success('Medicine Deleted', `${medToDelete.name} removed from pharmacy catalog.`);
    setMedToDelete(null);
  };

  const columns: Column<Medicine>[] = [
    {
      key: 'name',
      header: 'Medicine Name & Generic',
      render: (m) => (
        <div>
          <span className="font-semibold text-slate-900 block text-xs">{m.name}</span>
          <span className="text-[11px] text-slate-500 block truncate max-w-[200px]">{m.genericName}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Therapeutic Category',
      render: (m) => (
        <span className="text-xs text-slate-700 font-medium">{m.category}</span>
      ),
    },
    {
      key: 'batch',
      header: 'Batch / Rack',
      render: (m) => (
        <div className="text-xs">
          <span className="font-mono text-slate-800 block font-medium">{m.batchNumber}</span>
          <span className="text-[11px] text-slate-400">{m.locationRack}</span>
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Stock / Min Alert',
      render: (m) => (
        <div className="text-xs">
          <span className="font-bold text-slate-900 block">{m.stockQuantity} Units</span>
          <span className="text-[11px] text-slate-400">Min: {m.minThreshold}</span>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Unit Price',
      render: (m) => (
        <span className="font-semibold text-slate-900 text-xs">{formatCurrency(m.unitPrice)}</span>
      ),
    },
    {
      key: 'expiry',
      header: 'Expiry Date',
      render: (m) => (
        <span className="text-xs text-slate-600 font-medium">{formatDate(m.expiryDate)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Stock Status',
      render: (m) => (
        <Badge
          variant={
            m.status === 'In Stock'
              ? 'emerald'
              : m.status === 'Low Stock'
              ? 'amber'
              : 'rose'
          }
          size="sm"
          dot
        >
          {m.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (m) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setRestockMed(m);
              setRestockAmount('100');
            }}
            title="Restock Units"
            className="h-7 w-7 p-0 text-hospital-600 hover:bg-hospital-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMedToDelete(m)}
            title="Delete Medicine"
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
        <Breadcrumbs items={[{ label: 'Medicines' }]} className="mb-2" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Hospital Pharmacy & Medicine Inventory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Track pharmaceuticals, batch expiry dates, low stock thresholds, and warehouse racks.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Stock Medicine
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
          placeholder="Search by medicine name, generic molecule, batch #..."
          className="max-w-md"
        />

        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          <FilterDropdown
            label="Category"
            value={categoryFilter}
            onChange={(val) => {
              setCategoryFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Categories' },
              { value: 'Antibiotics', label: 'Antibiotics' },
              { value: 'Analgesics / Pain Relief', label: 'Pain Relief' },
              { value: 'Cardiovascular', label: 'Cardiovascular' },
              { value: 'Antidiabetic', label: 'Antidiabetic' },
              { value: 'Gastrointestinal', label: 'Gastrointestinal' },
              { value: 'Anesthetics', label: 'Anesthetics' },
            ]}
          />

          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Stock Statuses' },
              { value: 'In Stock', label: 'In Stock' },
              { value: 'Low Stock', label: 'Low Stock Alert' },
              { value: 'Out of Stock', label: 'Out of Stock' },
            ]}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginatedMeds}
        keyExtractor={(m) => m.id}
        emptyTitle="No Medicines Found"
        emptyDescription="No pharmacy records match the query."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredMeds.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      <AddMedicineModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Quick Restock Modal */}
      {restockMed && (
        <Modal
          isOpen={!!restockMed}
          onClose={() => setRestockMed(null)}
          title={`Restock: ${restockMed.name}`}
          description={`Current Inventory: ${restockMed.stockQuantity} Units • Batch: ${restockMed.batchNumber}`}
          size="sm"
        >
          <div className="space-y-4">
            <Input
              label="Quantity to Add (Units)"
              type="number"
              value={restockAmount}
              onChange={(e) => setRestockAmount(e.target.value)}
              required
            />
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setRestockMed(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleRestock}>
                Add to Stock
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={!!medToDelete}
        onClose={() => setMedToDelete(null)}
        onConfirm={handleDelete}
        title="Remove Medicine"
        description={`Are you sure you want to delete ${medToDelete?.name} (${medToDelete?.batchNumber}) from the hospital inventory?`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
