"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { TopNavbar } from '@/components/admin/TopNavbar';
import { AddPatientModal } from '@/components/admin/modals/AddPatientModal';
import { ScheduleAppointmentModal } from '@/components/admin/modals/ScheduleAppointmentModal';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isScheduleAptOpen, setIsScheduleAptOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopNavbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenQuickAddPatient={() => setIsAddPatientOpen(true)}
          onOpenQuickAddAppointment={() => setIsScheduleAptOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Quick Action Modals */}
      <AddPatientModal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
      />
      <ScheduleAppointmentModal
        isOpen={isScheduleAptOpen}
        onClose={() => setIsScheduleAptOpen(false)}
      />
    </div>
  );
}
