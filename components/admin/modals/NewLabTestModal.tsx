"use client";

import React, { useState } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { useToast } from '@/components/ui/Toast';
import { LabTestPriority } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FlaskConical } from 'lucide-react';

interface NewLabTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewLabTestModal: React.FC<NewLabTestModalProps> = ({ isOpen, onClose }) => {
  const { addLabTest, patients, doctors } = useHospitalData();
  const { success } = useToast();

  const [patientUhid, setPatientUhid] = useState(patients[0]?.uhid || '');
  const [testName, setTestName] = useState('Complete Blood Count (CBC) with ESR');
  const [category, setCategory] = useState('Hematology');
  const [referredByDoctor, setReferredByDoctor] = useState(doctors[0]?.name || '');
  const [priority, setPriority] = useState<LabTestPriority>('Routine');
  const [sampleType, setSampleType] = useState('Whole Blood (EDTA)');
  const [cost, setCost] = useState('450');

  const labCatalog: Record<string, { category: string; sample: string; cost: number }> = {
    'Complete Blood Count (CBC) with ESR': { category: 'Hematology', sample: 'Whole Blood (EDTA)', cost: 450 },
    'Comprehensive Lipid Profile (Cholesterol, HDL, LDL)': { category: 'Biochemistry', sample: 'Serum (Fasting)', cost: 850 },
    'Liver Function Test (LFT Panel)': { category: 'Biochemistry', sample: 'Serum', cost: 750 },
    'Renal Function & Electrolytes (KFT)': { category: 'Biochemistry', sample: 'Serum', cost: 650 },
    'HbA1c Glycated Hemoglobin': { category: 'Biochemistry', sample: 'Whole Blood', cost: 550 },
    'High Sensitivity Troponin-I (Cardiac)': { category: 'Biochemistry', sample: 'Serum', cost: 1600 },
    'MRI Brain 3.0T with Contrast': { category: 'Radiology', sample: 'Diagnostic Scan', cost: 7500 },
    'Digital Chest X-Ray (PA View)': { category: 'Radiology', sample: 'Diagnostic Scan', cost: 500 },
    'Urine Routine & Microscopic Examination': { category: 'Clinical Pathology', sample: 'Clean Catch Midstream Urine', cost: 250 },
  };

  const handleTestSelection = (name: string) => {
    setTestName(name);
    if (labCatalog[name]) {
      setCategory(labCatalog[name].category);
      setSampleType(labCatalog[name].sample);
      setCost(labCatalog[name].cost.toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.uhid === patientUhid) || patients[0];
    if (!pat) return;

    addLabTest({
      testName,
      category,
      patientName: pat.name,
      patientUhid: pat.uhid,
      referredByDoctor,
      priority,
      sampleType,
      status: 'Pending Sample',
      cost: parseFloat(cost) || 500,
    });

    success('Diagnostic Test Ordered', `${testName} ordered for ${pat.name}.`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Order Diagnostic Laboratory / Imaging Test"
      description="Create a lab test requisition order for clinical pathology or radiology."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
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
          <Select
            label="Diagnostic Investigation Test"
            value={testName}
            onChange={(e) => handleTestSelection(e.target.value)}
            required
          >
            {Object.keys(labCatalog).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Test Discipline / Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <Input
            label="Sample Type Required"
            value={sampleType}
            onChange={(e) => setSampleType(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Referring Doctor"
            value={referredByDoctor}
            onChange={(e) => setReferredByDoctor(e.target.value)}
            required
          >
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.name}>
                {doc.name}
              </option>
            ))}
          </Select>

          <Select
            label="Urgency / Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as LabTestPriority)}
          >
            <option value="Routine">Routine</option>
            <option value="Urgent">Urgent (2 Hours)</option>
            <option value="STAT (Emergency)">STAT (Emergency)</option>
          </Select>

          <Input
            label="Test Charge (INR)"
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" type="submit" leftIcon={<FlaskConical className="w-4 h-4" />}>
            Order Investigation
          </Button>
        </div>
      </form>
    </Modal>
  );
};
