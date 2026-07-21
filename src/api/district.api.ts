import { api } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, District, CreateDistrictDto } from '../types';

export const districtApi = {
  getAll: () => api.get<ApiResponse<District[]>>(ENDPOINTS.ADMIN.DISTRICTS).then(res => res.data),
  create: (data: CreateDistrictDto) => api.post<ApiResponse<District>>(ENDPOINTS.ADMIN.DISTRICTS, data).then(res => res.data),
};


