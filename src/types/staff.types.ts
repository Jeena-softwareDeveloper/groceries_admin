export interface ReferredVendor {
  id: string;
  shopName: string;
  phone: string;
  email?: string | null;
  code?: string;
  slug?: string;
  status: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  deliveryRadius?: number | null;
  commissionRate?: number | null;
  rating?: number | null;
  fssaiNumber?: string | null;
  gstNumber?: string | null;
  createdAt: string;
  area?: { id: string; name: string } | null;
  district?: { id: string; name: string } | null;
}

export interface ReferredCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  createdAt: string;
  isBlocked: boolean;
  ordersCount: number;
  currentLocation?: string | null;
  addresses?: {
    id: string;
    label?: string;
    line1?: string;
    line2?: string | null;
    city?: string;
    pincode?: string;
    isDefault: boolean;
  }[];
}

export interface StaffAuditLog {
  id: string;
  staffId: string;
  action: 'QR_SCAN' | 'LINK_CLICK' | 'APP_INSTALL' | 'VENDOR_ONBOARDED' | 'CUSTOMER_ONBOARDED';
  platform?: string | null;
  deviceInfo?: string | null;
  ipAddress?: string | null;
  metadata?: string | null;
  createdAt: string;
}

export interface StaffAnalytics {
  totalScans: number;
  totalClicks: number;
  totalInstalls: number;
  totalVisitors: number;
  totalVendors: number;
  totalCustomers: number;
  conversionRate: number;
}

export interface Staff {
  id: string;
  code: string;
  name: string;
  phone: string;
  email?: string | null;
  designation?: string | null;
  districtId?: string | null;
  areaId?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  district?: { id: string; name: string; code?: string } | null;
  area?: { id: string; name: string; pincode?: string } | null;
  vendorsCount?: number;
  customersCount?: number;
  referredVendors?: ReferredVendor[];
  referredCustomers?: ReferredCustomer[];
  auditLogs?: StaffAuditLog[];
  analytics?: StaffAnalytics;
}

export interface CreateStaffInput {
  name: string;
  phone: string;
  email?: string;
  designation?: string;
  code?: string;
  districtId?: string;
  areaId?: string;
}

export interface UpdateStaffInput {
  name?: string;
  phone?: string;
  email?: string;
  designation?: string;
  code?: string;
  districtId?: string;
  areaId?: string;
  isActive?: boolean;
}

