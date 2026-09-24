"use client";

import React, { useState } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { useToast } from '@/components/ui/Toast';
import { StaffRole, ShiftType, StaffStatus } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { HeartHandshake } from 'lucide-react';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose }) => {
  const { addStaff, departments } = useHospitalData();
  const { success } = useToast();

  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffRole>('Nurse');
  const [department, setDepartment] = useState(departments[0]?.name || 'Cardiology & Vascular Sciences');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [shift, setShift] = useState<ShiftType>('Morning (07:00 - 15:00)');
  const [status, setStatus] = useState<StaffStatus>('Active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addStaff({
      name: name.trim(),
      role,
      department,
      phone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/[^a-z]/g, '')}@apexmedical.org`,
      shift,
      status,
      joinDate: new Date().toISOString().split('T')[0],
    });

    success('Staff Registered', `${name} has been enrolled in ${department}.`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Clinical / Administrative Staff"
      description="Register nursing staff, lab technicians, pharmacists, and administrators."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Staff Member Full Name"
          placeholder="e.g. Sister Mary Varghese"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Designation / Role"
            value={role}
            onChange={(e) => setRole(e.target.value as StaffRole)}
          >
            <option value="Nurse">Staff Nurse</option>
            <option value="Ward In-Charge">Ward In-Charge</option>
            <option value="Lab Technician">Lab Technician</option>
            <option value="Pharmacist">Clinical Pharmacist</option>
            <option value="Radiologist">Radiology Tech</option>
            <option value="Receptionist">Front Desk / Receptionist</option>
            <option value="Administrator">Operations Administrator</option>
          </Select>

          <Select
            label="Assigned Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Phone Number"
            placeholder="+91 98200 55441"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="staff@apexmedical.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Rostered Shift"
            value={shift}
            onChange={(e) => setShift(e.target.value as ShiftType)}
          >
            <option value="Morning (07:00 - 15:00)">Morning (07:00 - 15:00)</option>
            <option value="Evening (15:00 - 23:00)">Evening (15:00 - 23:00)</option>
            <option value="Night (23:00 - 07:00)">Night (23:00 - 07:00)</option>
            <option value="General (09:00 - 17:00)">General (09:00 - 17:00)</option>
          </Select>

          <Select
            label="Duty Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as StaffStatus)}
          >
            <option value="Active">Active / On Duty</option>
            <option value="On Leave">On Leave</option>
            <option value="Off Duty">Off Duty</option>
          </Select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" type="submit" leftIcon={<HeartHandshake className="w-4 h-4" />}>
            Enroll Staff
          </Button>
        </div>
      </form>
    </Modal>
  );
};
