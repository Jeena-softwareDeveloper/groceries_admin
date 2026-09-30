import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { staffApi } from '../api';
import type { Staff, ReferredVendor, ReferredCustomer, StaffAuditLog, CreateStaffInput, UpdateStaffInput } from '../types/staff.types';
import { 
  PageHeader,
  StatusBadge, 
  EmptyState, 
  StaffQrModal, 
  StaffInfoModal,
  VendorViewModal, 
  CustomerViewModal,
  AddStaffDrawer
} from '../components/ui';
import { 
  ArrowLeft, 
  QrCode, 
  Edit2, 
  Copy, 
  Check, 
  Store, 
  Users, 
  Eye, 
  Scan, 
  Smartphone, 
  MousePointerClick, 
  TrendingUp, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Activity, 
  PlusCircle, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  User
} from 'lucide-react';
import { toast } from 'sonner';

const staffStatusColorMap = {
  ACTIVE: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  INACTIVE: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-slate-200' },
};

const vendorStatusColorMap = {
  APPROVED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  SUSPENDED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  REJECTED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export default function StaffDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'vendors' | 'customers' | 'audits'>('vendors');
  
  // Search states for tabs
  const [vendorSearch, setVendorSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [auditFilter, setAuditFilter] = useState<string>('ALL');

  // Modals & Drawers
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<ReferredVendor | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<ReferredCustomer | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const fetchStaffDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await staffApi.getById(id);
      if (res.data) {
        setStaff(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load staff details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffDetail();
  }, [id]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Simulate or Record audit events (QR scan, App install, Link click)
  const handleRecordAudit = async (action: 'QR_SCAN' | 'LINK_CLICK' | 'APP_INSTALL', platform: string = 'Android') => {
    if (!id) return;
    try {
      setIsRecording(true);
      await staffApi.recordAudit(id, {
        action,
        platform,
        deviceInfo: platform === 'Web' ? 'Chrome 128 / Windows 11' : 'Samsung Galaxy S23 (Android 14)',
        ipAddress: '106.195.42.89',
        metadata: { source: 'Admin Portal Simulator', referrer: 'qr-campaign' }
      });
      toast.success(`Recorded new ${action.replace('_', ' ')} event!`);
      fetchStaffDetail();
    } catch (err: any) {
      toast.error(err.message || 'Failed to record audit');
    } finally {
      setIsRecording(false);
    }
  };

  const handleUpdateStaff = async (data: CreateStaffInput | UpdateStaffInput) => {
    if (!id) return;
    try {
      await staffApi.update(id, data as UpdateStaffInput);
      toast.success('Staff details updated successfully');
      setIsEditDrawerOpen(false);
      fetchStaffDetail();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update staff');
      throw err;
    }
  };

  if (loading && !staff) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
          <p className="text-sm font-medium">Loading staff profile and analytics...</p>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="p-8">
        <button 
          onClick={() => navigate('/staffs')}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Staffs
        </button>
        <EmptyState 
          icon={Users}
          title="Staff Member Not Found"
          description="The staff record could not be found or may have been deleted."
          action={
            <button
              onClick={() => navigate('/staffs')}
              className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold cursor-pointer"
            >
              Return to Staffs
            </button>
          }
        />
      </div>
    );
  }

  // Links
  const vendorLink = `https://alltimemarket.com/become-vendor?ref=${staff.code}`;
  const appInstallLink = `https://alltimemarket.com/app?ref=${staff.code}`;

  // Filtered lists
  const filteredVendors = (staff.referredVendors || []).filter(v => 
    v.shopName.toLowerCase().includes(vendorSearch.toLowerCase()) ||
    v.phone.includes(vendorSearch) ||
    (v.code && v.code.toLowerCase().includes(vendorSearch.toLowerCase()))
  );

  const filteredCustomers = (staff.referredCustomers || []).filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch) ||
    (c.email && c.email.toLowerCase().includes(customerSearch.toLowerCase()))
  );

  const filteredAudits = (staff.auditLogs || []).filter(a => {
    if (auditFilter === 'ALL') return true;
    return a.action === auditFilter;
  });

  const analytics = staff.analytics || {
    totalScans: 0,
    totalClicks: 0,
    totalInstalls: 0,
    totalVisitors: 0,
    totalVendors: staff.referredVendors?.length || 0,
    totalCustomers: staff.referredCustomers?.length || 0,
    conversionRate: 0,
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 w-full pb-12">
      {/* Top Header Portal with Back Button and Actions */}
      <PageHeader
        title={
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => navigate('/staffs')}
              className="p-1.5 -ml-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 font-semibold text-xs sm:text-sm cursor-pointer"
              title="Back to Staffs"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="truncate text-slate-800 font-bold">{staff.name}</span>
          </div>
        }
        description="Staff member profile, campaign links, and referral analytics."
        action={
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => fetchStaffDetail()}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsInfoModalOpen(true)}
              className="h-9 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-emerald-200 shadow-2xs cursor-pointer"
              title="View Staff Profile & Referral Links"
            >
              <User size={14} />
              <span>Staff Info</span>
            </button>
            <button
              onClick={() => setIsEditDrawerOpen(true)}
              className="h-9 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Edit2 size={13} />
              <span className="hidden sm:inline">Edit Profile</span>
            </button>
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="h-9 px-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <QrCode size={13} />
              <span className="hidden sm:inline">View QR</span>
            </button>
          </div>
        }
      />

      {/* Analytics / Audits Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">QR Scans</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Scan className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{analytics.totalScans}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Physical QR scans</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Link Clicks</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{analytics.totalClicks}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Web & share clicks</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">App Installs</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{analytics.totalInstalls}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">App downloads</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Vendors</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{staff.referredVendors?.length || 0}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Stores onboarded</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Customers</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{staff.referredCustomers?.length || 0}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Users acquired</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Conversion</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {analytics.conversionRate}%
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Visitor to signup</span>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 border-b border-slate-100">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('vendors')}
              className={`pb-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'vendors'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Store className="w-4 h-4" />
              Referred Vendors
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'vendors' ? 'bg-primary-50 text-primary-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {staff.referredVendors?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`pb-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'customers'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              Referred Customers
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'customers' ? 'bg-primary-50 text-primary-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {staff.referredCustomers?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('audits')}
              className={`pb-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'audits'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              Audits & Activity Log
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'audits' ? 'bg-primary-50 text-primary-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {staff.auditLogs?.length || 0}
              </span>
            </button>
          </div>

          {/* Quick Simulation / Record buttons for testing */}
          <div className="hidden md:flex items-center gap-2 pb-4">
            <span className="text-xs text-slate-400 font-medium">Test Events:</span>
            <button
              disabled={isRecording}
              onClick={() => handleRecordAudit('QR_SCAN', 'Android')}
              className="px-2.5 py-1 text-xs bg-slate-50 hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              <Scan className="w-3 h-3" /> + Scan
            </button>
            <button
              disabled={isRecording}
              onClick={() => handleRecordAudit('LINK_CLICK', 'Web')}
              className="px-2.5 py-1 text-xs bg-slate-50 hover:bg-purple-50 text-purple-700 border border-purple-200 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              <MousePointerClick className="w-3 h-3" /> + Click
            </button>
            <button
              disabled={isRecording}
              onClick={() => handleRecordAudit('APP_INSTALL', 'Android')}
              className="px-2.5 py-1 text-xs bg-slate-50 hover:bg-teal-50 text-teal-700 border border-teal-200 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              <Smartphone className="w-3 h-3" /> + Install
            </button>
          </div>
        </div>

        {/* TAB 1: REFERRED VENDORS */}
        {activeTab === 'vendors' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                value={vendorSearch}
                onChange={(e) => setVendorSearch(e.target.value)}
                placeholder="Search vendor by shop name, phone or code..."
                className="max-w-md w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
              <span className="text-xs text-slate-400">
                Showing {filteredVendors.length} of {staff.referredVendors?.length || 0} vendors
              </span>
            </div>

            {filteredVendors.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Shop / Store</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Joined Date</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVendors.map((vendor, index) => (
                      <tr key={vendor.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 text-xs font-mono text-slate-400">
                          {String(index + 1).padStart(2, '0')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                              <Store className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-semibold text-slate-900 block">{vendor.shopName}</span>
                              <span className="text-xs font-mono text-slate-400">{vendor.code || 'VND'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">
                          {vendor.phone}
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-xs">
                          {vendor.area?.name || 'Area'}, {vendor.district?.name || 'District'}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={vendor.status} colorMap={vendorStatusColorMap} />
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-xs">
                          {new Date(vendor.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedVendor(vendor)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={Store}
                title="No Vendors Onboarded Yet"
                description={
                  vendorSearch 
                    ? "No vendors match your search criteria." 
                    : "Vendors who register using this staff member's referral code or QR will appear here."
                }
              />
            )}
          </div>
        )}

        {/* TAB 2: REFERRED CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Search customer by name, phone or email..."
                className="max-w-md w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
              <span className="text-xs text-slate-400">
                Showing {filteredCustomers.length} of {staff.referredCustomers?.length || 0} customers
              </span>
            </div>

            {filteredCustomers.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Orders</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Registered Date</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.map((customer, index) => (
                      <tr key={customer.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 text-xs font-mono text-slate-400">
                          {String(index + 1).padStart(2, '0')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                              {customer.name?.charAt(0).toUpperCase() || 'C'}
                            </div>
                            <span className="font-semibold text-slate-900">{customer.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">
                          {customer.phone}
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-xs">
                          {customer.email || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold">
                            {customer.ordersCount} orders
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            customer.isBlocked ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {customer.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-xs">
                          {new Date(customer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedCustomer(customer)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="No Customers Referred Yet"
                description={
                  customerSearch 
                    ? "No customers match your search criteria." 
                    : "Customers who sign up using this staff member's campaign link or QR will appear here."
                }
              />
            )}
          </div>
        )}

        {/* TAB 3: AUDITS & ACTIVITY LOG */}
        {activeTab === 'audits' && (
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                {['ALL', 'QR_SCAN', 'LINK_CLICK', 'APP_INSTALL', 'VENDOR_ONBOARDED', 'CUSTOMER_ONBOARDED'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setAuditFilter(type)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      auditFilter === type
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {type.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <span className="text-xs text-slate-400">
                {filteredAudits.length} events logged
              </span>
            </div>

            {filteredAudits.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Event Type</th>
                      <th className="py-3 px-4">Platform</th>
                      <th className="py-3 px-4">Device / Client</th>
                      <th className="py-3 px-4">IP Address</th>
                      <th className="py-3 px-4">Details / Metadata</th>
                      <th className="py-3 px-4 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAudits.map((log) => {
                      const getActionBadge = (action: string) => {
                        switch (action) {
                          case 'QR_SCAN':
                            return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"><Scan className="w-3 h-3" /> QR Scan</span>;
                          case 'LINK_CLICK':
                            return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200"><MousePointerClick className="w-3 h-3" /> Link Click</span>;
                          case 'APP_INSTALL':
                            return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200"><Smartphone className="w-3 h-3" /> App Install</span>;
                          case 'VENDOR_ONBOARDED':
                            return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><Store className="w-3 h-3" /> Vendor Added</span>;
                          case 'CUSTOMER_ONBOARDED':
                            return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"><Users className="w-3 h-3" /> Customer Joined</span>;
                          default:
                            return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{action}</span>;
                        }
                      };

                      return (
                        <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4">
                            {getActionBadge(log.action)}
                          </td>
                          <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                            {log.platform || 'Android'}
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-600 truncate max-w-xs">
                            {log.deviceInfo || 'Mobile Device'}
                          </td>
                          <td className="py-3 px-4 font-mono text-xs text-slate-500">
                            {log.ipAddress || '127.0.0.1'}
                          </td>
                          <td className="py-3 px-4 text-xs font-mono text-slate-600 max-w-sm truncate">
                            {log.metadata || '—'}
                          </td>
                          <td className="py-3 px-4 text-right text-xs text-slate-500 whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={Activity}
                title="No Audit Logs Recorded"
                description="Activity logs like QR code scans, referral link clicks, and app installs will appear here as they occur."
              />
            )}
          </div>
        )}
      </div>

      {/* Staff Profile & Referral Links Info Modal */}
      <StaffInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        staff={staff}
        onOpenQr={() => setIsQrModalOpen(true)}
        onOpenEdit={() => setIsEditDrawerOpen(true)}
      />

      {/* QR Code Modal */}
      <StaffQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        staff={staff}
      />

      {/* Edit Staff Drawer */}
      <AddStaffDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        staffToEdit={staff}
        onSave={handleUpdateStaff}
      />

      {/* Vendor Details Modal */}
      <VendorViewModal
        isOpen={!!selectedVendor}
        onClose={() => setSelectedVendor(null)}
        vendor={selectedVendor}
      />

      {/* Customer Details Modal */}
      <CustomerViewModal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        customer={selectedCustomer}
      />
    </div>
  );
}
