"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useHospitalData } from '@/context/HospitalDataContext';
import { useToast } from '@/components/ui/Toast';
import {
  Bell,
  CheckCheck,
  Trash2,
  ShieldAlert,
  AlertTriangle,
  Clock,
  ExternalLink,
  Info
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { Badge } from '@/components/ui/Badge';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, dismissNotification } = useHospitalData();
  const { success } = useToast();
  const [filterType, setFilterType] = useState('ALL');

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'UNREAD') return !n.isRead;
    return n.type === filterType;
  });

  const handleMarkAll = () => {
    markAllNotificationsRead();
    success('All Read', 'All hospital system alerts marked as read.');
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'Emergency':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case 'Inventory':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'Clinical':
        return <Bell className="w-5 h-5 text-hospital-600" />;
      default:
        return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <Breadcrumbs items={[{ label: 'Notifications' }]} className="mb-2" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Hospital System Alerts & Clinical Notifications
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Emergency bay admissions, low pharmacy inventory warnings, and duty schedule updates.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAll}
            leftIcon={<CheckCheck className="w-4 h-4" />}
          >
            Mark All as Read
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <FilterDropdown
          label="Filter Alerts"
          value={filterType}
          onChange={setFilterType}
          options={[
            { value: 'ALL', label: 'All Alerts' },
            { value: 'UNREAD', label: 'Unread Only' },
            { value: 'Emergency', label: 'Emergency Alerts' },
            { value: 'Inventory', label: 'Pharmacy Inventory' },
            { value: 'Clinical', label: 'Clinical & Lab' },
            { value: 'Administrative', label: 'Administrative' },
          ]}
        />

        <span className="text-xs text-slate-500">
          Showing <strong className="text-slate-900">{filteredNotifs.length}</strong> alerts
        </span>
      </div>

      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">No Notifications</h4>
            <p className="text-xs text-slate-500 mt-1">There are no alerts matching the selected category.</p>
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all duration-150 flex items-start justify-between gap-4 ${
                !n.isRead
                  ? 'bg-hospital-50/50 border-hospital-200 shadow-xs'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0">
                  {getNotifIcon(n.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                    <Badge
                      variant={
                        n.type === 'Emergency'
                          ? 'rose'
                          : n.type === 'Inventory'
                          ? 'amber'
                          : n.type === 'Clinical'
                          ? 'sky'
                          : 'slate'
                      }
                      size="sm"
                    >
                      {n.type}
                    </Badge>
                    {!n.isRead && (
                      <span className="text-[10px] font-bold text-hospital-700 bg-hospital-100 px-1.5 py-0.5 rounded">
                        NEW
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{n.message}</p>
                  
                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{n.timestamp}</span>
                    </span>
                    {n.actionUrl && (
                      <Link
                        href={n.actionUrl}
                        className="text-hospital-700 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <span>Open Related Module</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {!n.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markNotificationRead(n.id)}
                    className="h-7 text-xs px-2"
                  >
                    Mark Read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissNotification(n.id)}
                  title="Dismiss"
                  className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
