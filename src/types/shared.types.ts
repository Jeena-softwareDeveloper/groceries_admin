export interface HealthStatus {
  status: 'ok' | 'error';
  services: {
    database: 'up' | 'down';
    redis: 'up' | 'down';
  };
}

export interface AdminDashboardData {
  kpi: {
    totalVendors: number;
    vendorsDelta: string;
    totalCustomers: number;
    customersDelta: string;
    totalOrders: number;
    ordersDelta: string;
    totalRevenue: number;
    revenueDelta: string;
  };
  salesOverview: {
    total: number;
    percentage: string;
    thisWeek: number;
    today: number;
    orders: number;
    avgOrder: number;
  };
  recentOrders: Array<{
    id: string;
    name: string;
    initials: string;
    amount: string;
    status: string;
    statusStyle: string;
    time: string;
  }>;
  topCategories: Array<{
    name: string;
    orders: number;
    pct: string;
    icon: string;
    bg: string;
    color: string;
  }>;
  topVendors: Array<{
    name: string;
    orders: number;
    rev: string;
    rating: string;
    bg: string;
    color: string;
  }>;
}

