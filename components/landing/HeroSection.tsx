import React from 'react';
import {
  ShieldCheck,
  Calendar,
  ArrowRight,
  Award,
  Users,
  CheckCircle2,
  HeartPulse
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeroSectionProps {
  onOpenBookingModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBookingModal }) => {
  return (
    <section id="home" className="relative bg-gradient-to-b from-hospital-50/60 via-white to-slate-50 pt-10 pb-16 md:py-20 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-hospital-100/80 border border-hospital-200 text-hospital-800 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-hospital-600" />
              <span>NABH & JCI Accredited Tertiary Care Center</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              World-Class Medical Care, Compassionate Healing.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              Apex Memorial Hospital combines leading medical specialists, state-of-the-art diagnostic technology, and dedicated nursing care to deliver exceptional clinical outcomes 24 hours a day, 365 days a year.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                size="lg"
                onClick={onOpenBookingModal}
                leftIcon={<Calendar className="w-5 h-5" />}
              >
                Book an Appointment
              </Button>
              <a href="#services">
                <Button variant="outline" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Clinical Services
                </Button>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>24/7 Level-1 Emergency</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cashless Insurance TPA</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>3.0 Tesla Advanced MRI</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-white p-6 shadow-elevated border border-slate-200/90">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-hospital-100 text-hospital-700 flex items-center justify-center font-bold">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">Emergency & OPD Status</h3>
                    <p className="text-xs text-slate-500">Live Hospital Readiness</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Fully Operational
                </span>
              </div>

              <div className="py-4 space-y-3.5">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-slate-600 font-medium">Available ICU Beds</span>
                  <span className="font-bold text-slate-900">12 / 60 Beds Ready</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-slate-600 font-medium">On-Duty Emergency Doctors</span>
                  <span className="font-bold text-emerald-700">8 Specialists Present</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-slate-600 font-medium">Average OPD Triage Wait</span>
                  <span className="font-bold text-slate-900">&lt; 15 Minutes</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-hospital-50/70 border border-hospital-100 mt-2">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-hospital-700 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <h4 className="font-semibold text-hospital-900">Center of Clinical Excellence</h4>
                    <p className="text-hospital-700 mt-0.5 leading-relaxed">
                      Ranked among the top 10 multi-specialty research hospitals with advanced robotic and cardiac cath facilities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Emergency Helpdesk:</span>
                <span className="font-semibold text-slate-800">+91 1800 200 8899</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
