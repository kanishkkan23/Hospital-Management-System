"use client";

import React, { useState, useEffect } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { useToast } from '@/components/ui/Toast';
import { Doctor, AppointmentType } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Calendar, CheckCircle2, Clock, User, Phone, Stethoscope } from 'lucide-react';
import { generateUHID, formatCurrency } from '@/lib/utils';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDoctor?: Doctor | null;
}

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  isOpen,
  onClose,
  preselectedDoctor,
}) => {
  const { doctors, departments, addAppointment, addPatient, patients } = useHospitalData();
  const { success } = useToast();

  const [department, setDepartment] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string>('');
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('35');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [type, setType] = useState<AppointmentType>('Routine Checkup');
  const [symptoms, setSymptoms] = useState('');

  const [bookingConfirmed, setBookingConfirmed] = useState<{
    appointmentNumber: string;
    doctorName: string;
    department: string;
    date: string;
    timeSlot: string;
    patientName: string;
  } | null>(null);

  // Sync preselected doctor
  useEffect(() => {
    if (preselectedDoctor) {
      setDoctorId(preselectedDoctor.id);
      setDepartment(preselectedDoctor.department);
    } else if (departments.length > 0 && !department) {
      setDepartment(departments[0].name);
    }
  }, [preselectedDoctor, departments]);

  // Available doctors for selected department
  const availableDoctors = doctors.filter(
    (d) => !department || d.department.toLowerCase() === department.toLowerCase()
  );

  const selectedDoctor = doctors.find((d) => d.id === doctorId) || availableDoctors[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !phone.trim() || !selectedDoctor) return;

    // Check if patient exists, or create new patient record
    let patientUhid = '';
    const existing = patients.find((p) => p.phone === phone.trim());
    if (existing) {
      patientUhid = existing.uhid;
    } else {
      patientUhid = generateUHID();
      addPatient({
        uhid: patientUhid,
        name: patientName.trim(),
        age: parseInt(age) || 30,
        gender,
        bloodGroup: 'B+',
        phone: phone.trim(),
        email: email.trim() || `${patientName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        address: 'Navi Mumbai',
        emergencyContact: `${phone} (Self)`,
        status: 'Outpatient',
        assignedDoctor: selectedDoctor.name,
        assignedDepartment: selectedDoctor.department,
        diagnoses: [symptoms || 'OPD General Consultation'],
      });
    }

    // Create Appointment
    const newApt = addAppointment({
      patientName: patientName.trim(),
      patientUhid,
      patientPhone: phone.trim(),
      patientEmail: email.trim(),
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      department: selectedDoctor.department,
      date,
      timeSlot,
      type,
      status: 'Scheduled',
      symptoms: symptoms.trim() || 'General OPD checkup',
    });

    setBookingConfirmed({
      appointmentNumber: newApt.appointmentNumber,
      doctorName: selectedDoctor.name,
      department: selectedDoctor.department,
      date,
      timeSlot,
      patientName: patientName.trim(),
    });

    success(
      'Appointment Confirmed!',
      `Reference #${newApt.appointmentNumber} scheduled with ${selectedDoctor.name}.`
    );
  };

  const handleResetAndClose = () => {
    setBookingConfirmed(null);
    setPatientName('');
    setPhone('');
    setEmail('');
    setSymptoms('');
    onClose();
  };

  const timeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={bookingConfirmed ? 'Appointment Confirmed' : 'Book an Outpatient (OPD) Consultation'}
      description={
        bookingConfirmed
          ? 'Your consultation has been recorded in the hospital scheduling system.'
          : 'Select a doctor, preferred date & time, and provide patient details.'
      }
      size="lg"
    >
      {bookingConfirmed ? (
        <div className="py-4 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900">Appointment Scheduled Successfully</h4>
            <p className="text-xs text-slate-600 mt-1">
              Please arrive 15 minutes prior to your time slot for vital registration at OPD reception.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2.5 max-w-md mx-auto text-xs">
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Appointment Ref #</span>
              <span className="font-bold text-hospital-700">{bookingConfirmed.appointmentNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Patient Name</span>
              <span className="font-semibold text-slate-800">{bookingConfirmed.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Consultant Doctor</span>
              <span className="font-semibold text-slate-800">{bookingConfirmed.doctorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Department</span>
              <span className="font-semibold text-slate-800">{bookingConfirmed.department}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200">
              <span className="text-slate-500">Scheduled Date & Time</span>
              <span className="font-bold text-emerald-700">
                {bookingConfirmed.date} at {bookingConfirmed.timeSlot}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={handleResetAndClose} className="w-full max-w-md mx-auto justify-center">
              Done / Book Another
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Department & Doctor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Select Clinical Department"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                const firstDoc = doctors.find(
                  (d) => d.department.toLowerCase() === e.target.value.toLowerCase()
                );
                if (firstDoc) setDoctorId(firstDoc.id);
              }}
              required
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </Select>

            <Select
              label="Consultant Doctor"
              value={doctorId || selectedDoctor?.id || ''}
              onChange={(e) => setDoctorId(e.target.value)}
              required
            >
              {availableDoctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.specialization.split(' ')[0]}) - {formatCurrency(doc.consultationFee)}
                </option>
              ))}
            </Select>
          </div>

          {/* Step 2: Date & Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Appointment Date"
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <Select
              label="Preferred Time Slot"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              required
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </Select>

            <Select
              label="Consultation Type"
              value={type}
              onChange={(e) => setType(e.target.value as AppointmentType)}
              required
            >
              <option value="Routine Checkup">Routine Checkup</option>
              <option value="Specialist Consultation">Specialist Consultation</option>
              <option value="Follow-up">Follow-up Visit</option>
              <option value="Emergency">Emergency Evaluation</option>
            </Select>
          </div>

          {/* Step 3: Patient Information */}
          <div className="pt-2 border-t border-slate-100">
            <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
              Patient Identification Details
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Patient Full Name"
                placeholder="e.g. Rahul Sharma"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />

              <Input
                label="Contact Phone Number"
                placeholder="e.g. +91 98200 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <Input
                label="Age (Years)"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />

              <Select
                label="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>

              <Input
                label="Email (Optional)"
                placeholder="patient@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mt-3">
              <Textarea
                label="Presenting Symptoms / Chief Complaint"
                placeholder="Briefly describe health concerns, previous treatments, or pain symptoms..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          {/* Consultation Details Footer */}
          {selectedDoctor && (
            <div className="p-3 bg-hospital-50/70 border border-hospital-100 rounded-lg flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-600">Consultant: </span>
                <span className="font-semibold text-slate-900">{selectedDoctor.name}</span>
                <span className="text-slate-500 block">Room {selectedDoctor.roomNumber} • {selectedDoctor.availableHours}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">Consultation Fee</span>
                <span className="font-bold text-hospital-700 text-sm">
                  {formatCurrency(selectedDoctor.consultationFee)}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={handleResetAndClose}>
              Cancel
            </Button>
            <Button size="sm" type="submit" leftIcon={<Calendar className="w-4 h-4" />}>
              Confirm Appointment
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
