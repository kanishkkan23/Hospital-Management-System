import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorScheme?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'slate';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'blue',
  className,
}) => {
  const schemeStyles = {
    blue: {
      iconBg: 'bg-hospital-50 text-hospital-700 border-hospital-100',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-700 border-amber-100',
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-700 border-purple-100',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-700 border-rose-100',
    },
    slate: {
      iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  };

  const currentScheme = schemeStyles[colorScheme] || schemeStyles.blue;

  return (
    <div
      className={cn(
        'p-5 rounded-xl bg-white border border-slate-200/90 shadow-card flex flex-col justify-between transition-all hover:shadow-subtle',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {title}
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            {value}
          </div>
        </div>

        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center font-bold border shrink-0',
            currentScheme.iconBg
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-semibold text-[11px]',
                trend.isPositive ? 'text-emerald-700' : 'text-rose-700'
              )}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              <span>{trend.value}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
