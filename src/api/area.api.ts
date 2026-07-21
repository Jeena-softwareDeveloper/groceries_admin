import { api } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, Area, CreateAreaDto } from '../types';

export const areaApi = {
  getAll: () => api.get<ApiResponse<Area[]>>(ENDPOINTS.ADMIN.AREAS).then(res => res.data),
  create: (data: CreateAreaDto) => api.post<ApiResponse<Area>>(ENDPOINTS.ADMIN.AREAS, data).then(res => res.data),
};


