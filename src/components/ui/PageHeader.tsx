import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PageHeaderProps {
  title: React.ReactNode;
  description: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalNode(document.getElementById('top-header-portal'));
  }, []);

  const portalContent = (
    <div className="flex items-center justify-between w-full gap-2 min-w-0">
      <h1 className="text-sm sm:text-lg font-bold tracking-tight m-0 text-slate-800 truncate max-w-[130px] sm:max-w-none">{title}</h1>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );

  return (
    <>
      {portalNode ? createPortal(portalContent, portalNode) : null}
    </>
  );
}


