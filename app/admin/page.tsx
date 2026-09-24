"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useHospitalData } from '@/context/HospitalDataContext';
import {
  Users,
  UserCheck,
  Calendar,
  FlaskConical,
  Pill,
  Receipt,
  Bed,
  Plus,
  ArrowRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AddPatientModal } from '@/components/admin/modals/AddPatientModal';
import { ScheduleAppointmentModal } from '@/components/admin/modals/ScheduleAppointmentModal';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

export default function AdminDashboardPage() {
  const {
    stats,
    patients,
    appointments,
    labTests,
    medicines,
    invoices,
    updateAppointmentStatus,
  } = useHospitalData();

  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isScheduleAptOpen, setIsScheduleAptOpen] = useState(false);

  // Weekly Appointments & Inflow Data for Recharts
  const weeklyTrendData = [
    { day: 'Mon', appointments: 38, admissions: 12, emergency: 6 },
    { day: 'Tue', appointments: 45, admissions: 14, emergency: 8 },
    { day: 'Wed', appointments: 42, admissions: 11, emergency: 5 },
    { day: 'Thu', appointments: 52, admissions: 18, emergency: 9 },
    { day: 'Fri', appointments: 48, admissions: 15, emergency: 7 },
    { day: 'Sat', appointments: 35, admissions: 9, emergency: 11 },
    { day: 'Sun', appointments: 22, admissions: 6, emergency: 14 },
  ];

  const departmentLoadData = [
    { dept: 'Cardiology', patients: 38 },
    { dept: 'Neurology', patients: 29 },
    { dept: 'Orthopedics', patients: 31 },
    { dept: 'Surgery', patients: 42 },
    { dept: 'Emergency', patients: 54 },
    { dept: 'Pediatrics', patients: 20 },
  ];

  const pendingLabs = labTests.filter((l) => l.status !== 'Completed' && l.status !== 'Cancelled');
  const lowStockMeds = medicines.filter((m) => m.status === 'Low Stock' || m.status === 'Out of Stock');

  return (
    <div className="space-y-6">
      
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Hospital Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time clinical metrics, inpatient census, and outpatient scheduling queue.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsScheduleAptOpen(true)}
            leftIcon={<Calendar className="w-4 h-4" />}
          >
            Schedule OPD
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAddPatientOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Register Patient
          </Button>
        </div>
      </div>

      {/* 6 Key KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          subtitle="Registered UHID"
          icon={Users}
          colorScheme="blue"
        />
        <StatCard
          title="Active Doctors"
          value={stats.totalDoctors}
          subtitle="On Duty & OPD"
          icon={UserCheck}
          colorScheme="emerald"
        />
        <StatCard
          title="Appointments"
          value={stats.todayAppointments}
          subtitle="Scheduled Today"
          icon={Calendar}
          colorScheme="purple"
        />
        <StatCard
          title="Pending Labs"
          value={stats.pendingLabTests}
          subtitle="Diagnostics Queue"
          icon={FlaskConical}
          colorScheme="amber"
        />
        <StatCard
          title="Pharmacy Stock"
          value={stats.availableMedicines}
          subtitle="Items Available"
          icon={Pill}
          colorScheme="slate"
        />
        <StatCard
          title="Pending Bills"
          value={formatCurrency(stats.pendingBillsAmount)}
          subtitle={`${stats.pendingBillsCount} Open Invoices`}
          icon={Receipt}
          colorScheme="rose"
        />
      </div>

      {/* Recharts Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Clinical Volume */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader className="pb-2">
              <div>
                <CardTitle>Weekly Patient Consultations & Admissions</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparison between OPD Visits, Inpatient Admissions, and Emergency Cases
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-hospital-600" />
                  OPD Visits
                </span>
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  Admissions
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="appointments" fill="#0284c7" radius={[4, 4, 0, 0]} name="OPD Visits" />
                    <Bar dataKey="admissions" fill="#0d9488" radius={[4, 4, 0, 0]} name="Admissions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Inpatient Distribution */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Active Ward Occupancy</CardTitle>
              <Badge variant="emerald" size="sm">
                {stats.bedOccupancyRate}% Total Occupancy
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={departmentLoadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="dept" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="patients"
                      stroke="#0284c7"
                      fill="#e0f2fe"
                      name="Admitted Patients"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Today's Appointments & Recent Patients Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Today's Appointment Queue */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div>
                  <CardTitle>Today&apos;s OPD Appointment Queue</CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time status tracking for outpatient consultations</p>
                </div>
                <Link href="/admin/appointments" className="text-xs text-hospital-700 font-semibold hover:underline flex items-center gap-1">
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {appointments.slice(0, 5).map((apt) => (
                  <div key={apt.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-hospital-50 border border-hospital-100 flex items-center justify-center text-hospital-700 shrink-0 font-bold text-xs">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-xs truncate">{apt.patientName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{apt.patientUhid}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {apt.doctorName} • {apt.department}
                        </p>
                        <span className="text-[10px] text-slate-400 font-medium">{apt.timeSlot}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant={
                          apt.status === 'Completed'
                            ? 'emerald'
                            : apt.status === 'In Progress'
                            ? 'sky'
                            : apt.status === 'Cancelled'
                            ? 'rose'
                            : 'amber'
                        }
                        size="sm"
                        dot
                      >
                        {apt.status}
                      </Badge>

                      {apt.status === 'Scheduled' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                          title="Mark Completed"
                          className="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-emerald-50 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Registered Patients */}
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div>
                  <CardTitle>Recent Patient Registrations</CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">Newly admitted & outpatient entries</p>
                </div>
                <Link href="/admin/patients" className="text-xs text-hospital-700 font-semibold hover:underline flex items-center gap-1">
                  <span>Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {patients.slice(0, 5).map((p) => (
                  <div key={p.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-xs truncate">{p.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                          {p.bloodGroup}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {p.age} yrs • {p.gender} • {p.assignedDepartment || 'General OPD'}
                      </p>
                    </div>

                    <Badge
                      variant={
                        p.status === 'Inpatient'
                          ? 'emerald'
                          : p.status === 'Emergency'
                          ? 'rose'
                          : 'slate'
                      }
                      size="sm"
                    >
                      {p.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Bottom Grid: Pending Labs & Low Medicine Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending Laboratory Investigations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-amber-600" />
                <CardTitle>Pending Diagnostic Laboratory Orders</CardTitle>
              </div>
              <Link href="/admin/laboratory" className="text-xs text-hospital-700 font-semibold hover:underline">
                View Lab
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {pendingLabs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">All lab tests processed</div>
              ) : (
                pendingLabs.map((l) => (
                  <div key={l.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50">
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-900 block truncate">{l.testName}</span>
                      <span className="text-[11px] text-slate-500 block truncate">
                        Patient: {l.patientName} ({l.patientUhid}) • Ref: {l.referredByDoctor}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge
                        variant={l.priority.includes('STAT') ? 'rose' : l.priority === 'Urgent' ? 'amber' : 'slate'}
                        size="sm"
                      >
                        {l.priority}
                      </Badge>
                      <span className="text-[10px] text-slate-400 block mt-1">{l.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Pharmacy Inventory Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <CardTitle>Low Stock Pharmacy Alerts</CardTitle>
              </div>
              <Link href="/admin/medicines" className="text-xs text-hospital-700 font-semibold hover:underline">
                View Pharmacy
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {lowStockMeds.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">All pharmaceutical stocks healthy</div>
              ) : (
                lowStockMeds.map((m) => (
                  <div key={m.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50">
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-900 block truncate">{m.name}</span>
                      <span className="text-[11px] text-slate-500 block truncate">
                        {m.genericName} • {m.locationRack}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-rose-700 block">
                        {m.stockQuantity} Units Left
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Min Threshold: {m.minThreshold}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Modals */}
      <AddPatientModal isOpen={isAddPatientOpen} onClose={() => setIsAddPatientOpen(false)} />
      <ScheduleAppointmentModal isOpen={isScheduleAptOpen} onClose={() => setIsScheduleAptOpen(false)} />
    </div>
  );
}
