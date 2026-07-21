import React from 'react';

interface LoadingSkeletonProps {
  rows?: number;
}

export function LoadingSkeleton({ rows = 4 }: LoadingSkeletonProps) {
  return (
    <div className="p-8 flex flex-col gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse"></div>
      ))}
    </div>
  );
}

