import React from 'react';
import {
  BedDouble,
  Shield,
  Zap,
  Radio,
  Coffee,
  HeartHandshake
} from 'lucide-react';

export const FacilitiesSection: React.FC = () => {
  const facilities = [
    {
      title: 'Modular Operation Theaters (Class-100)',
      description: 'Laminar airflow suites with HEPA air handling units, anti-static flooring, and live surgical telemetry systems.',
      icon: Shield,
    },
    {
      title: 'Level-3 Advanced Intensive Care (ICU)',
      description: 'Multi-parameter invasive hemodynamic monitoring, servo ventilators, and round-the-clock intensivist coverage.',
      icon: Zap,
    },
    {
      title: 'Private & Deluxe Patient Suites',
      description: 'Air-conditioned individual rooms with motorized Fowler beds, attendant couches, and Wi-Fi connectivity.',
      icon: BedDouble,
    },
    {
      title: 'Integrated Diagnostic Imaging Suite',
      description: 'In-house 3.0T MRI, 128-slice CT, digital mammography, and 4D ultrasound minimizing patient transit times.',
      icon: Radio,
    },
    {
      title: '24/7 Dialysis & Day Care Center',
      description: 'State-of-the-art hemodialysis machines with dedicated RO water treatment units and nephrology monitoring.',
      icon: HeartHandshake,
    },
    {
      title: 'Patient Cafeteria & Attendant Amenities',
      description: 'Hygienic therapeutic meal plans curated by clinical dietitians alongside clean visitor cafeteria and pharmacy lounge.',
      icon: Coffee,
    },
  ];

  return (
    <section id="facilities" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-hospital-600 uppercase tracking-widest bg-hospital-50 px-3 py-1 rounded-full border border-hospital-100">
            Infrastructure & Care Environment
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 tracking-tight">
            Advanced Clinical Infrastructure & Amenities
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Designed to ensure maximum patient safety, superior infection control, and absolute comfort for families.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility, index) => {
            const Icon = facility.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-xl border border-slate-200 bg-white shadow-subtle hover:shadow-card transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-hospital-50 border border-hospital-100 text-hospital-700 flex items-center justify-center font-bold mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{facility.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {facility.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
