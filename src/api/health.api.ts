import { ENDPOINTS } from './endpoints';
import type { ApiResponse } from '../types';
import type { HealthStatus } from '@shared/types'; // Assuming this exists

export const healthApi = {
  // We use fetch here specifically for health check to bypass axios interceptors if needed,
  // or we can use axios. We'll use native fetch to match the original implementation's behavior.
  check: async (): Promise<ApiResponse<HealthStatus>> => {
    const url = `${import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000/api/v1'}${ENDPOINTS.HEALTH}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  }
};

