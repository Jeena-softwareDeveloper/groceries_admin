import { ENDPOINTS } from './endpoints';
import type { ApiResponse } from '../types';
import type { HealthStatus } from '../types'; // Assuming this exists

export const healthApi = {
  // We use fetch here specifically for health check to bypass axios interceptors if needed,
  // or we can use axios. We'll use native fetch to match the original implementation's behavior.
  check: async (): Promise<ApiResponse<HealthStatus>> => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '';
    const url = `${baseUrl}${ENDPOINTS.HEALTH}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  }
};


