"use client";

import React, { useState } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { Department } from '@/types';
import {
  Building2,
  Plus,
  Bed,
  Users,
  UserCheck,
  MapPin,
  Phone,
  Activity,
  Heart,
  Brain,
  Bone,
  Baby,
  Stethoscope
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { AddDepartmentModal } from '@/components/admin/modals/AddDepartmentModal';

export default function DepartmentsManagementPage() {
  const { departments } = useHospitalData();
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredDepts = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase()) ||
    d.headDoctor.toLowerCase().includes(search.toLowerCase())
  );

  const getDeptIcon = (code: string) => {
    switch (code) {
      case 'CARDIO': return <Heart className="w-5 h-5 text-rose-600" />;
      case 'NEURO': return <Brain className="w-5 h-5 text-purple-600" />;
      case 'ORTHO': return <Bone className="w-5 h-5 text-amber-600" />;
      case 'PEDIATRICS': return <Baby className="w-5 h-5 text-sky-600" />;
      case 'EMERGENCY': return <Activity className="w-5 h-5 text-red-600" />;
      default: return <Stethoscope className="w-5 h-5 text-hospital-600" />;
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <Breadcrumbs items={[{ label: 'Departments' }]} className="mb-2" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Hospital Clinical Specialties & Units
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage inpatient wards, bed capacity, clinical staff allocations, and department heads.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Department
          </Button>
        </div>
      </div>

      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search clinical departments, codes, head physicians..."
          className="max-w-md"
        />
        <div className="text-xs text-slate-500 font-medium">
          Total Departments: <span className="font-bold text-slate-900">{departments.length}</span>
        </div>
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDepts.map((dept) => {
          const occupancyRate = dept.totalBeds > 0 ? Math.round((dept.occupiedBeds / dept.totalBeds) * 100) : 0;
          return (
            <div
              key={dept.id}
              className="p-5 rounded-xl border border-slate-200 bg-white shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                    {getDeptIcon(dept.code)}
                  </div>
                  <span className="font-mono text-xs font-bold text-hospital-700 bg-hospital-50 border border-hospital-200 px-2 py-0.5 rounded">
                    {dept.code}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{dept.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  {dept.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-500">Head of Dept:</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[180px]">{dept.headDoctor}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-500">Floor Location:</span>
                    <span className="font-medium text-slate-800">{dept.location}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-500">Clinical Team:</span>
                    <span className="font-semibold text-slate-800">
                      {dept.totalDoctors} Doctors • {dept.totalStaff} Staff
                    </span>
                  </div>
                </div>
              </div>

              {/* Bed Occupancy Progress Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-slate-400" />
                    <span>Bed Occupancy</span>
                  </span>
                  <span className="font-bold text-slate-900">
                    {dept.occupiedBeds} / {dept.totalBeds} Beds ({occupancyRate}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      occupancyRate > 85
                        ? 'bg-rose-500'
                        : occupancyRate > 65
                        ? 'bg-amber-500'
                        : 'bg-hospital-600'
                    }`}
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AddDepartmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
