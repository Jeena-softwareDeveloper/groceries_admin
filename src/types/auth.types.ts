export type Role = 'SUPER_ADMIN' | 'VENDOR' | 'USER';

export interface User {
  id: string;
  email: string;
  name?: string;
  shopName?: string;
  role: Role;
}

