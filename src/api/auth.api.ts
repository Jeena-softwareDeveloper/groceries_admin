import { api } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, User } from '../types';

export const authApi = {
  getMe: () => api.get<ApiResponse<User>>(ENDPOINTS.AUTH.ME),
  loginAdmin: (data: any) => api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(ENDPOINTS.AUTH.ADMIN_LOGIN, data),
  loginVendor: (data: any) => api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(ENDPOINTS.AUTH.VENDOR_LOGIN, data),
  logout: (refreshToken: string) => api.post(ENDPOINTS.AUTH.LOGOUT, { refreshToken }),
};


