import React from 'react';

interface PageHeaderProps {
  title: React.ReactNode;
  description: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
      <div>
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight m-0 mb-0.5 text-slate-700">{title}</h1>
        <p className="text-xs font-normal text-slate-400 m-0">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}


