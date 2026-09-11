import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  badge?: string | number;
  color?: string;
}

interface SelectDropdownProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SelectDropdown({ options, value, onChange, placeholder = 'Select...', className = '' }: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm rounded-lg px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 flex items-center justify-between gap-1.5 transition-all cursor-pointer outline-none max-w-[150px] sm:max-w-none truncate"
      >
        <div className="flex items-center gap-1.5 min-w-0 truncate">
          {selectedOption?.color && (
            <span className={`w-2 h-2 rounded-full shrink-0 ${selectedOption.color}`} />
          )}
          <span className="truncate">{selectedOption?.label || placeholder}</span>
        </div>
        <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 sm:w-52 bg-white rounded-xl shadow-xl border border-slate-100 z-[150] py-1.5 transform transition-all duration-150 animate-in fade-in slide-in-from-top-1">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-xs sm:text-sm text-left flex items-center justify-between gap-2 hover:bg-slate-50 transition-colors cursor-pointer border-none ${
                  isSelected ? 'bg-emerald-50/70 text-emerald-700 font-bold' : 'text-slate-700 font-medium'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {option.color && (
                    <span className={`w-2 h-2 rounded-full shrink-0 ${option.color}`} />
                  )}
                  <span className="truncate">{option.label}</span>
                </div>
                {isSelected && <Check size={14} className="text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
