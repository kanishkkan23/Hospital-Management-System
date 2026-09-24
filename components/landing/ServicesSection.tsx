import React from 'react';
import {
  Heart,
  Brain,
  Bone,
  Baby,
  Stethoscope,
  Microscope,
  Pill,
  Syringe,
  Activity,
  CheckCircle2
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const services = [
    {
      title: 'Outpatient (OPD) Consultations',
      description: 'Consultations across 24+ medical & surgical specialties with minimal waiting times and digitized prescription history.',
      icon: Stethoscope,
      features: ['Prior appointment booking', 'Digital medical records', 'Specialty clinics'],
    },
    {
      title: '24/7 Emergency & Trauma Care',
      description: 'Equipped with dedicated resuscitation bays, triage zones, emergency OT, and trauma specialists on standby round the clock.',
      icon: Activity,
      features: ['Golden Hour stroke protocol', 'Primary PTCA in < 60 mins', 'Dedicated trauma team'],
    },
    {
      title: 'Advanced Diagnostic Pathology',
      description: 'Fully automated biochemistry, hematology, microbiology, molecular testing with high accuracy and rapid barcode reporting.',
      icon: Microscope,
      features: ['NABL accredited lab', 'Same-day digital reports', 'Home sample collection'],
    },
    {
      title: 'Diagnostic Radiology & Imaging',
      description: 'High-precision 3.0 Tesla MRI, 128-Slice CT scanner, 4D Doppler ultrasound, and digital mammography for precise diagnosis.',
      icon: Brain,
      features: ['Low-radiation dose CT', 'Silent scan MRI suite', 'Interventional radiology'],
    },
    {
      title: 'Operation Theaters & Robotic Surgery',
      description: 'Modular laminar airflow operation theaters equipped with robotic surgical consoles for minimally invasive procedures.',
      icon: Syringe,
      features: ['Class-100 HEPA filtration', 'Robotic joint replacement', 'Laparoscopic day care'],
    },
    {
      title: '24/7 In-House Hospital Pharmacy',
      description: 'Comprehensive inventory of genuine emergency medications, critical care injectables, and round-the-clock patient dispensing.',
      icon: Pill,
      features: ['Temperature-controlled storage', 'Bedside delivery', 'Trained clinical pharmacists'],
    },
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-hospital-600 uppercase tracking-widest bg-hospital-50 px-3 py-1 rounded-full border border-hospital-100">
            Comprehensive Healthcare
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 tracking-tight">
            Integrated Clinical Services & Facilities
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Delivering the highest quality patient care from routine outpatient consultations to complex critical surgical interventions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-hospital-200 hover:shadow-card transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-lg bg-hospital-100 text-hospital-700 flex items-center justify-center font-bold mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{service.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200/60 space-y-1.5">
                  {service.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
