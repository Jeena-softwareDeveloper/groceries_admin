import React, { useState } from 'react';
import { ChevronsUpDown, ChevronRight, ChevronDown } from 'lucide-react';
import { LoadingSkeleton } from './LoadingSkeleton';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  cell: (item: T, index: number) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  pagination?: React.ReactNode;
  renderExpandedRow?: (item: T) => React.ReactNode;
}

export function DataTable<T>({ data, columns, loading, emptyState, pagination, renderExpandedRow }: DataTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (index: number) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(index)) newSet.delete(index);
    else newSet.add(index);
    setExpandedRows(newSet);
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200/75 rounded-lg overflow-hidden shadow-sm">
        <LoadingSkeleton />
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className="bg-white border border-slate-200/75 rounded-lg overflow-hidden shadow-sm">
        {emptyState}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/75 rounded-lg overflow-hidden shadow-sm flex flex-col">
      <div className="overflow-auto w-full max-h-[calc(100vh-200px)]">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-20">
            <tr className="bg-slate-50 shadow-sm border-b border-slate-100">
              {renderExpandedRow && (
                <th className="w-8 p-3 bg-slate-50" />
              )}
              {columns.map((col, index) => (
                <th 
                  key={col.key || index} 
                  className={`px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-slate-400 whitespace-nowrap bg-slate-50 ${col.headerClassName || ''}`}
                >
                  <div className="inline-flex items-center gap-1">
                    {col.header} 
                    {index !== 0 && index !== columns.length - 1 && (
                       <ChevronsUpDown size={11} className="text-slate-300" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => {
              const isExpanded = expandedRows.has(rowIndex);
              return (
                <React.Fragment key={rowIndex}>
                  <tr 
                    className={`border-b border-slate-100/75 hover:bg-slate-50/60 transition-colors group ${renderExpandedRow ? 'cursor-pointer' : ''}`}
                    onClick={() => renderExpandedRow && toggleRow(rowIndex)}
                  >
                    {renderExpandedRow && (
                      <td className="p-3 pl-5 text-slate-400">
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </td>
                    )}
                    {columns.map((col, colIndex) => (
                      <td 
                        key={col.key || colIndex} 
                        className={`px-4 py-3 text-sm text-slate-600 ${col.cellClassName || ''}`}
                      >
                        {col.cell(item, rowIndex)}
                      </td>
                    ))}
                  </tr>
                  {renderExpandedRow && isExpanded && (
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <td colSpan={columns.length + 1} className="p-0">
                        {renderExpandedRow(item)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      {pagination}
    </div>
  );
}

