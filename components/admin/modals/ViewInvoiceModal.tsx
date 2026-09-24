"use client";

import React from 'react';
import { Invoice } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Activity, Printer, CheckCircle2 } from 'lucide-react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { useToast } from '@/components/ui/Toast';

interface ViewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export const ViewInvoiceModal: React.FC<ViewInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
}) => {
  const { updateInvoiceStatus } = useHospitalData();
  const { success } = useToast();

  if (!invoice) return null;

  const handleMarkAsPaid = () => {
    updateInvoiceStatus(invoice.id, 'Paid');
    success('Invoice Marked as Paid', `Invoice ${invoice.invoiceNumber} balance settled.`);
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Hospital Invoice: ${invoice.invoiceNumber}`}
      description="Patient billing ledger & breakdown receipt."
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4" />}
            >
              Print Receipt
            </Button>
            {invoice.paymentStatus !== 'Paid' && (
              <Button
                variant="success"
                size="sm"
                onClick={handleMarkAsPaid}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Mark as Paid
              </Button>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="p-4 border border-slate-200 rounded-xl bg-white space-y-6 text-xs text-slate-800">
        
        {/* Hospital Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-hospital-600 flex items-center justify-center text-white font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Apex Memorial Hospital</h4>
              <p className="text-[11px] text-slate-500">Sector 15, Healthcare City, Navi Mumbai</p>
            </div>
          </div>
          <div className="text-right">
            <Badge
              variant={
                invoice.paymentStatus === 'Paid'
                  ? 'emerald'
                  : invoice.paymentStatus === 'Partially Paid'
                  ? 'amber'
                  : 'rose'
              }
            >
              {invoice.paymentStatus.toUpperCase()}
            </Badge>
            <p className="font-bold text-slate-900 mt-1">{invoice.invoiceNumber}</p>
          </div>
        </div>

        {/* Patient & Billing Details */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <div>
            <span className="text-slate-500 block">Billed To (Patient):</span>
            <span className="font-bold text-slate-900 text-sm block">{invoice.patientName}</span>
            <span className="text-slate-600 font-medium">UHID: {invoice.patientUhid}</span>
          </div>
          <div className="text-right space-y-0.5">
            <div><span className="text-slate-500">Invoice Date: </span><span className="font-semibold">{formatDate(invoice.issueDate)}</span></div>
            <div><span className="text-slate-500">Due Date: </span><span className="font-semibold">{formatDate(invoice.dueDate)}</span></div>
            <div><span className="text-slate-500">Payment Mode: </span><span className="font-semibold">{invoice.paymentMethod || 'Cash'}</span></div>
          </div>
        </div>

        {/* Itemized Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-semibold text-left">
              <th className="py-2">Description</th>
              <th className="py-2">Category</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Unit Price</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoice.items.map((item, i) => (
              <tr key={i}>
                <td className="py-2.5 font-medium text-slate-900">{item.description}</td>
                <td className="py-2.5 text-slate-500">{item.category}</td>
                <td className="py-2.5 text-center">{item.quantity}</td>
                <td className="py-2.5 text-right">{formatCurrency(item.unitPrice)}</td>
                <td className="py-2.5 text-right font-semibold">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Financial Summary */}
        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount / Concession:</span>
                <span>-{formatCurrency(invoice.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-900 font-bold text-sm pt-1.5 border-t border-slate-200">
              <span>Total Bill Amount:</span>
              <span>{formatCurrency(invoice.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Amount Paid:</span>
              <span>{formatCurrency(invoice.paidAmount)}</span>
            </div>
            <div className="flex justify-between text-rose-700 font-bold text-xs pt-1 border-t border-slate-200">
              <span>Balance Outstanding:</span>
              <span>{formatCurrency(invoice.balanceAmount)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600">
            <span className="font-semibold text-slate-700">Remarks / Insurance Note: </span>
            {invoice.notes}
          </div>
        )}
      </div>
    </Modal>
  );
};
