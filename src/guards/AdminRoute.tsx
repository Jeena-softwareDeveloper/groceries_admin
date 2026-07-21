import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return <p className="loading">Loading…</p>;
  if (!user || user.role !== 'SUPER_ADMIN') return <Navigate to={ROUTES.LOGIN} replace />;
  
  return <>{children}</>;
}

