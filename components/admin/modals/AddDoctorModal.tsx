"use client";

import React, { useState, useEffect } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { useToast } from '@/components/ui/Toast';
import { Doctor, DoctorStatus } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { UserCheck } from 'lucide-react';

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorToEdit?: Doctor | null;
}

export const AddDoctorModal: React.FC<AddDoctorModalProps> = ({
  isOpen,
  onClose,
  doctorToEdit,
}) => {
  const { addDoctor, updateDoctor, departments } = useHospitalData();
  const { success } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [experienceYears, setExperienceYears] = useState('10');
  const [roomNumber, setRoomNumber] = useState('OPD-101');
  const [consultationFee, setConsultationFee] = useState('1000');
  const [availableHours, setAvailableHours] = useState('09:00 AM - 01:00 PM');
  const [status, setStatus] = useState<DoctorStatus>('Active');

  useEffect(() => {
    if (doctorToEdit) {
      setName(doctorToEdit.name);
      setEmail(doctorToEdit.email);
      setPhone(doctorToEdit.phone);
      setDepartment(doctorToEdit.department);
      setSpecialization(doctorToEdit.specialization);
      setQualifications(doctorToEdit.qualifications);
      setExperienceYears(doctorToEdit.experienceYears.toString());
      setRoomNumber(doctorToEdit.roomNumber);
      setConsultationFee(doctorToEdit.consultationFee.toString());
      setAvailableHours(doctorToEdit.availableHours);
      setStatus(doctorToEdit.status);
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setDepartment(departments[0]?.name || 'Cardiology & Vascular Sciences');
      setSpecialization('');
      setQualifications('MBBS, MD');
      setExperienceYears('10');
      setRoomNumber('OPD-201');
      setConsultationFee('1200');
      setAvailableHours('09:00 AM - 01:00 PM');
      setStatus('Active');
    }
  }, [doctorToEdit, isOpen, departments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !specialization.trim()) return;

    if (doctorToEdit) {
      updateDoctor(doctorToEdit.id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        department,
        specialization: specialization.trim(),
        qualifications: qualifications.trim(),
        experienceYears: parseInt(experienceYears) || 5,
        roomNumber: roomNumber.trim(),
        consultationFee: parseInt(consultationFee) || 1000,
        availableHours,
        status,
      });
      success('Doctor Record Updated', `Changes for ${name} have been saved.`);
    } else {
      addDoctor({
        name: name.trim(),
        email: email.trim() || `${name.toLowerCase().replace(/[^a-z]/g, '')}@apexmedical.org`,
        phone: phone.trim(),
        department,
        specialization: specialization.trim(),
        qualifications: qualifications.trim(),
        experienceYears: parseInt(experienceYears) || 5,
        roomNumber: roomNumber.trim(),
        consultationFee: parseInt(consultationFee) || 1000,
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        availableHours,
        status,
        rating: 4.8,
        totalConsultations: 0,
      });
      success('Doctor Added', `${name} successfully added to hospital medical faculty.`);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={doctorToEdit ? 'Edit Doctor Profile' : 'Add Consultant Physician / Surgeon'}
      description="Enter specialist doctor credentials, consultation timings and OPD fee."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Doctor Full Name"
            placeholder="e.g. Dr. Rajeshwar Patel"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Specialization Title"
            placeholder="e.g. Consultant Robotic Joint Surgeon"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Clinical Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </Select>

          <Input
            label="Qualifications & Degrees"
            placeholder="e.g. MBBS, MS (Ortho), MCh"
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Contact Phone"
            placeholder="+91 98200 11223"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="doctor@apexmedical.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Experience (Years)"
            type="number"
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="OPD Room Number"
            placeholder="e.g. OPD-302"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
          />
          <Input
            label="Consultation Fee (INR)"
            type="number"
            value={consultationFee}
            onChange={(e) => setConsultationFee(e.target.value)}
            required
          />
          <Select
            label="Duty Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as DoctorStatus)}
          >
            <option value="Active">Active / On Duty</option>
            <option value="In Surgery">In Surgery</option>
            <option value="On Leave">On Leave</option>
            <option value="Off Duty">Off Duty</option>
          </Select>
        </div>

        <div>
          <Input
            label="OPD Consultation Hours"
            placeholder="e.g. 09:00 AM - 01:00 PM"
            value={availableHours}
            onChange={(e) => setAvailableHours(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" type="submit" leftIcon={<UserCheck className="w-4 h-4" />}>
            {doctorToEdit ? 'Save Changes' : 'Add Doctor'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
