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

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/vendor/login')) {
        window.location.href = window.location.pathname.startsWith('/vendor') ? '/vendor/login' : '/login';
      }
    }
    return Promise.reject(error);
  },
);

export type { ApiResponse } from '../types';

