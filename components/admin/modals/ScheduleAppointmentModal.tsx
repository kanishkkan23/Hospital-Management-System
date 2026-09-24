"use client";

import React, { useState } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { useToast } from '@/components/ui/Toast';
import { AppointmentType } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Calendar } from 'lucide-react';
import { generateUHID } from '@/lib/utils';

interface ScheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleAppointmentModal: React.FC<ScheduleAppointmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { doctors, departments, patients, addAppointment, addPatient } = useHospitalData();
  const { success } = useToast();

  const [selectedPatientUhid, setSelectedPatientUhid] = useState('NEW');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [department, setDepartment] = useState(departments[0]?.name || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [type, setType] = useState<AppointmentType>('Routine Checkup');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');

  const handlePatientSelect = (uhid: string) => {
    setSelectedPatientUhid(uhid);
    if (uhid === 'NEW') {
      setPatientName('');
      setPatientPhone('');
    } else {
      const p = patients.find((pat) => pat.uhid === uhid);
      if (p) {
        setPatientName(p.name);
        setPatientPhone(p.phone);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) return;

    const doc = doctors.find((d) => d.id === doctorId) || doctors[0];
    let finalUhid = selectedPatientUhid;

    if (selectedPatientUhid === 'NEW') {
      finalUhid = generateUHID();
      addPatient({
        uhid: finalUhid,
        name: patientName.trim(),
        age: 35,
        gender: 'Male',
        bloodGroup: 'B+',
        phone: patientPhone.trim(),
        email: `${patientName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        address: 'Navi Mumbai',
        emergencyContact: `${patientPhone} (Self)`,
        status: 'Outpatient',
        assignedDoctor: doc.name,
        assignedDepartment: doc.department,
        diagnoses: [symptoms || 'OPD Consultation'],
      });
    }

    const newApt = addAppointment({
      patientName: patientName.trim(),
      patientUhid: finalUhid,
      patientPhone: patientPhone.trim(),
      doctorId: doc.id,
      doctorName: doc.name,
      department: doc.department,
      date,
      timeSlot,
      type,
      status: 'Scheduled',
      symptoms: symptoms.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    success('Appointment Scheduled', `Appointment ${newApt.appointmentNumber} created for ${patientName}.`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule OPD Appointment"
      description="Book a consultation slot for an existing or new hospital patient."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Select
            label="Select Patient"
            value={selectedPatientUhid}
            onChange={(e) => handlePatientSelect(e.target.value)}
          >
            <option value="NEW">+ Register as New Patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.uhid}>
                {p.name} ({p.uhid}) - {p.phone}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Patient Name"
            placeholder="Full Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            disabled={selectedPatientUhid !== 'NEW'}
            required
          />
          <Input
            label="Contact Phone"
            placeholder="+91 98200 12345"
            value={patientPhone}
            onChange={(e) => setPatientPhone(e.target.value)}
            disabled={selectedPatientUhid !== 'NEW'}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Clinical Department"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              const firstDoc = doctors.find(
                (d) => d.department.toLowerCase() === e.target.value.toLowerCase()
              );
              if (firstDoc) setDoctorId(firstDoc.id);
            }}
          >
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </Select>

          <Select
            label="Consultant Doctor"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          >
            {doctors
              .filter((d) => !department || d.department.toLowerCase() === department.toLowerCase())
              .map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.roomNumber})
                </option>
              ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Appointment Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Select
            label="Time Slot"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
          >
            {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '03:00 PM', '04:00 PM'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          <Select
            label="Consultation Type"
            value={type}
            onChange={(e) => setType(e.target.value as AppointmentType)}
          >
            <option value="Routine Checkup">Routine Checkup</option>
            <option value="Follow-up">Follow-up Visit</option>
            <option value="Specialist Consultation">Specialist Consult</option>
            <option value="Emergency">Emergency</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Textarea
            label="Presenting Symptoms / Reason"
            placeholder="e.g. Chest tightness on exertion, routine review..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={2}
          />
          <Textarea
            label="Clinical / Desk Notes"
            placeholder="e.g. Bring previous angiography disk..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" type="submit" leftIcon={<Calendar className="w-4 h-4" />}>
            Schedule Slot
          </Button>
        </div>
      </form>
    </Modal>
  );
};
