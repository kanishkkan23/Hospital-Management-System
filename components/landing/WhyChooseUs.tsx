import React from 'react';
import {
  ShieldCheck,
  Award,
  Users,
  Clock,
  HeartHandshake,
  Cpu,
  Bed,
  Sparkles
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const stats = [
    { label: 'Years of Healthcare Excellence', value: '28+', icon: Award },
    { label: 'Specialist Medical Faculty', value: '150+', icon: Users },
    { label: 'Patients Treated Annually', value: '65,000+', icon: HeartHandshake },
    { label: 'Critical Care & Ward Beds', value: '500+', icon: Bed },
  ];

  const highlights = [
    {
      title: 'NABH & JCI International Accreditation',
      description: 'Strict adherence to global infection control, surgical safety checklists, and clinical audit protocols.',
      icon: ShieldCheck,
    },
    {
      title: 'Advanced Robotic Surgical Systems',
      description: 'Precision robotic orthopedics, laparoscopic GI surgeries with smaller incisions and faster recovery times.',
      icon: Cpu,
    },
    {
      title: 'Round-the-Clock Critical Care Response',
      description: 'Dedicated in-house intensivist doctors in ICU and CCU with 1:1 patient-to-nurse critical care ratio.',
      icon: Clock,
    },
    {
      title: 'Transparent & Cashless Billing',
      description: 'Empaneled with all major insurance companies and TPAs with on-desk cashless claim approval support.',
      icon: Sparkles,
    },
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Statistics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-16 border-b border-slate-800">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="w-10 h-10 rounded-lg bg-hospital-600/20 border border-hospital-500/30 text-hospital-400 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs text-slate-400 mt-1 font-medium">{stat.label}</span>
              </div>
            );
          })}
        </div>

        {/* Narrative & Highlights */}
        <div className="pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-hospital-400 uppercase tracking-widest bg-hospital-950 px-3 py-1 rounded-full border border-hospital-800">
              Institutional Trust
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              Why Families Trust Apex Memorial for Multi-Specialty Care
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Founded on the belief that advanced medical science must be delivered with human empathy, Apex Memorial Hospital has stood as a beacon of clinical excellence and patient safety across the region for over two decades.
            </p>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <p className="text-xs text-slate-300 italic">
                &ldquo;Our commitment is zero compromise on patient safety, strict ethical clinical practice, and continuous adoption of evidence-based medical advancements.&rdquo;
              </p>
              <span className="text-xs font-semibold text-hospital-300 block mt-2">
                — Medical Superintendent & Board of Governors
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/70 hover:border-hospital-500/50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-hospital-600/30 text-hospital-300 flex items-center justify-center font-bold mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
