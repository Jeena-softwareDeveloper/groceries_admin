import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vendorRequestApi } from '../api/vendor-request.api';
import {
  LayoutDashboard, MapPin, Map, Grid, Store, Image, Layers, Truck, Tag, Ticket, BarChart3, Users, Bell, Settings, LogOut, Search, HelpCircle, Menu, ClipboardList, X
} from 'lucide-react';



const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/districts', label: 'Districts', icon: Map },
  { path: '/areas', label: 'Areas', icon: MapPin },
  { path: '/categories', label: 'Categories', icon: Grid },
  { path: '/vendors', label: 'Vendors', icon: Store },
  { path: '/vendor-requests', label: 'Vendor Requests', icon: ClipboardList, badge: true },
  { path: '/product-approvals', label: 'Product Approvals', icon: ClipboardList },
  { path: '/settlements', label: 'Settlements', icon: Tag },
  { path: '/banners', label: 'Banners', icon: Image },
  { path: '/micro-banners', label: 'Micro Banners', icon: Layers },
  { path: '/delivery-charges', label: 'Delivery', icon: Truck },
  { path: '/offers', label: 'Offers', icon: Tag },
  { path: '/coupons', label: 'Coupons', icon: Ticket },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/settings', label: 'Settings', icon: Settings },
];


export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    vendorRequestApi.getPendingCount()
      .then((r: any) => setPendingCount(r?.data?.count ?? 0))
      .catch(() => {});
  }, []);

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <div className="flex flex-col h-full overflow-hidden w-full">
      {/* Logo */}
      <div className={`flex items-center shrink-0 ${isSidebarOpen ? 'p-4 gap-2' : 'py-5 px-3 justify-center'}`}>
        <div className="flex items-center justify-center relative w-11 h-11 shrink-0">
          <img src="/logo.png" alt="All Time Market" className="w-full h-full object-contain" />
        </div>
        {isSidebarOpen && (
          <div className="flex flex-col min-w-0">
            <h2 className="m-0 text-[15px] font-bold tracking-wide whitespace-nowrap">All Time Market</h2>
            <span className="text-[9px] text-green-100 font-medium tracking-wide whitespace-nowrap">Fresh Groceries, Fast Delivery</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto flex flex-col" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <nav className="flex flex-col px-2 gap-0.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const showBadge = (item as any).badge && pendingCount > 0;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onLinkClick}
                className={`relative flex items-center ${isSidebarOpen ? 'gap-3 px-3' : 'justify-center px-0'} py-2.5 rounded-lg text-[13px] font-medium transition-colors no-underline ${isActive ? 'bg-green-600 text-white' : 'text-slate-200 hover:bg-white/10'}`}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <Icon size={17} className="shrink-0" />
                {isSidebarOpen && <span style={{ flex: 1 }} className="whitespace-nowrap">{item.label}</span>}
                {showBadge && isSidebarOpen && (
                  <span style={{ background: '#dc2626', color: '#fff', borderRadius: 999, padding: '1px 6px', fontSize: 10, fontWeight: 700, minWidth: 18, textAlign: 'center' }}>
                    {pendingCount}
                  </span>
                )}
                {showBadge && !isSidebarOpen && (
                  <span style={{ background: '#dc2626', borderRadius: 999, width: 7, height: 7, position: 'absolute', right: '50%', marginRight: '-10px', top: '10px' }} />
                )}
              </Link>
            );
          })}
        </nav>

        {isSidebarOpen && (
          <div className="mx-3 mb-3 shrink-0 bg-gradient-to-b from-[#104a2d] to-[#0d3d25] border border-white/10 rounded-lg p-4 text-left relative overflow-hidden">
            <h4 className="m-0 mb-1 text-xs font-bold relative z-10 whitespace-nowrap">Grow your marketplace</h4>
            <p className="m-0 mb-3 text-[11px] text-slate-300 leading-snug relative z-10">Add more vendors and increase your reach.</p>
            <button type="button" className="w-full bg-green-600 text-white border-none py-1.5 rounded-md text-[11px] font-semibold cursor-pointer relative z-10 hover:bg-green-700 transition-colors">
              View Analytics
            </button>
          </div>
        )}
      </div>

      {/* User */}
      <div className={`mx-3 mb-4 pt-3 shrink-0 border-t border-white/10 flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center flex-col gap-3'}`}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 shrink-0 bg-green-200 text-green-800 rounded-full flex items-center justify-center font-bold text-xs">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'SA'}
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col min-w-0">
              <strong className="text-[12px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis max-w-[110px]">
                {user?.name || 'Super Admin'}
              </strong>
              <span className="text-[9px] text-slate-300 whitespace-nowrap overflow-hidden text-ellipsis max-w-[110px]">
                {user?.email || 'admin@districtmart.com'}
              </span>
            </div>
          )}
        </div>
        <button type="button" onClick={handleLogout} className="bg-transparent border-none text-slate-300 cursor-pointer p-1 rounded-md flex items-center hover:bg-white/10 hover:text-white transition-colors" title="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[240px] bg-[#0d3d25] text-white flex flex-col shrink-0 transition-transform duration-300 ease-in-out lg:hidden ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button
          className="absolute top-4 right-3 text-white bg-transparent border-none cursor-pointer z-10"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <X size={18} />
        </button>
        <SidebarContent onLinkClick={() => setIsMobileSidebarOpen(false)} />
      </aside>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex bg-[#0d3d25] text-white flex-col shrink-0 transition-[width] duration-300 ease-in-out ${isSidebarOpen ? 'w-[220px]' : 'w-[64px]'}`}>
        <SidebarContent />
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <header className="h-[60px] bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0 gap-3">
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile menu button */}
            <button type="button" onClick={() => setIsMobileSidebarOpen(true)} className="bg-transparent border-none text-slate-600 cursor-pointer p-1 lg:hidden hover:bg-slate-100 rounded-md transition-colors">
              <Menu size={22} />
            </button>
            {/* Desktop collapse button */}
            <button type="button" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="bg-transparent border-none text-slate-600 cursor-pointer p-1 hidden lg:block hover:bg-slate-100 rounded-md transition-colors">
              <Menu size={22} />
            </button>
          </div>

          <div className="flex-1 max-w-[400px] hidden sm:block">
            <div className="relative flex items-center">
              <Search size={15} className="absolute left-3 text-slate-400" />
              <input type="text" placeholder="Search anything..." className="w-full bg-slate-50 border border-slate-200 py-2 pl-9 pr-16 rounded-lg text-sm outline-none transition-all focus:border-green-600 focus:bg-white focus:ring-[3px] focus:ring-green-600/10" />
              <span className="absolute right-3 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-semibold hidden md:block">Ctrl + K</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button className="bg-transparent border-none text-slate-600 cursor-pointer relative p-1.5 hover:text-slate-900 hover:bg-slate-100 rounded-md">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button className="bg-transparent border-none text-slate-600 cursor-pointer relative p-1.5 hover:text-slate-900 hover:bg-slate-100 rounded-md hidden sm:block">
              <HelpCircle size={18} />
            </button>

            <div className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'SA'}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-[12px] font-semibold text-slate-900 leading-tight">{user?.name || 'Super Admin'}</span>
                <span className="text-[10px] text-slate-500 leading-tight">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - responsive padding */}
        <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-5 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}


