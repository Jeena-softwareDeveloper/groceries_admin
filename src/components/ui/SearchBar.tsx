import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  totalCount?: number;
  totalLabel?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search...', totalCount, totalLabel }: SearchBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm w-72 focus-within:ring-2 focus-within:ring-slate-200 transition-all">
        <Search size={14} className="text-slate-400 shrink-0" strokeWidth={2.5} />
        <input
          className="flex-1 text-sm outline-none bg-transparent placeholder:text-slate-400 text-slate-700 font-medium"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {totalCount !== undefined && totalLabel !== undefined && (
        <span className="ml-auto text-sm font-medium text-slate-500">
          <span className="font-bold text-slate-800">{totalCount}</span> {totalLabel}
        </span>
      )}
    </div>
  );
}

