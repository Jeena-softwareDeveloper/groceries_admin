import React from 'react';

type ColorMapType = {
  [key: string]: {
    bg: string;
    text: string;
    border: string;
  };
};

interface StatusBadgeProps {
  status: string;
  colorMap: ColorMapType;
  defaultColor?: { bg: string; text: string; border: string };
}

export function StatusBadge({
  status,
  colorMap,
  defaultColor = { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
}: StatusBadgeProps) {
  const color = colorMap[status] || defaultColor;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${color.bg} ${color.text} ${color.border}`}
    >
      {status}
    </span>
  );
}

