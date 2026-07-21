import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  total: number;
  page: number;
  limit: number;
  entityName?: string;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function Pagination({
  total,
  page,
  limit,
  entityName = 'items',
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  
  // A mock for total pages since our backend isn't supporting real pagination yet
  // Usually this would be: Math.ceil(total / limit)
  // For now we just implement the UI

  return (
    <div className="flex items-center justify-between p-4 px-6 border-t border-slate-100 bg-slate-50/50">
      <span className="text-sm font-medium text-slate-500">
        Showing <span className="font-bold text-slate-700">{total === 0 ? 0 : start}–{end}</span> of <span className="font-bold text-slate-700">{total}</span> {entityName}
      </span>
      <div className="flex items-center gap-2">
        <button 
          className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 cursor-pointer hover:bg-slate-100 transition-colors"
          onClick={() => onPageChange && onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center bg-slate-900 border border-slate-900 rounded-lg text-white text-xs font-bold cursor-pointer shadow-sm">
          {page}
        </button>
        <button 
          className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 cursor-pointer hover:bg-slate-100 transition-colors"
          onClick={() => onPageChange && onPageChange(page + 1)}
          disabled={end >= total}
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
        <select 
          className="ml-3 px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-sm font-medium text-slate-600 outline-none cursor-pointer hover:bg-slate-50"
          value={limit}
          onChange={(e) => onLimitChange && onLimitChange(Number(e.target.value))}
        >
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>
    </div>
  );
}


