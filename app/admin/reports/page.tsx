"use client";

import React, { useState } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import {
  FileBarChart,
  Printer,
  Download,
  Calendar,
  DollarSign,
  Users,
  Bed,
  Activity
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function ReportsPage() {
  const { stats, departments, invoices } = useHospitalData();
  const [timeRange, setTimeRange] = useState('This Month');

  // Revenue by Department
  const revenueData = [
    { department: 'Cardiology', revenue: 420000 },
    { department: 'Orthopedics', revenue: 380000 },
    { department: 'General Surgery', revenue: 290000 },
    { department: 'Neurology', revenue: 240000 },
    { department: 'Obstetrics', revenue: 195000 },
    { department: 'Radiology', revenue: 165000 },
  ];

  // Monthly Admissions Trend
  const monthlyInflowData = [
    { month: 'Apr', admissions: 140, opd: 820 },
    { month: 'May', admissions: 165, opd: 910 },
    { month: 'Jun', admissions: 180, opd: 980 },
    { month: 'Jul', admissions: 195, opd: 1040 },
    { month: 'Aug', admissions: 210, opd: 1120 },
    { month: 'Sep', admissions: 230, opd: 1250 },
  ];

  // Patient Gender Demographics
  const demographicData = [
    { name: 'Male Patients', value: 54, color: '#0284c7' },
    { name: 'Female Patients', value: 42, color: '#0d9488' },
    { name: 'Pediatric / Other', value: 4, color: '#eab308' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs items={[{ label: 'Reports & Analytics' }]} className="mb-2" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Hospital Performance Reports & Clinical Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Comprehensive statistical insights on patient flow, bed occupancy, and department revenue.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="h-9 px-3 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="This Week">This Week</option>
              <option value="This Month">This Month (Sep 2026)</option>
              <option value="Last Quarter">Last Quarter (Q2 2026)</option>
              <option value="Year to Date">Year to Date (2026)</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4" />}
            >
              Print Report
            </Button>
          </div>
        </div>
      </div>

      {/* Summary KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Monthly Revenue</span>
          <div className="text-xl font-bold text-slate-900 mt-1">₹16,90,000</div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">+12.4% vs last month</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Average Bed Occupancy</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{stats.bedOccupancyRate}%</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Optimal capacity threshold</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total Outpatient Visits</span>
          <div className="text-xl font-bold text-slate-900 mt-1">1,250 Consults</div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Avg 48 visits / day</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Clinical Lab Efficiency</span>
          <div className="text-xl font-bold text-slate-900 mt-1">98.2%</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Same-day turnaround time</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Inpatient Admissions & Outpatient Growth Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyInflowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        fontSize: '12px',
                      }}
                    />
                    <Line type="monotone" dataKey="opd" stroke="#0284c7" strokeWidth={2.5} name="OPD Visits" />
                    <Line type="monotone" dataKey="admissions" stroke="#0d9488" strokeWidth={2.5} name="Inpatient Admissions" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demographics Pie */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Demographics Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={demographicData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {demographicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                {demographicData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </span>
                    <span className="font-bold text-slate-800">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Revenue Breakdown */}
        <div className="lg:col-span-12">
          <Card>
            <CardHeader>
              <CardTitle>Departmental Clinical Revenue (INR)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                    <Tooltip
                      formatter={(val: number) => [formatCurrency(val), 'Revenue']}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="revenue" fill="#0284c7" radius={[4, 4, 0, 0]} name="Gross Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
