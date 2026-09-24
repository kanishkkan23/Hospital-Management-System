import React from 'react';
import { Star, Quote, HeartHandshake } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Rameshwar Gupta',
      treatment: 'Emergency Angioplasty & Cardiac ICU Recovery',
      doctor: 'Dr. Arvind Sharma (Cardiology)',
      quote:
        'When I suffered a massive heart attack, the emergency team resuscitated me within the golden hour. Dr. Sharma placed the stent with extraordinary skill. The nursing staff in the cardiac ICU gave me a second life.',
      rating: 5,
    },
    {
      name: 'Sunita & Deepak Mehta',
      treatment: 'High-Risk Twin Delivery & Level-3 NICU Care',
      doctor: 'Dr. Sunita Kulkarni (Obstetrics) & Dr. Priya Nambiar (Pediatrics)',
      quote:
        'Our preterm twins spent 18 days in the NICU under Dr. Nambiar. The transparency, daily doctor updates, and immaculate hygiene made us feel completely secure. Today our babies are healthy and thriving.',
      rating: 5,
    },
    {
      name: 'Kavitha Ramachandran',
      treatment: 'Bilateral Robotic Total Knee Replacement',
      doctor: 'Dr. Rajeshwar Patel (Orthopedics)',
      quote:
        'I had been unable to walk without severe pain for 5 years. Dr. Patel’s robotic joint replacement technique allowed me to stand on day 2 and walk up stairs in two weeks. Truly world-class surgery.',
      rating: 5,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-hospital-600 uppercase tracking-widest bg-hospital-50 px-3 py-1 rounded-full border border-hospital-100">
            Patient Voices & Recovery
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 tracking-tight">
            Stories of Hope, Healing & Recovery
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Real feedback from patients and their families who entrusted their health to our medical faculty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-slate-200 bg-slate-50/40 flex flex-col justify-between hover:shadow-card hover:bg-white transition-all"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/70">
                <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                <p className="text-xs text-hospital-700 font-semibold mt-0.5">{t.treatment}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{t.doctor}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
