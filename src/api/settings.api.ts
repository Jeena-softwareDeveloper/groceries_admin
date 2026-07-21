import { api } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse } from '../types';

export const settingsApi = {
  get: () => api.get<ApiResponse<Record<string, unknown>>>(ENDPOINTS.ADMIN.SETTINGS).then(res => res.data),
  update: (data: Record<string, unknown>) => api.put<ApiResponse<Record<string, unknown>>>(ENDPOINTS.ADMIN.SETTINGS, data).then(res => res.data),
};

