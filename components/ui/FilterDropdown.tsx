import React from 'react';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  className?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  className,
}) => {
  return (
    <div className={cn('relative flex items-center', className)}>
      <div className="flex items-center gap-1.5 h-9 px-3 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:border-slate-400 focus-within:ring-2 focus-within:ring-hospital-500/20 focus-within:border-hospital-600 transition-colors">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-500 whitespace-nowrap">{label}:</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer pr-2 text-xs"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
