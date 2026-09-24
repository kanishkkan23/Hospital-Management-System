"use client";

import React, { useState } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Building2 } from 'lucide-react';

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({ isOpen, onClose }) => {
  const { addDepartment } = useHospitalData();
  const { success } = useToast();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [headDoctor, setHeadDoctor] = useState('');
  const [totalBeds, setTotalBeds] = useState('30');
  const [location, setLocation] = useState('Block C, 3rd Floor');
  const [contactExtension, setContactExtension] = useState('Ext. 3050');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    addDepartment({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      headDoctor: headDoctor.trim() || 'Dr. Appointed Consultant',
      totalBeds: parseInt(totalBeds) || 20,
      occupiedBeds: 0,
      totalDoctors: 4,
      totalStaff: 12,
      description: description.trim() || 'Dedicated specialty inpatient and outpatient unit.',
      location: location.trim(),
      contactExtension: contactExtension.trim(),
    });

    success('Department Created', `${name} (${code}) added to hospital structure.`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Clinical Specialty / Department"
      description="Add a new medical ward, OPD division or clinical specialty."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Input
              label="Department Name"
              placeholder="e.g. Oncology & Radiation Sciences"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              label="Dept Code"
              placeholder="e.g. ONCO"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Head of Department"
            placeholder="Dr. Senior Consultant, MD"
            value={headDoctor}
            onChange={(e) => setHeadDoctor(e.target.value)}
            required
          />
          <Input
            label="Dedicated Beds"
            type="number"
            value={totalBeds}
            onChange={(e) => setTotalBeds(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Campus Floor / Block"
            placeholder="Block A, 4th Floor"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <Input
            label="Phone Intercom Extension"
            placeholder="Ext. 4020"
            value={contactExtension}
            onChange={(e) => setContactExtension(e.target.value)}
            required
          />
        </div>

        <Textarea
          label="Clinical Scope & Facilities Description"
          placeholder="Brief summary of procedures and intensive care equipment..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" type="submit" leftIcon={<Building2 className="w-4 h-4" />}>
            Create Department
          </Button>
        </div>
      </form>
    </Modal>
  );
};
