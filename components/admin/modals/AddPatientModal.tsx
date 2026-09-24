"use client";

import React, { useState, useEffect } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { useToast } from '@/components/ui/Toast';
import { Patient, Gender, BloodGroup, PatientStatus } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { generateUHID } from '@/lib/utils';
import { UserPlus } from 'lucide-react';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientToEdit?: Patient | null;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
  patientToEdit,
}) => {
  const { addPatient, updatePatient, doctors, departments } = useHospitalData();
  const { success } = useToast();

  const [name, setName] = useState('');
  const [age, setAge] = useState('45');
  const [gender, setGender] = useState<Gender>('Male');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('B+');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [status, setStatus] = useState<PatientStatus>('Inpatient');
  const [assignedDoctor, setAssignedDoctor] = useState('');
  const [assignedDepartment, setAssignedDepartment] = useState('');
  const [roomBed, setRoomBed] = useState('');
  const [diagnosisText, setDiagnosisText] = useState('');
  const [allergiesText, setAllergiesText] = useState('');

  useEffect(() => {
    if (patientToEdit) {
      setName(patientToEdit.name);
      setAge(patientToEdit.age.toString());
      setGender(patientToEdit.gender);
      setBloodGroup(patientToEdit.bloodGroup);
      setPhone(patientToEdit.phone);
      setEmail(patientToEdit.email);
      setAddress(patientToEdit.address);
      setEmergencyContact(patientToEdit.emergencyContact);
      setStatus(patientToEdit.status);
      setAssignedDoctor(patientToEdit.assignedDoctor || '');
      setAssignedDepartment(patientToEdit.assignedDepartment || '');
      setRoomBed(patientToEdit.roomBed || '');
      setDiagnosisText(patientToEdit.diagnoses.join(', '));
      setAllergiesText(patientToEdit.allergies?.join(', ') || '');
    } else {
      setName('');
      setAge('35');
      setGender('Male');
      setBloodGroup('O+');
      setPhone('');
      setEmail('');
      setAddress('');
      setEmergencyContact('');
      setStatus('Inpatient');
      setAssignedDoctor(doctors[0]?.name || '');
      setAssignedDepartment(departments[0]?.name || '');
      setRoomBed('Ward-A-Bed-01');
      setDiagnosisText('');
      setAllergiesText('');
    }
  }, [patientToEdit, isOpen, doctors, departments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const diagnoses = diagnosisText
      ? diagnosisText.split(',').map((d) => d.trim()).filter(Boolean)
      : ['General Medical Evaluation'];
    const allergies = allergiesText
      ? allergiesText.split(',').map((a) => a.trim()).filter(Boolean)
      : undefined;

    if (patientToEdit) {
      updatePatient(patientToEdit.id, {
        name: name.trim(),
        age: parseInt(age) || 30,
        gender,
        bloodGroup,
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        emergencyContact: emergencyContact.trim(),
        status,
        assignedDoctor,
        assignedDepartment,
        roomBed: status === 'Inpatient' || status === 'Emergency' ? roomBed : undefined,
        diagnoses,
        allergies,
      });
      success('Patient Updated', `Record for ${name} has been updated.`);
    } else {
      const newPatient = addPatient({
        uhid: generateUHID(),
        name: name.trim(),
        age: parseInt(age) || 30,
        gender,
        bloodGroup,
        phone: phone.trim(),
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
        address: address.trim() || 'Navi Mumbai',
        emergencyContact: emergencyContact.trim() || `${phone} (Self)`,
        status,
        admittedDate: status === 'Inpatient' || status === 'Emergency' ? new Date().toISOString() : undefined,
        assignedDoctor,
        assignedDepartment,
        roomBed: status === 'Inpatient' || status === 'Emergency' ? roomBed : undefined,
        diagnoses,
        allergies,
      });
      success('Patient Registered', `UHID ${newPatient.uhid} generated for ${newPatient.name}.`);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={patientToEdit ? 'Edit Patient Clinical Record' : 'Register New Patient'}
      description="Enter patient demographic and admission details."
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Personal Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Patient Full Name"
            placeholder="e.g. Rameshwar Gupta"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Contact Phone Number"
            placeholder="+91 98200 12345"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
            onChange={(e) => setGender(e.target.value as Gender)}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Select>

          <Select
            label="Blood Group"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
          >
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </Select>

          <Select
            label="Admission Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as PatientStatus)}
          >
            <option value="Inpatient">Inpatient (Admitted)</option>
            <option value="Outpatient">Outpatient (OPD)</option>
            <option value="Emergency">Emergency Bay</option>
            <option value="Discharged">Discharged</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Email Address"
            type="email"
            placeholder="patient@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Emergency Contact & Relationship"
            placeholder="e.g. Sarita Gupta (+91 98200 12340) - Wife"
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
          />
        </div>

        {/* Clinical Assignment */}
        <div className="pt-2 border-t border-slate-100">
          <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Clinical Assignment & Location
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Assigned Department"
              value={assignedDepartment}
              onChange={(e) => {
                setAssignedDepartment(e.target.value);
                const firstDoc = doctors.find(
                  (d) => d.department.toLowerCase() === e.target.value.toLowerCase()
                );
                if (firstDoc) setAssignedDoctor(firstDoc.name);
              }}
            >
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </Select>

            <Select
              label="Primary Consultant Doctor"
              value={assignedDoctor}
              onChange={(e) => setAssignedDoctor(e.target.value)}
            >
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.name}>
                  {doc.name} ({doc.specialization.split(' ')[0]})
                </option>
              ))}
            </Select>

            <Input
              label="Room / Bed Number"
              placeholder="e.g. ICU-Bed-04 or Ward 2B-12"
              value={roomBed}
              onChange={(e) => setRoomBed(e.target.value)}
            />
          </div>
        </div>

        {/* Medical History */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Textarea
            label="Clinical Diagnoses (Comma separated)"
            placeholder="Acute Coronary Syndrome, Hypertension Grade II"
            value={diagnosisText}
            onChange={(e) => setDiagnosisText(e.target.value)}
            rows={2}
          />

          <Textarea
            label="Known Drug Allergies"
            placeholder="Penicillin, Sulfa drugs, Dust"
            value={allergiesText}
            onChange={(e) => setAllergiesText(e.target.value)}
            rows={2}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" type="submit" leftIcon={<UserPlus className="w-4 h-4" />}>
            {patientToEdit ? 'Save Changes' : 'Register Patient'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
