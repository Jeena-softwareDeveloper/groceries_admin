import { api } from './index';
import type { AdminDashboardData } from '@shared/types';
import type { ApiResponse } from '@shared/types';

export const dashboardApi = {
  fetchDashboardData: async (): Promise<AdminDashboardData> => {
    const res = await api.get<ApiResponse<AdminDashboardData>>('/admin/dashboard');
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to fetch dashboard data');
    }
    return res.data.data;
  }
};

