import { Area } from './area.types';

export type VendorStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Vendor {
  id: string;
  shopName: string;
  email: string;
  code?: string;
  logoUrl?: string;
  turnover?: number;
  productsCount?: number;
  status: VendorStatus;
  area: Area;
}

export interface RejectVendorDto {
  reason: string;
}


