import { api } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse } from '../types';

export const adminExtrasApi = {
  banners: {
    getAll: () => api.get<ApiResponse<any>>(ENDPOINTS.ADMIN.BANNERS).then(res => res.data),
    create: (data: any) => api.post<ApiResponse<any>>(ENDPOINTS.ADMIN.BANNERS, data).then(res => res.data),
    update: (id: string, data: any) => api.put<ApiResponse<any>>(`${ENDPOINTS.ADMIN.BANNERS}/${id}`, data).then(res => res.data),
    delete: (id: string) => api.delete<ApiResponse<any>>(`${ENDPOINTS.ADMIN.BANNERS}/${id}`).then(res => res.data),
  },
  microBanners: {
    getAll: () => api.get<ApiResponse<any>>(ENDPOINTS.ADMIN.MICRO_BANNERS).then(res => res.data),
    create: (data: any) => api.post<ApiResponse<any>>(ENDPOINTS.ADMIN.MICRO_BANNERS, data).then(res => res.data),
    update: (id: string, data: any) => api.put<ApiResponse<any>>(`${ENDPOINTS.ADMIN.MICRO_BANNERS}/${id}`, data).then(res => res.data),
    delete: (id: string) => api.delete<ApiResponse<any>>(`${ENDPOINTS.ADMIN.MICRO_BANNERS}/${id}`).then(res => res.data),
  },
  deliveryCharges: {
    getAll: () => api.get<ApiResponse<any>>(ENDPOINTS.ADMIN.DELIVERY_CHARGES).then(res => res.data),
    create: (data: any) => api.post<ApiResponse<any>>(ENDPOINTS.ADMIN.DELIVERY_CHARGES, data).then(res => res.data),
    update: (id: string, data: any) => api.put<ApiResponse<any>>(`${ENDPOINTS.ADMIN.DELIVERY_CHARGES}/${id}`, data).then(res => res.data),
    delete: (id: string) => api.delete<ApiResponse<any>>(`${ENDPOINTS.ADMIN.DELIVERY_CHARGES}/${id}`).then(res => res.data),
  },
  offers: {
    getAll: () => api.get<ApiResponse<any>>(ENDPOINTS.ADMIN.OFFERS).then(res => res.data),
    create: (data: any) => api.post<ApiResponse<any>>(ENDPOINTS.ADMIN.OFFERS, data).then(res => res.data),
    update: (id: string, data: any) => api.put<ApiResponse<any>>(`${ENDPOINTS.ADMIN.OFFERS}/${id}`, data).then(res => res.data),
    delete: (id: string) => api.delete<ApiResponse<any>>(`${ENDPOINTS.ADMIN.OFFERS}/${id}`).then(res => res.data),
  },
  coupons: {
    getAll: () => api.get<ApiResponse<any>>(ENDPOINTS.ADMIN.COUPONS).then(res => res.data),
    create: (data: any) => api.post<ApiResponse<any>>(ENDPOINTS.ADMIN.COUPONS, data).then(res => res.data),
    update: (id: string, data: any) => api.put<ApiResponse<any>>(`${ENDPOINTS.ADMIN.COUPONS}/${id}`, data).then(res => res.data),
    delete: (id: string) => api.delete<ApiResponse<any>>(`${ENDPOINTS.ADMIN.COUPONS}/${id}`).then(res => res.data),
  },
  customers: {
    getAll: () => api.get<ApiResponse<any>>(ENDPOINTS.ADMIN.CUSTOMERS.BASE).then(res => res.data),
    block: (id: string, isBlock: boolean) => api.post<ApiResponse<any>>(isBlock ? ENDPOINTS.ADMIN.CUSTOMERS.BLOCK(id) : ENDPOINTS.ADMIN.CUSTOMERS.UNBLOCK(id)).then(res => res.data),
  },
  notifications: {
    broadcast: (data: any) => api.post<ApiResponse<{ sent: number }>>(ENDPOINTS.ADMIN.NOTIFICATIONS.BROADCAST, data).then(res => res.data),
  }
};


