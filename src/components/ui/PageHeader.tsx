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
    <>
      <h1 className="text-lg font-bold tracking-tight m-0 text-slate-800">{title}</h1>
      {action && <div className="shrink-0">{action}</div>}
    </>
  );

  return (
    <>
      {portalNode ? createPortal(portalContent, portalNode) : null}
    </>
  );
}


