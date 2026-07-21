import { District } from './district.types';

export interface Area {
  id: string;
  name: string;
  pincode?: string;
  isActive: boolean;
  district: District;
}

export interface CreateAreaDto {
  districtId: string;
  name: string;
  pincode?: string;
  isActive: boolean;
}

