import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DistrictsPage from './pages/DistrictsPage';
import AreasPage from './pages/AreasPage';
import CategoriesPage from './pages/CategoriesPage';
import VendorsPage from './pages/VendorsPage';
import SettingsPage from './pages/SettingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import { BannersPage, CustomersPage, NotificationsPage, OffersPage, CouponsPage, MicroBannersPage, DeliveryChargesPage } from './pages/AdminExtras';
import VendorRequestsPage from './pages/VendorRequestsPage';
import ProductApprovalsPage from './pages/ProductApprovalsPage';
import SettlementsPage from './pages/SettlementsPage';
import AuditLogsPage from './pages/AuditLogsPage';

import { AdminRoute, GuestRoute } from './guards';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route
            path="/"
            element={
              <AdminRoute>
                <Layout />
              </AdminRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="districts" element={<DistrictsPage />} />
            <Route path="areas" element={<AreasPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="vendors" element={<VendorsPage />} />
            <Route path="vendor-requests" element={<VendorRequestsPage />} />
            <Route path="product-approvals" element={<ProductApprovalsPage />} />
            <Route path="settlements" element={<SettlementsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="banners" element={<BannersPage />} />

            <Route path="micro-banners" element={<MicroBannersPage />} />
            <Route path="delivery-charges" element={<DeliveryChargesPage />} />
            <Route path="offers" element={<OffersPage />} />
            <Route path="coupons" element={<CouponsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


