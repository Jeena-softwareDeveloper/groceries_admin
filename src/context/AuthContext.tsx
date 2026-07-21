import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi } from '../api';
import { STORAGE_KEYS } from '../constants';
import type { User, ApiResponse } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginAdmin: (email: string, password: string) => Promise<void>;
  loginVendor: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function saveTokens(res: ApiResponse<{ accessToken: string; refreshToken: string }>) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.data.accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.data.refreshToken);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) { setLoading(false); return; }
    authApi.getMe().then((res) => setUser(res.data.data)).catch(() => localStorage.clear()).finally(() => setLoading(false));
  }, []);

  const loginAdmin = async (email: string, password: string) => {
    const res = await authApi.loginAdmin({ email, password });
    await saveTokens(res.data);
    const me = await authApi.getMe();
    setUser(me.data.data);
  };

  const loginVendor = async (email: string, password: string) => {
    const res = await authApi.loginVendor({ email, password });
    await saveTokens(res.data);
    const me = await authApi.getMe();
    setUser(me.data.data);
  };

  const logout = () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (refreshToken) authApi.logout(refreshToken).catch(() => {});
    localStorage.clear();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, loginAdmin, loginVendor, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

