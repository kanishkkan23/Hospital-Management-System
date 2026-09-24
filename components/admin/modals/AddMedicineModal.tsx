"use client";

import React, { useState } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { useToast } from '@/components/ui/Toast';
import { MedicineCategory, MedicineStatus } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Pill } from 'lucide-react';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({ isOpen, onClose }) => {
  const { addMedicine } = useHospitalData();
  const { success } = useToast();

  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [category, setCategory] = useState<MedicineCategory>('Antibiotics');
  const [batchNumber, setBatchNumber] = useState(`BAT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [stockQuantity, setStockQuantity] = useState('200');
  const [minThreshold, setMinThreshold] = useState('50');
  const [unitPrice, setUnitPrice] = useState('150');
  const [expiryDate, setExpiryDate] = useState('2028-01-31');
  const [manufacturer, setManufacturer] = useState('Sun Pharma');
  const [locationRack, setLocationRack] = useState('Rack B-03');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !genericName.trim()) return;

    const qty = parseInt(stockQuantity) || 0;
    const thresh = parseInt(minThreshold) || 10;
    const status: MedicineStatus = qty <= 0 ? 'Out of Stock' : qty <= thresh ? 'Low Stock' : 'In Stock';

    addMedicine({
      name: name.trim(),
      genericName: genericName.trim(),
      category,
      batchNumber: batchNumber.trim(),
      stockQuantity: qty,
      minThreshold: thresh,
      unitPrice: parseFloat(unitPrice) || 50,
      expiryDate,
      manufacturer: manufacturer.trim(),
      locationRack: locationRack.trim(),
      status,
    });

    success('Medicine Added to Inventory', `${name} (${batchNumber}) stocked.`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Pharmacy Inventory Item"
      description="Stock new generic or branded medication, injectables, or IV fluids."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Brand / Commercial Name"
            placeholder="e.g. Augmentin 625 Duo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Generic Molecule & Strength"
            placeholder="e.g. Amoxicillin (500mg) + Clavulanic Acid"
            value={genericName}
            onChange={(e) => setGenericName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Therapeutic Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as MedicineCategory)}
          >
            <option value="Antibiotics">Antibiotics</option>
            <option value="Analgesics / Pain Relief">Analgesics / Pain Relief</option>
            <option value="Cardiovascular">Cardiovascular</option>
            <option value="Antidiabetic">Antidiabetic</option>
            <option value="Respiratory">Respiratory</option>
            <option value="Gastrointestinal">Gastrointestinal</option>
            <option value="Vitamins & Minerals">Vitamins & Minerals</option>
            <option value="Anesthetics">Anesthetics / ICU Drugs</option>
          </Select>

          <Input
            label="Batch Number"
            placeholder="e.g. AUG-2026-09"
            value={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Stock Quantity (Units)"
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            required
          />
          <Input
            label="Low-Stock Alert Level"
            type="number"
            value={minThreshold}
            onChange={(e) => setMinThreshold(e.target.value)}
            required
          />
          <Input
            label="Unit Price (INR)"
            type="number"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Expiry Date"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
          <Input
            label="Pharmaceutical Manufacturer"
            placeholder="e.g. Cipla Ltd."
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            required
          />
          <Input
            label="Pharmacy Rack / Storage"
            placeholder="e.g. Rack A-02"
            value={locationRack}
            onChange={(e) => setLocationRack(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" type="submit" leftIcon={<Pill className="w-4 h-4" />}>
            Add to Inventory
          </Button>
        </div>
      </form>
    </Modal>
  );
};
