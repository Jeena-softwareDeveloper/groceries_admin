import { api } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, Category, CreateCategoryDto } from '../types';

export const categoryApi = {
  getAll: () => api.get<ApiResponse<Category[]>>(ENDPOINTS.ADMIN.CATEGORIES).then(res => res.data),
  create: (data: CreateCategoryDto) => api.post<ApiResponse<Category>>(ENDPOINTS.ADMIN.CATEGORIES, data).then(res => res.data),
  update: (id: string, data: Partial<CreateCategoryDto>) => api.put<ApiResponse<Category>>(`${ENDPOINTS.ADMIN.CATEGORIES}/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete<ApiResponse<any>>(`${ENDPOINTS.ADMIN.CATEGORIES}/${id}`).then(res => res.data),
  getVendorCategories: () => api.get<ApiResponse<any>>(ENDPOINTS.VENDOR.CATEGORIES).then(res => res.data),
};


