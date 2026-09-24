"use client";

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ShieldAlert,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';

export const ContactSection: React.FC = () => {
  const { success } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    setSubmitted(true);
    success('Message Dispatched', 'Hospital Helpdesk team will contact you within 2 business hours.');
    setTimeout(() => {
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-hospital-600 uppercase tracking-widest bg-hospital-50 px-3 py-1 rounded-full border border-hospital-100">
            Reach Out & Campus Access
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 tracking-tight">
            Hospital Location, Emergency Hotline & Helpdesk
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            24/7 Emergency trauma reception, ambulance dispatch, and inpatient admission support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Campus Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* 24/7 Emergency Box */}
            <div className="p-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-rose-600 text-white">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-rose-900">24/7 Emergency Trauma Center</h3>
                  <p className="text-xs text-rose-700">Golden Hour cardiac, stroke & polytrauma hotline</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-rose-200/80 flex items-center justify-between text-xs">
                <span className="font-medium text-rose-800">Toll-Free Emergency:</span>
                <a href="tel:+9118002008899" className="font-bold text-rose-700 text-sm hover:underline">
                  +91 1800 200 8899
                </a>
              </div>
            </div>

            {/* Campus Address & Contacts */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-4 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-hospital-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">Hospital Campus Address</h4>
                  <p className="mt-0.5 text-slate-600 leading-relaxed">
                    Plot 45-48, Healthcare Knowledge City, Sector 15, Near Central Expressway, Navi Mumbai - 400614, Maharashtra.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <Phone className="w-4 h-4 text-hospital-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">Board Lines & OPD Registration</h4>
                  <p className="mt-0.5 text-slate-600">
                    +91 (022) 6789 1000 / +91 (022) 6789 1001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <Mail className="w-4 h-4 text-hospital-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">Clinical & Patient Queries</h4>
                  <p className="mt-0.5 text-slate-600">
                    helpdesk@apexmedical.org | admissions@apexmedical.org
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <Clock className="w-4 h-4 text-hospital-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">Consultation & Visiting Hours</h4>
                  <p className="mt-0.5 text-slate-600">
                    OPD: Mon - Sat (08:00 AM - 08:00 PM)<br />
                    Inpatient Visitor Hours: 05:00 PM - 07:00 PM
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-card">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Send an Inquiry or Feedback</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Have questions about medical procedures, insurance empanelment, or second opinions? Fill the form below.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200 space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-950">Thank You for Contacting Us</h4>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                    Your inquiry has been routed to our patient relations department. A hospital representative will call you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Full Name"
                      placeholder="e.g. Meera Joshi"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />

                    <Input
                      label="Contact Phone"
                      placeholder="e.g. +91 98201 99887"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Email Address"
                      placeholder="meera@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <Select
                      label="Inquiry Category"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Doctor Appointment Request">Doctor Appointment Request</option>
                      <option value="TPA & Cashless Insurance">TPA & Cashless Insurance</option>
                      <option value="Diagnostic Lab Reports">Diagnostic Lab Reports</option>
                      <option value="Surgery / Inpatient Admission">Surgery / Inpatient Admission</option>
                      <option value="Billing & Discharge Query">Billing & Discharge Query</option>
                    </Select>
                  </div>

                  <div>
                    <Textarea
                      label="Inquiry Details / Medical Requirements"
                      placeholder="Write your query or medical concern here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-500">
                      Confidential patient medical inquiry
                    </span>
                    <Button type="submit" leftIcon={<Send className="w-4 h-4" />}>
                      Submit Inquiry
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
