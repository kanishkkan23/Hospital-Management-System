"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  PhoneCall,
  Calendar,
  ShieldAlert,
  Menu,
  X,
  Clock,
  MapPin,
  LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface NavbarProps {
  onOpenBookingModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBookingModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Emergency & Info Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <div className="flex items-center gap-1.5 text-rose-300 font-medium">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>24/7 Emergency Hotline:</span>
              <a href="tel:+9118002008899" className="text-white font-semibold hover:underline">
                +91 1800 200 8899
              </a>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>OPD Timings: Mon - Sat (08:00 AM - 08:00 PM)</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <div className="hidden lg:flex items-center gap-1">
              <MapPin className="w-3 h-3 text-hospital-400" />
              <span>Central Hospital Campus, Sector 15, Navi Mumbai</span>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-hospital-300 hover:text-white transition-colors font-medium ml-2"
            >
              <LogIn className="w-3 h-3" />
              <span>Staff / Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Hospital Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-hospital-600 flex items-center justify-center text-white shadow-sm group-hover:bg-hospital-700 transition-colors">
            <Activity className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg text-slate-900 leading-tight tracking-tight">
              Apex Memorial
            </span>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Hospital & Research Center
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="#home" className="text-hospital-700 font-semibold hover:text-hospital-600 transition-colors">
            Home
          </Link>
          <Link href="#about" className="hover:text-hospital-600 transition-colors">
            About
          </Link>
          <Link href="#departments" className="hover:text-hospital-600 transition-colors">
            Departments
          </Link>
          <Link href="#doctors" className="hover:text-hospital-600 transition-colors">
            Doctors
          </Link>
          <Link href="#services" className="hover:text-hospital-600 transition-colors">
            Services
          </Link>
          <Link href="#facilities" className="hover:text-hospital-600 transition-colors">
            Facilities
          </Link>
          <Link href="#contact" className="hover:text-hospital-600 transition-colors">
            Contact
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/admin">
            <Button variant="outline" size="sm" leftIcon={<LogIn className="w-4 h-4" />}>
              Admin Portal
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={onOpenBookingModal}
            leftIcon={<Calendar className="w-4 h-4" />}
          >
            Book Appointment
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <Button
            size="sm"
            onClick={onOpenBookingModal}
            className="sm:hidden text-xs px-2.5 h-8"
          >
            Book
          </Button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <Link
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              About Hospital
            </Link>
            <Link
              href="#departments"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Departments & Specialties
            </Link>
            <Link
              href="#doctors"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Consultant Doctors
            </Link>
            <Link
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Clinical Services
            </Link>
            <Link
              href="#facilities"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Patient Facilities
            </Link>
            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Contact & Emergency
            </Link>
          </nav>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Button
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookingModal();
              }}
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              Book an Appointment
            </Button>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center" leftIcon={<LogIn className="w-4 h-4" />}>
                Staff & Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
