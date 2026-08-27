import { api } from './index';
import type { ApiResponse } from '../types';

export const analyticsApi = {
  fetchAnalyticsOverview: async () => {
    const res = await api.get<ApiResponse<any>>('/admin/analytics/overview');
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to fetch analytics overview');
    }
    return res.data.data;
  }
};
