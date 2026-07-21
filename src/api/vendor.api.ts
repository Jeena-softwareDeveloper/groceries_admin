import { api } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, Vendor, RejectVendorDto } from '../types';

export const vendorApi = {
  getAll: (statusFilter?: string) => {
    const params = statusFilter ? `?status=${statusFilter}` : '';
    return api.get<ApiResponse<Vendor[]>>(`${ENDPOINTS.ADMIN.VENDORS.BASE}${params}`).then(res => res.data);
  },
  approve: (id: string) => api.post<ApiResponse<Vendor>>(ENDPOINTS.ADMIN.VENDORS.APPROVE(id)).then(res => res.data),
  reject: (id: string, data: RejectVendorDto) => api.post<ApiResponse<Vendor>>(ENDPOINTS.ADMIN.VENDORS.REJECT(id), data).then(res => res.data),
};


