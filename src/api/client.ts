import axios from 'axios';
import { STORAGE_KEYS } from '../constants';

const rawUrl = import.meta.env.VITE_API_BASE_URL ?? '';
const API_BASE_URL = rawUrl.replace(/\/api\/v1\/?$/, '');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  config.url = `/api/v1${config.url}`;
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) throw new Error('No refresh token');

        const res = await axios.post<{ success: boolean; data: { accessToken: string; refreshToken: string } }>(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          { refreshToken }
        );

        if (res.data?.success && res.data?.data?.accessToken) {
          const { accessToken, refreshToken: newRefreshToken } = res.data.data;
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
          
          onRefreshed(accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } else {
          throw new Error('Refresh failed');
        }
      } catch (refreshErr: any) {
        // Only force logout if the server explicitly rejected the refresh token (401/403) or no token
        if (!refreshErr.response || refreshErr.response.status === 401 || refreshErr.response.status === 403 || refreshErr.message === 'No refresh token') {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export type { ApiResponse } from '../types';


