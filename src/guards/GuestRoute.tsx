import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants';

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="loading">Loading...</div>;
  
  if (user) {
    if (user.role === 'SUPER_ADMIN') {
      return <Navigate to={ROUTES.HOME} replace />;
    } else if (user.role === 'VENDOR') {
      return <Navigate to={ROUTES.VENDOR_DASHBOARD} replace />;
    }
  }
  
  return <>{children}</>;
}


