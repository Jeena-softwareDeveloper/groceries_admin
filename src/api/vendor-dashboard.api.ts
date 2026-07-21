import { api } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse } from '../types';

export const vendorDashboardApi = {
  getStats: () => api.get<ApiResponse<Record<string, unknown>>>(ENDPOINTS.VENDOR.DASHBOARD).then(res => res.data),
  products: {
    getAll: () => api.get<ApiResponse<{ items: any[] }>>(ENDPOINTS.VENDOR.PRODUCTS.BASE).then(res => res.data),
    create: (data: any) => api.post<ApiResponse<any>>(ENDPOINTS.VENDOR.PRODUCTS.BASE, data).then(res => res.data),
    publish: (id: string) => api.post<ApiResponse<any>>(ENDPOINTS.VENDOR.PRODUCTS.PUBLISH(id)).then(res => res.data),
  },
  inventory: {
    update: (id: string, data: any) => api.put<ApiResponse<any>>(ENDPOINTS.VENDOR.INVENTORY(id), data).then(res => res.data),
  },
  orders: {
    getAll: () => api.get<ApiResponse<{ items: any[] }>>(ENDPOINTS.VENDOR.ORDERS.BASE).then(res => res.data),
    updateStatus: (id: string, status: string) => api.patch<ApiResponse<any>>(ENDPOINTS.VENDOR.ORDERS.UPDATE(id), { status }).then(res => res.data),
  }
};


