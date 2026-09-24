"use client";

import React, { useState } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { Department } from '@/types';
import {
  Heart,
  Brain,
  Bone,
  Baby,
  Stethoscope,
  Activity,
  Bed,
  UserCheck,
  MapPin,
  Phone,
  ArrowRight
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface DepartmentsSectionProps {
  onOpenBookingModal: () => void;
}

export const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({ onOpenBookingModal }) => {
  const { departments } = useHospitalData();
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  const getDeptIcon = (code: string) => {
    switch (code) {
      case 'CARDIO':
        return <Heart className="w-5 h-5 text-rose-600" />;
      case 'NEURO':
        return <Brain className="w-5 h-5 text-purple-600" />;
      case 'ORTHO':
        return <Bone className="w-5 h-5 text-amber-600" />;
      case 'PEDIATRICS':
        return <Baby className="w-5 h-5 text-sky-600" />;
      case 'EMERGENCY':
        return <Activity className="w-5 h-5 text-red-600" />;
      default:
        return <Stethoscope className="w-5 h-5 text-hospital-600" />;
    }
  };

  return (
    <section id="departments" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-hospital-600 uppercase tracking-widest bg-hospital-50 px-3 py-1 rounded-full border border-hospital-100">
              Centers of Excellence
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 tracking-tight">
              Clinical Departments & Specialties
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Equipped with dedicated inpatient wards, critical care beds, and multidisciplinary specialist panels.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onOpenBookingModal} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Book Appointment by Department
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-hospital-300 hover:shadow-card transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                    {getDeptIcon(dept.code)}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                    {dept.code}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{dept.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {dept.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <UserCheck className="w-3.5 h-3.5 text-hospital-600" />
                    <span>Specialists</span>
                  </span>
                  <span className="font-semibold text-slate-800">{dept.totalDoctors} Doctors</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Bed className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Total Beds</span>
                  </span>
                  <span className="font-semibold text-slate-800">{dept.totalBeds} Beds</span>
                </div>

                <button
                  onClick={() => setSelectedDept(dept)}
                  className="w-full mt-2 text-center text-xs font-semibold text-hospital-700 hover:text-hospital-800 py-1.5 rounded-lg bg-hospital-50/70 hover:bg-hospital-100/70 transition-colors"
                >
                  View Details & OPD Info
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Department Detail Modal */}
      {selectedDept && (
        <Modal
          isOpen={!!selectedDept}
          onClose={() => setSelectedDept(null)}
          title={selectedDept.name}
          description={`Department Code: ${selectedDept.code} • ${selectedDept.location}`}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setSelectedDept(null)}>
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedDept(null);
                  onOpenBookingModal();
                }}
              >
                Book Appointment in {selectedDept.code}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {selectedDept.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-slate-500 block">Head of Department</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">{selectedDept.headDoctor}</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-slate-500 block">Clinical Extension</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">{selectedDept.contactExtension}</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-slate-500 block">Bed Capacity</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">
                  {selectedDept.totalBeds} Beds ({selectedDept.occupiedBeds} currently occupied)
                </span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-slate-500 block">Clinical Team</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">
                  {selectedDept.totalDoctors} Consultants, {selectedDept.totalStaff} Nursing Staff
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
