import React from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, Heart, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          
          {/* Col 1: About Hospital */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-hospital-600 flex items-center justify-center text-white font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base text-white leading-tight">
                  Apex Memorial Hospital
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Research & Medical Institute
                </span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              NABH & JCI accredited 500-bed multi-specialty tertiary care center dedicated to delivering advanced evidence-based clinical medicine, 24/7 critical trauma resuscitation, and patient-centric healthcare.
            </p>
            <div className="flex items-center gap-2 text-hospital-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Healthcare Safety & Quality Standards</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Clinical Services</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="hover:text-white transition-colors">Emergency & Trauma</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Cardiology & Cath Lab</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Robotic Orthopedics</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Pediatrics & Level-3 NICU</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Diagnostic Radiology 3.0T</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">24/7 Pharmacy</a></li>
            </ul>
          </div>

          {/* Col 3: Departments */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Departments</h4>
            <ul className="space-y-2">
              <li><a href="#departments" className="hover:text-white transition-colors">Cardiology Sciences</a></li>
              <li><a href="#departments" className="hover:text-white transition-colors">Neurology & Neurosurgery</a></li>
              <li><a href="#departments" className="hover:text-white transition-colors">General & Laparoscopy</a></li>
              <li><a href="#departments" className="hover:text-white transition-colors">Obstetrics & Gynecology</a></li>
              <li><a href="#departments" className="hover:text-white transition-colors">Laboratory Pathology</a></li>
              <li><a href="#departments" className="hover:text-white transition-colors">Critical Care (ICU)</a></li>
            </ul>
          </div>

          {/* Col 4: Portal & Admin */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Hospital Portals</h4>
            <ul className="space-y-2">
              <li><Link href="/admin" className="text-hospital-400 hover:text-hospital-300 font-medium transition-colors">Admin Dashboard</Link></li>
              <li><Link href="/admin/patients" className="hover:text-white transition-colors">Patient Records</Link></li>
              <li><Link href="/admin/doctors" className="hover:text-white transition-colors">Doctor Rosters</Link></li>
              <li><Link href="/admin/appointments" className="hover:text-white transition-colors">OPD Appointments</Link></li>
              <li><Link href="/admin/medicines" className="hover:text-white transition-colors">Pharmacy Inventory</Link></li>
              <li><Link href="/admin/billing" className="hover:text-white transition-colors">Billing & Invoices</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} Apex Memorial Hospital & Research Center. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#home" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#home" className="hover:text-slate-400">Patient Rights Charter</a>
            <a href="#home" className="hover:text-slate-400">Clinical Ethics</a>
            <Link href="/admin" className="text-hospital-400 hover:underline">
              Management Portal Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
