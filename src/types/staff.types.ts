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
  district?: { id: string; name: string } | null;
  area?: { id: string; name: string } | null;
  vendorsCount?: number;
  referredVendors?: {
    id: string;
    shopName: string;
    phone: string;
    code?: string;
    status: string;
    createdAt: string;
    area?: { name: string };
  }[];
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
