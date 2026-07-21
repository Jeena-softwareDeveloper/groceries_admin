export const ENDPOINTS = {
  HEALTH: '/health',
  AUTH: {
    ME: '/auth/me',
    ADMIN_LOGIN: '/auth/admin/login',
    VENDOR_LOGIN: '/auth/vendor/login',
    LOGOUT: '/auth/logout',
  },
  ADMIN: {
    AREAS: '/admin/areas',
    DISTRICTS: '/admin/districts',
    CATEGORIES: '/admin/categories',
    VENDORS: {
      BASE: '/admin/vendors',
      APPROVE: (id: string) => `/admin/vendors/${id}/approve`,
      REJECT: (id: string) => `/admin/vendors/${id}/reject`,
    },
    BANNERS: '/admin/banners',
    CUSTOMERS: {
      BASE: '/admin/customers',
      BLOCK: (id: string) => `/admin/customers/${id}/block`,
      UNBLOCK: (id: string) => `/admin/customers/${id}/unblock`,
    },
    MICRO_BANNERS: '/admin/micro-banners',
    DELIVERY_CHARGES: '/admin/delivery-charges',
    OFFERS: '/admin/offers',
    COUPONS: '/admin/coupons',
    NOTIFICATIONS: {
      BROADCAST: '/admin/notifications/broadcast',
    },
    SETTINGS: '/admin/settings',
    VENDOR_REQUESTS: {
      BASE: '/admin/vendor-requests',
      PENDING_COUNT: '/admin/vendor-requests/pending-count',
      BY_ID: (id: string) => `/admin/vendor-requests/${id}`,
      APPROVE: (id: string) => `/admin/vendor-requests/${id}/approve`,
      REJECT: (id: string) => `/admin/vendor-requests/${id}/reject`,
      REQUEST_INFO: (id: string) => `/admin/vendor-requests/${id}/request-info`,
    },
  },
  VENDOR: {
    DASHBOARD: '/vendor/dashboard',
    PRODUCTS: {
      BASE: '/vendor/products',
      PUBLISH: (id: string) => `/vendor/products/${id}/publish`,
    },
    CATEGORIES: '/vendor/categories',
    INVENTORY: (id: string) => `/vendor/inventory/${id}`,
    ORDERS: {
      BASE: '/vendor/orders',
      UPDATE: (id: string) => `/vendor/orders/${id}`,
    },
  },
} as const;

