import { api } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse } from '../types';

export type VendorRequestStatus = 'DRAFT' | 'PENDING' | 'MORE_INFO_REQUIRED' | 'APPROVED' | 'REJECTED';

export interface VendorRequest {
  id: string;
  customerId: string;
  status: VendorRequestStatus;
  shopName?: string;
  ownerName?: string;
  mobileNumber?: string;
  email?: string;
  shopCategory?: string;
  description?: string;
  gstNumber?: string;
  fssaiNumber?: string;
  businessRegNumber?: string;
  districtId?: string;
  areaId?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  deliveryRadius?: number;
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  logoUrl?: string;
  bannerUrl?: string;
  ownerPhotoUrl?: string;
  govtIdUrl?: string;
  gstCertUrl?: string;
  fssaiCertUrl?: string;
  adminRemarks?: string;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
  customer?: { id: string; name?: string; phone: string; email?: string };
  district?: { id: string; name: string };
  area?: { id: string; name: string };
}

export const vendorRequestApi = {
  getAll: (status?: string, page = 1, limit = 20) => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    params.set('page', String(page));
    params.set('limit', String(limit));
    return api.get<ApiResponse<VendorRequest[]>>(`${ENDPOINTS.ADMIN.VENDOR_REQUESTS.BASE}?${params}`).then((r) => r.data);
  },

  getPendingCount: () =>
    api.get<ApiResponse<{ count: number }>>(ENDPOINTS.ADMIN.VENDOR_REQUESTS.PENDING_COUNT).then((r) => r.data),

  getById: (id: string) =>
    api.get<ApiResponse<VendorRequest>>(ENDPOINTS.ADMIN.VENDOR_REQUESTS.BY_ID(id)).then((r) => r.data),

  approve: (id: string) =>
    api.post<ApiResponse<{ vendor: object; tempPassword: string }>>(ENDPOINTS.ADMIN.VENDOR_REQUESTS.APPROVE(id)).then((r) => r.data),

  reject: (id: string, reason: string) =>
    api.post<ApiResponse<VendorRequest>>(ENDPOINTS.ADMIN.VENDOR_REQUESTS.REJECT(id), { reason }).then((r) => r.data),

  requestInfo: (id: string, remarks: string) =>
    api.post<ApiResponse<VendorRequest>>(ENDPOINTS.ADMIN.VENDOR_REQUESTS.REQUEST_INFO(id), { remarks }).then((r) => r.data),
};

