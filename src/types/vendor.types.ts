import { Area } from './area.types';

export type VendorStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Vendor {
  id: string;
  shopName: string;
  email: string;
  phone?: string;
  code?: string;
  logoUrl?: string;
  turnover?: number;
  productsCount?: number;
  status: VendorStatus;
  area: Area;
  staffReferralCode?: string;
}

export interface CreateVendorInput {
  shopName: string;
  email: string;
  phone: string;
  address: string;
  districtId: string;
  areaId: string;
  staffReferralCode?: string;
}

export interface RejectVendorDto {
  reason: string;
}


