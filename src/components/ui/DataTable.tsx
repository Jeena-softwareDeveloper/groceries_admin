import React, { useState } from 'react';
import { ChevronsUpDown, ChevronRight, ChevronDown } from 'lucide-react';
import { LoadingSkeleton } from './LoadingSkeleton';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  cell: (item: T, index: number) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  hideOnMobile?: boolean;
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
      
      {/* Desktop View: Full Table */}
      <div className="hidden md:block overflow-auto no-scrollbar w-full max-h-[calc(100vh-200px)]">
        <table className="w-full border-collapse [&_*]:!font-normal">
          <thead className="sticky top-0 z-20">
            <tr className="bg-slate-50 shadow-sm border-b border-slate-100">
              {renderExpandedRow && (
                <th className="w-8 p-3 bg-slate-50" />
              )}
              {columns.map((col, index) => (
                <th 
                  key={col.key || index} 
                  className={`px-4 py-3 text-left text-[11px] uppercase tracking-wider text-slate-600 whitespace-nowrap bg-slate-50 ${col.headerClassName || ''}`}
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

      {/* Mobile View: Compact Cards */}
      <div className="block md:hidden p-2 space-y-2 max-h-[calc(100vh-180px)] overflow-y-auto bg-slate-50/50">
        {data.map((item, rowIndex) => {
          const isExpanded = expandedRows.has(rowIndex);
          
          // Filter columns to display on mobile
          const mobileCols = columns.filter(c => !c.hideOnMobile);
          const primaryCol = mobileCols.find(c => c.key !== 'id' && c.key !== '#' && c.key !== 'actions') || mobileCols[0];
          const actionsCol = mobileCols.find(c => c.key === 'actions');
          const detailCols = mobileCols.filter(c => c !== primaryCol && c !== actionsCol && c.key !== 'id' && c.key !== '#');

          return (
            <div 
              key={rowIndex}
              className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-sm flex flex-col gap-2 hover:border-slate-300 transition-all"
            >
              {/* Card Header Row: Primary Info + Actions */}
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="flex-1 min-w-0 font-medium">
                  {primaryCol && primaryCol.cell(item, rowIndex)}
                </div>
                {actionsCol && (
                  <div className="shrink-0 flex items-center gap-1">
                    {actionsCol.cell(item, rowIndex)}
                  </div>
                )}
              </div>

              {/* Card Body: Compact Key Data Grid */}
              {detailCols.length > 0 && (
                <div className={`grid ${detailCols.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 text-xs bg-slate-50/80 p-2 rounded-md border border-slate-100/80`}>
                  {detailCols.map((col, colIndex) => (
                    <div key={col.key || colIndex} className="flex items-center justify-between gap-1.5 min-w-0">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">
                        {col.header}:
                      </span>
                      <div className="text-slate-800 font-bold text-xs truncate shrink-0">
                        {col.cell(item, rowIndex)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Expanded Row Content (if supported) */}
              {renderExpandedRow && (
                <div className="border-t border-slate-100 pt-1.5 mt-0.5">
                  <button
                    onClick={() => toggleRow(rowIndex)}
                    className="flex items-center justify-between w-full py-0.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    <span>{isExpanded ? 'Hide details' : 'Show details'}</span>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  {isExpanded && (
                    <div className="mt-1.5 p-2 bg-slate-50 rounded-lg text-xs">
                      {renderExpandedRow(item)}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {pagination}
    </div>
  );
}
