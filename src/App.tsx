import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DistrictsPage from './pages/DistrictsPage';
import AreasPage from './pages/AreasPage';
import CategoriesPage from './pages/CategoriesPage';
import VendorsPage from './pages/VendorsPage';
import StaffsPage from './pages/StaffsPage';
import StaffDetailPage from './pages/StaffDetailPage';
import SettingsPage from './pages/SettingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import { BannersPage, CustomersPage, NotificationsPage, OffersPage, CouponsPage, MicroBannersPage, DeliveryChargesPage } from './pages/AdminExtras';
import ProductApprovalsPage from './pages/ProductApprovalsPage';
import SettlementsPage from './pages/SettlementsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import QrGeneratorPage from './pages/QrGeneratorPage';

import { AdminRoute, GuestRoute } from './guards';

import { Toaster } from 'sonner';

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
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
            <Route path="staffs" element={<StaffsPage />} />
            <Route path="staffs/:id" element={<StaffDetailPage />} />
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
            <Route path="qr-generator" element={<QrGeneratorPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


