export interface District {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  _count?: { areas: number };
}

export interface CreateDistrictDto {
  name: string;
  code: string;
  isActive: boolean;
}


