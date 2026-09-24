"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  CalendarDays,
  Pill,
  FlaskConical,
  Receipt,
  FileBarChart,
  Bell,
  Settings,
  Activity,
  HeartHandshake,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHospitalData } from '@/context/HospitalDataContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { stats, notifications } = useHospitalData();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navLinks = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'Patients',
      href: '/admin/patients',
      icon: Users,
      badge: stats.totalPatients,
    },
    {
      name: 'Doctors',
      href: '/admin/doctors',
      icon: UserCheck,
      badge: stats.totalDoctors,
    },
    {
      name: 'Staff',
      href: '/admin/staff',
      icon: HeartHandshake,
    },
    {
      name: 'Departments',
      href: '/admin/departments',
      icon: Building2,
    },
    {
      name: 'Appointments',
      href: '/admin/appointments',
      icon: CalendarDays,
      badge: stats.todayAppointments,
    },
    {
      name: 'Medicines',
      href: '/admin/medicines',
      icon: Pill,
    },
    {
      name: 'Laboratory',
      href: '/admin/laboratory',
      icon: FlaskConical,
      badge: stats.pendingLabTests > 0 ? stats.pendingLabTests : undefined,
      badgeColor: 'bg-amber-100 text-amber-700',
    },
    {
      name: 'Billing',
      href: '/admin/billing',
      icon: Receipt,
      badge: stats.pendingBillsCount > 0 ? stats.pendingBillsCount : undefined,
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: FileBarChart,
    },
    {
      name: 'Notifications',
      href: '/admin/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
      badgeColor: 'bg-hospital-100 text-hospital-700',
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Hospital Branding Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-hospital-600 flex items-center justify-center text-white shadow-xs group-hover:bg-hospital-500 transition-colors">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-white leading-tight">
                Apex Memorial
              </span>
              <span className="text-[10px] text-hospital-400 font-semibold uppercase tracking-wider">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Hospital Management
          </div>

          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors group',
                  active
                    ? 'bg-hospital-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-colors',
                      active ? 'text-white' : 'text-slate-400 group-hover:text-hospital-400'
                    )}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-[18px] text-center',
                      active
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-slate-800 text-slate-300'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* System User Footer Profile */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-hospital-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                DR
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block truncate">
                  Dr. Arvind Sharma
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  Chief Medical Admin
                </span>
              </div>
            </div>

            <Link
              href="/"
              title="Return to Public Website"
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};
