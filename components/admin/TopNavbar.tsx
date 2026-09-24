"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  Bell,
  Search,
  Plus,
  ExternalLink,
  CheckCircle2,
  Calendar,
  UserPlus,
  FlaskConical,
  Receipt,
  X
} from 'lucide-react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { Button } from '@/components/ui/Button';

interface TopNavbarProps {
  onToggleSidebar: () => void;
  onOpenQuickAddPatient?: () => void;
  onOpenQuickAddAppointment?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onToggleSidebar,
  onOpenQuickAddPatient,
  onOpenQuickAddAppointment,
}) => {
  const { notifications, markAllNotificationsRead } = useHospitalData();
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Sidebar Trigger & Hospital Name */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-800">Apex Memorial Hospital</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">Live Clinical Management Console</span>
        </div>
      </div>

      {/* Right: Quick Actions, Notifications, Public Site Link */}
      <div className="flex items-center gap-2.5">
        
        {/* Quick Add Dropdown */}
        <div className="relative">
          <Button
            size="sm"
            onClick={() => setQuickAddOpen(!quickAddOpen)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="hidden sm:inline-flex"
          >
            Quick Action
          </Button>

          {quickAddOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setQuickAddOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-elevated border border-slate-200 py-1.5 z-40 text-xs">
                <div className="px-3 py-1 font-semibold text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100 mb-1">
                  Create Hospital Record
                </div>
                {onOpenQuickAddPatient && (
                  <button
                    onClick={() => {
                      setQuickAddOpen(false);
                      onOpenQuickAddPatient();
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-hospital-600" />
                    <span>Register New Patient</span>
                  </button>
                )}
                {onOpenQuickAddAppointment && (
                  <button
                    onClick={() => {
                      setQuickAddOpen(false);
                      onOpenQuickAddAppointment();
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Schedule Appointment</span>
                  </button>
                )}
                <Link
                  href="/admin/laboratory"
                  onClick={() => setQuickAddOpen(false)}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
                  <span>Order Lab Test</span>
                </Link>
                <Link
                  href="/admin/billing"
                  onClick={() => setQuickAddOpen(false)}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Receipt className="w-3.5 h-3.5 text-purple-600" />
                  <span>Create Bill / Invoice</span>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Hospital Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {notifDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setNotifDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-elevated border border-slate-200 overflow-hidden z-40">
                <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-xs">Hospital Notifications</span>
                    {unreadNotifs.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-hospital-100 text-hospital-700 font-bold text-[10px]">
                        {unreadNotifs.length} new
                      </span>
                    )}
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-hospital-700 hover:underline font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No notifications at this time
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-xs transition-colors hover:bg-slate-50 ${
                          !n.isRead ? 'bg-hospital-50/40 font-medium' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-slate-900">{n.title}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
                  <Link
                    href="/admin/notifications"
                    onClick={() => setNotifDropdownOpen(false)}
                    className="text-xs text-hospital-700 hover:underline font-semibold block py-1"
                  >
                    View All Notifications & Alerts
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Return to Public Website */}
        <Link href="/">
          <Button variant="outline" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
            <span className="hidden md:inline">Public Site</span>
            <span className="md:hidden">Site</span>
          </Button>
        </Link>
      </div>
    </header>
  );
};
