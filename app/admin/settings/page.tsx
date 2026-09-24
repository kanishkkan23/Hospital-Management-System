"use client";

import React, { useState } from 'react';
import { useHospitalData } from '@/context/HospitalDataContext';
import { useToast } from '@/components/ui/Toast';
import {
  Settings,
  Building,
  Shield,
  Save,
  RotateCcw,
  Clock,
  Phone,
  Mail,
  MapPin,
  Lock,
  UserCheck
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';

export default function SettingsPage() {
  const { success } = useToast();

  const [hospitalName, setHospitalName] = useState('Apex Memorial Hospital & Research Center');
  const [tagline, setTagline] = useState('NABH & JCI Accredited Multi-Specialty Tertiary Care Center');
  const [emergencyHotline, setEmergencyHotline] = useState('+91 1800 200 8899');
  const [boardLine, setBoardLine] = useState('+91 (022) 6789 1000');
  const [email, setEmail] = useState('helpdesk@apexmedical.org');
  const [address, setAddress] = useState('Plot 45-48, Healthcare Knowledge City, Sector 15, Navi Mumbai - 400614, Maharashtra');
  const [opdHours, setOpdHours] = useState('Mon - Sat (08:00 AM - 08:00 PM)');
  const [currency, setCurrency] = useState('INR (₹)');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST +5:30)');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    success('Settings Saved', 'Hospital operational profile and preferences have been updated.');
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all mock hospital data to default settings?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Breadcrumbs items={[{ label: 'Settings' }]} className="mb-2" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Hospital Configuration & System Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage hospital profile metadata, clinical schedules, boardline contacts, and mock data.
            </p>
          </div>

          <Button
            size="sm"
            onClick={handleSave}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Hospital Identification */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-hospital-600" />
              <CardTitle>Hospital Profile & Accreditation</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Hospital Legal / Trade Name"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                required
              />
              <Input
                label="Accreditation & Tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                required
              />
            </div>

            <Textarea
              label="Campus Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              required
            />
          </CardContent>
        </Card>

        {/* Emergency & Working Hours */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-hospital-600" />
              <CardTitle>Hotlines & Consultation Schedules</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="24/7 Emergency Trauma Hotline"
                value={emergencyHotline}
                onChange={(e) => setEmergencyHotline(e.target.value)}
                required
              />
              <Input
                label="Main Reception & OPD Board Line"
                value={boardLine}
                onChange={(e) => setBoardLine(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="General Patient Helpdesk Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="OPD Consultation Working Hours"
                value={opdHours}
                onChange={(e) => setOpdHours(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* System & Regional Formats */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-hospital-600" />
              <CardTitle>Regional & Currency Localization</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="System Currency Symbol"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="INR (₹)">INR (₹ - Indian Rupee)</option>
                <option value="USD ($)">USD ($ - US Dollar)</option>
                <option value="EUR (€)">EUR (€ - Euro)</option>
                <option value="GBP (£)">GBP (£ - British Pound)</option>
              </Select>

              <Select
                label="Hospital Timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="Asia/Kolkata (IST +5:30)">Asia/Kolkata (IST +5:30)</option>
                <option value="UTC">UTC Universal Time</option>
                <option value="America/New_York (EST)">America/New_York (EST)</option>
                <option value="Europe/London (GMT)">Europe/London (GMT)</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Access Control & Reset Data */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-600" />
              <CardTitle>Data Management & State Reset</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <h5 className="font-bold text-slate-900 text-xs">Reset Local Mock Database</h5>
                <p className="text-slate-500 text-xs mt-0.5 max-w-md">
                  Restores default patient records, doctor rosters, appointments, medicines, and billing ledger back to initial state.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetData}
                leftIcon={<RotateCcw className="w-4 h-4" />}
                className="text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                Reset Demo Data
              </Button>
            </div>
          </CardContent>
        </Card>

      </form>
    </div>
  );
}
