import React from 'react';
import {
  ShieldAlert,
  CalendarCheck,
  Microscope,
  PhoneCall,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionCardsProps {
  onOpenBookingModal: () => void;
}

export const QuickActionCards: React.FC<QuickActionCardsProps> = ({ onOpenBookingModal }) => {
  const actions = [
    {
      title: '24/7 Emergency & Trauma',
      description: 'Immediate resuscitation, golden hour cardiac and stroke management.',
      icon: ShieldAlert,
      badge: 'Emergency',
      color: 'border-rose-200 bg-rose-50/40 text-rose-700 hover:border-rose-300',
      iconBg: 'bg-rose-100 text-rose-700',
      actionText: 'Call Emergency',
      actionHref: 'tel:+9118002008899',
    },
    {
      title: 'Book OPD Consultation',
      description: 'Schedule a visit with senior specialist doctors across all clinical departments.',
      icon: CalendarCheck,
      badge: 'Online Booking',
      color: 'border-hospital-200 bg-hospital-50/40 text-hospital-800 hover:border-hospital-300',
      iconBg: 'bg-hospital-100 text-hospital-700',
      actionText: 'Book Appointment',
      onClick: onOpenBookingModal,
    },
    {
      title: 'Diagnostic Lab & Imaging',
      description: 'Book MRI, CT scans, biochemistry tests with digital report delivery.',
      icon: Microscope,
      badge: 'Pathology & Radiology',
      color: 'border-teal-200 bg-teal-50/40 text-teal-800 hover:border-teal-300',
      iconBg: 'bg-teal-100 text-teal-700',
      actionText: 'View Lab Services',
      actionHref: '#services',
    },
    {
      title: 'Ambulance Dispatch 108',
      description: 'GPS-enabled Advanced Cardiac Life Support (ACLS) mobile ICU ambulances.',
      icon: PhoneCall,
      badge: 'Instant Response',
      color: 'border-amber-200 bg-amber-50/40 text-amber-800 hover:border-amber-300',
      iconBg: 'bg-amber-100 text-amber-700',
      actionText: 'Call 108 Ambulance',
      actionHref: 'tel:108',
    },
  ];

  return (
    <section className="relative -mt-8 z-20 max-w-7xl mx-auto px-4 sm:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={cn(
                'p-5 rounded-xl border shadow-card bg-white flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5',
                item.color
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center font-bold', item.iconBg)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 border border-slate-200/80 text-slate-700">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60">
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-hospital-700 hover:text-hospital-900 transition-colors"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <a
                    href={item.actionHref}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 hover:text-hospital-700 transition-colors"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
