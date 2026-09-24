"use client";

import React, { useState } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { useToast } from '@/components/ui/Toast';
import { LabTest, LabTestStatus } from '@/types';
import {
  FlaskConical,
  Plus,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  Play
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { NewLabTestModal } from '@/components/admin/modals/NewLabTestModal';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function LaboratoryManagementPage() {
  const { labTests, updateLabTestStatus } = useHospitalData();
  const { success } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [testToComplete, setTestToComplete] = useState<LabTest | null>(null);
  const [resultText, setResultText] = useState('');

  const filteredTests = labTests.filter((l) => {
    const matchesSearch =
      l.testName.toLowerCase().includes(search.toLowerCase()) ||
      l.patientName.toLowerCase().includes(search.toLowerCase()) ||
      l.patientUhid.toLowerCase().includes(search.toLowerCase()) ||
      l.testCode.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || l.priority.includes(priorityFilter);
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredTests.length / pageSize) || 1;
  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleStatusProgress = (test: LabTest) => {
    if (test.status === 'Pending Sample') {
      updateLabTestStatus(test.id, 'Sample Collected');
      success('Sample Collected', `Specimen received for ${test.testName}.`);
    } else if (test.status === 'Sample Collected') {
      updateLabTestStatus(test.id, 'In Analysis');
      success('Investigation Underway', `${test.testName} processing in analyzer.`);
    } else if (test.status === 'In Analysis') {
      setTestToComplete(test);
      setResultText('All parameters within standard physiological range.');
    }
  };

  const handleSaveResult = () => {
    if (!testToComplete) return;
    updateLabTestStatus(testToComplete.id, 'Completed', resultText);
    success('Lab Results Published', `Diagnostics finalized for ${testToComplete.patientName}.`);
    setTestToComplete(null);
  };

  const columns: Column<LabTest>[] = [
    {
      key: 'testCode',
      header: 'Test Code / Ref',
      render: (l) => (
        <span className="font-mono font-bold text-hospital-700 bg-hospital-50 px-2 py-0.5 rounded text-xs">
          {l.testCode}
        </span>
      ),
    },
    {
      key: 'testName',
      header: 'Investigation & Category',
      render: (l) => (
        <div>
          <span className="font-semibold text-slate-900 block text-xs">{l.testName}</span>
          <span className="text-[11px] text-slate-500">{l.category} • Sample: {l.sampleType}</span>
        </div>
      ),
    },
    {
      key: 'patient',
      header: 'Patient / Ref Doctor',
      render: (l) => (
        <div className="text-xs">
          <span className="font-semibold text-slate-800 block">{l.patientName}</span>
          <span className="text-[11px] text-slate-500">{l.patientUhid} • Ref: {l.referredByDoctor}</span>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (l) => (
        <Badge
          variant={
            l.priority.includes('STAT')
              ? 'rose'
              : l.priority === 'Urgent'
              ? 'amber'
              : 'slate'
          }
          size="sm"
        >
          {l.priority}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (l) => (
        <Badge
          variant={
            l.status === 'Completed'
              ? 'emerald'
              : l.status === 'In Analysis'
              ? 'sky'
              : l.status === 'Sample Collected'
              ? 'indigo'
              : 'amber'
          }
          size="sm"
          dot
        >
          {l.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Workflow Actions',
      align: 'right',
      render: (l) => (
        <div className="flex items-center justify-end gap-1.5">
          {l.status !== 'Completed' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusProgress(l)}
              className="text-xs h-7 px-2.5"
            >
              {l.status === 'Pending Sample' && 'Collect Sample'}
              {l.status === 'Sample Collected' && 'Start Analysis'}
              {l.status === 'In Analysis' && 'Enter Results'}
            </Button>
          )}

          {l.status === 'Completed' && l.resultsSummary && (
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Report Ready</span>
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <Breadcrumbs items={[{ label: 'Laboratory' }]} className="mb-2" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Diagnostic Pathology & Imaging Laboratory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Requisition tracking, specimen collection, biochemical analyzer workflow, and clinical reports.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Order Lab Test
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
          placeholder="Search by test name, patient UHID or test code..."
          className="max-w-md"
        />

        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          <FilterDropdown
            label="Workflow Status"
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'Pending Sample', label: 'Pending Sample' },
              { value: 'Sample Collected', label: 'Sample Collected' },
              { value: 'In Analysis', label: 'In Analysis' },
              { value: 'Completed', label: 'Completed (Report Ready)' },
            ]}
          />

          <FilterDropdown
            label="Priority"
            value={priorityFilter}
            onChange={(val) => {
              setPriorityFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Priorities' },
              { value: 'Routine', label: 'Routine' },
              { value: 'Urgent', label: 'Urgent' },
              { value: 'STAT', label: 'STAT (Emergency)' },
            ]}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginatedTests}
        keyExtractor={(l) => l.id}
        emptyTitle="No Diagnostic Orders"
        emptyDescription="No lab requisitions found matching the filter criteria."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredTests.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      <NewLabTestModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Enter Result Modal */}
      {testToComplete && (
        <Modal
          isOpen={!!testToComplete}
          onClose={() => setTestToComplete(null)}
          title={`Publish Findings: ${testToComplete.testName}`}
          description={`Patient: ${testToComplete.patientName} (${testToComplete.patientUhid})`}
          size="md"
        >
          <div className="space-y-4">
            <Textarea
              label="Diagnostic Findings & Clinical Interpretation"
              value={resultText}
              onChange={(e) => setResultText(e.target.value)}
              rows={4}
              required
            />
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setTestToComplete(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveResult} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
                Publish & Complete Report
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
