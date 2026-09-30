import { api } from './client';
import type { ApiResponse } from '../types';
import type { Staff, CreateStaffInput, UpdateStaffInput } from '../types/staff.types';

export const staffApi = {
  getAll: (search?: string, isActive?: boolean, page = 1, limit = 100) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (isActive !== undefined) params.append('isActive', String(isActive));
    params.append('page', String(page));
    params.append('limit', String(limit));
    return api.get<ApiResponse<Staff[]>>(`/admin/staffs?${params.toString()}`).then(r => r.data);
  },

  getById: (id: string) => {
    return api.get<ApiResponse<Staff>>(`/admin/staffs/${id}`).then(r => r.data);
  },

  create: (data: CreateStaffInput) => {
    return api.post<ApiResponse<Staff>>('/admin/staffs', data).then(r => r.data);
  },

  update: (id: string, data: UpdateStaffInput) => {
    return api.put<ApiResponse<Staff>>(`/admin/staffs/${id}`, data).then(r => r.data);
  },

  delete: (id: string) => {
    return api.delete<ApiResponse<{ success: boolean }>>(`/admin/staffs/${id}`).then(r => r.data);
  },

  toggleStatus: (id: string) => {
    return api.patch<ApiResponse<Staff>>(`/admin/staffs/${id}/toggle-status`).then(r => r.data);
  },

  recordAudit: (id: string, data: { action: string; platform?: string; deviceInfo?: string; ipAddress?: string; metadata?: any }) => {
    return api.post<ApiResponse<any>>(`/admin/staffs/${id}/audit`, data).then(r => r.data);
  },
};
