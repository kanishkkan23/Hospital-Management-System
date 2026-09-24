"use client";

import React, { useState } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { useToast } from '@/components/ui/Toast';
import { InvoiceItem, PaymentMethod, PaymentStatus } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Receipt, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ isOpen, onClose }) => {
  const { addInvoice, patients } = useHospitalData();
  const { success } = useToast();

  const [patientUhid, setPatientUhid] = useState(patients[0]?.uhid || '');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [discount, setDiscount] = useState('0');
  const [notes, setNotes] = useState('');

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: 'OPD Specialist Consultation Fee', category: 'Consultation', quantity: 1, unitPrice: 1200, total: 1200 },
  ]);

  const handleAddItem = () => {
    setItems([
      ...items,
      { description: 'Laboratory Diagnostic Test', category: 'Laboratory', quantity: 1, unitPrice: 500, total: 500 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, val: any) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: val };
    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? parseFloat(val) || 0 : current.quantity;
      const u = field === 'unitPrice' ? parseFloat(val) || 0 : current.unitPrice;
      current.total = q * u;
    }
    updated[index] = current;
    setItems(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discountVal = parseFloat(discount) || 0;
  const totalAmount = Math.max(0, subtotal - discountVal);
  const paidAmount = paymentStatus === 'Paid' ? totalAmount : 0;
  const balanceAmount = Math.max(0, totalAmount - paidAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.uhid === patientUhid) || patients[0];
    if (!pat) return;

    const newInv = addInvoice({
      patientName: pat.name,
      patientUhid: pat.uhid,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate,
      items,
      subtotal,
      tax: 0,
      discount: discountVal,
      totalAmount,
      paidAmount,
      balanceAmount,
      paymentStatus,
      paymentMethod,
      notes: notes.trim() || undefined,
    });

    success('Invoice Generated', `Invoice ${newInv.invoiceNumber} created for ${pat.name}.`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Patient Hospital Bill / Invoice"
      description="Itemize inpatient bed stays, surgery charges, pharmacy, or diagnostic labs."
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Select
              label="Select Patient"
              value={patientUhid}
              onChange={(e) => setPatientUhid(e.target.value)}
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.uhid}>
                  {p.name} ({p.uhid}) - {p.status}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Input
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Itemized charges table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Billable Services & Medications</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="h-7 text-xs px-2"
            >
              Add Item
            </Button>
          </div>

          <div className="p-3 space-y-2.5 max-h-60 overflow-y-auto">
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center text-xs">
                <div className="col-span-5">
                  <Input
                    placeholder="Description / Service"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-3">
                  <Select
                    value={item.category}
                    onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Bed Charges">Bed Charges</option>
                    <option value="Surgery">Surgery / OT</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={items.length <= 1}
                    className="text-slate-400 hover:text-rose-600 disabled:opacity-30 p-1"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal & Discount Calculation */}
          <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-slate-600 font-medium">Subtotal: {formatCurrency(subtotal)}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Discount:</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-20 h-7 px-2 border border-slate-300 rounded text-xs bg-white"
                />
              </div>
            </div>
            <div>
              <span className="font-semibold text-slate-500 mr-2">Grand Total:</span>
              <span className="font-bold text-hospital-700 text-sm">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Payment Status"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
          >
            <option value="Paid">Fully Paid (Settled)</option>
            <option value="Pending">Pending / Unpaid</option>
            <option value="Partially Paid">Partially Paid</option>
          </Select>

          <Select
            label="Payment Mode"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          >
            <option value="Cash">Cash</option>
            <option value="Credit/Debit Card">Credit / Debit Card</option>
            <option value="UPI / Bank Transfer">UPI / Online Transfer</option>
            <option value="Insurance / TPA">Insurance / TPA Cashless</option>
          </Select>
        </div>

        <Input
          label="Billing Notes / Insurance Claim ID"
          placeholder="e.g. Star Health Pre-Auth #SH-9921"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" type="submit" leftIcon={<Receipt className="w-4 h-4" />}>
            Generate Invoice
          </Button>
        </div>
      </form>
    </Modal>
  );
};
