import { Area } from './area.types';

export type VendorStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Vendor {
  id: string;
  shopName: string;
  email: string;
  status: VendorStatus;
  area: Area;
}

export interface RejectVendorDto {
  reason: string;
}

