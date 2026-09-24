"use client";

import React, { useState } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { Doctor } from '@/types';
import {
  Star,
  Clock,
  Calendar,
  Award,
  MapPin,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';

interface DoctorsSectionProps {
  onSelectDoctorForBooking: (doctor: Doctor) => void;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({ onSelectDoctorForBooking }) => {
  const { doctors, departments } = useHospitalData();
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');

  const filteredDoctors = doctors.filter((doc) => {
    if (selectedDeptFilter === 'ALL') return true;
    return doc.department.toLowerCase().includes(selectedDeptFilter.toLowerCase());
  });

  return (
    <section id="doctors" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-hospital-600 uppercase tracking-widest bg-hospital-50 px-3 py-1 rounded-full border border-hospital-100">
            Medical Faculty
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 tracking-tight">
            Distinguished Specialist Physicians & Surgeons
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Book consultations directly with experienced department heads and board-certified clinicians.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          <button
            onClick={() => setSelectedDeptFilter('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              selectedDeptFilter === 'ALL'
                ? 'bg-hospital-600 text-white border-hospital-600'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Specialties ({doctors.length})
          </button>
          {departments.slice(0, 5).map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDeptFilter(dept.code)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selectedDeptFilter === dept.code
                  ? 'bg-hospital-600 text-white border-hospital-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {dept.name.split('&')[0].trim()}
            </button>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-hospital-300 hover:shadow-card transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4">
                  {/* Doctor Avatar / Icon placeholder */}
                  <div className="w-16 h-16 rounded-xl bg-hospital-50 border border-hospital-200 flex items-center justify-center font-bold text-hospital-700 text-xl shrink-0 overflow-hidden">
                    {doc.avatarUrl ? (
                      <img
                        src={doc.avatarUrl}
                        alt={doc.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      doc.name.split(' ')[1]?.[0] || 'D'
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h3>
                    </div>
                    <p className="text-xs font-semibold text-hospital-700 mt-0.5">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">{doc.qualifications}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="emerald" size="sm">
                        {doc.experienceYears}+ Years Exp
                      </Badge>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Room: {doc.roomNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-hospital-600 shrink-0" />
                    <span>Days: {doc.availableDays.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-hospital-600 shrink-0" />
                    <span>OPD Hours: {doc.availableHours}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">Consultation Fee</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {formatCurrency(doc.consultationFee)}
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => onSelectDoctorForBooking(doc)}
                  leftIcon={<Calendar className="w-3.5 h-3.5" />}
                >
                  Book Visit
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
