import { useEffect, useState } from 'react';
import { healthApi, dashboardApi } from '../api';
import type { HealthStatus, AdminDashboardData } from '@shared/types';
import {
  Calendar, Store, Users, ShoppingBag, IndianRupee, CheckCircle2, AlertCircle, Star, Apple, Milk, PackageSearch, CupSoda, Cookie, TrendingUp, ArrowRight, Loader2
} from 'lucide-react';
import './DashboardPage.css';

const ICONS: Record<string, any> = { Apple, Milk, PackageSearch, CupSoda, Cookie };

export default function DashboardPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    healthApi.check()
      .then((res) => setHealth(res.data))
      .catch(() => setHealth(null));
      
    dashboardApi.fetchDashboardData()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-500 font-bold">Failed to load dashboard data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 w-full max-w-[1600px] mx-auto pb-8 text-slate-900">

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Vendors', value: data.kpi.totalVendors.toString(), delta: data.kpi.vendorsDelta, icon: Store, bg: 'bg-emerald-100', color: 'text-emerald-600' },
          { label: 'Total Customers', value: data.kpi.totalCustomers.toString(), delta: data.kpi.customersDelta, icon: Users, bg: 'bg-blue-100', color: 'text-blue-600' },
          { label: 'Total Orders', value: data.kpi.totalOrders.toString(), delta: data.kpi.ordersDelta, icon: ShoppingBag, bg: 'bg-orange-100', color: 'text-orange-600' },
          { label: 'Total Revenue', value: `₹${data.kpi.totalRevenue.toLocaleString('en-IN')}`, delta: data.kpi.revenueDelta, icon: IndianRupee, bg: 'bg-emerald-100', color: 'text-emerald-600' },
        ].map((kpi: any, i: number) => (
          <div key={i} className="group bg-white border border-slate-200/75 rounded-lg p-3 sm:p-4 lg:p-5 flex flex-col shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="min-w-0 flex-1 pr-2">
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-400 block mb-1 sm:mb-2 truncate">{kpi.label}</span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight m-0 text-slate-700 truncate">{kpi.value}</h3>
              </div>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${kpi.bg} ${kpi.color} shrink-0`}>
                <kpi.icon size={16} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs font-medium text-slate-500">
              <span className="flex items-center text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-bold">
                <TrendingUp size={10} className="mr-0.5" strokeWidth={3} /> {kpi.delta}
              </span>
              <span className="opacity-70 hidden sm:inline">vs last 30 days</span>
            </div>
          </div>
        ))}
      </div>

      {/* System Health Status Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 bg-gradient-to-r from-emerald-950 to-emerald-900 border border-emerald-800/50 rounded-lg p-3 sm:p-4 lg:p-5 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            {health?.status === 'ok' ? <CheckCircle2 size={14} strokeWidth={2.5} /> : <AlertCircle size={14} className="text-red-400" />}
            API Status
          </span>
          <span className={`text-sm font-bold ${health?.status !== 'ok' ? 'text-red-400' : 'text-white'}`}>
            {health?.status === 'ok' ? 'Healthy' : health === null ? 'Checking…' : 'Down'}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            {health?.services.database === 'up' ? <CheckCircle2 size={14} strokeWidth={2.5} /> : <AlertCircle size={14} className="text-red-400" />}
            Database
          </span>
          <span className={`text-sm font-bold ${health?.services.database !== 'up' ? 'text-red-400' : 'text-white'}`}>
            {health?.services.database === 'up' ? 'Operational' : 'Error'}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            {health?.services.redis === 'up' ? <CheckCircle2 size={14} strokeWidth={2.5} /> : <AlertCircle size={14} className="text-amber-400" />}
            Redis
          </span>
          <span className={`text-sm font-bold ${health?.services.redis !== 'up' ? 'text-amber-400' : 'text-white'}`}>
            {health?.services.redis === 'up' ? 'Operational' : 'Fallback'}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Server Load</span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white">32%</span>
            <div className="sparkline-mock flex-1 h-1.5 bg-emerald-800 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-emerald-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Sales Overview & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr] gap-4 sm:gap-5">
        {/* Sales Overview */}
        <div className="bg-white border border-slate-200/75 rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4 sm:mb-5">
            <h3 className="text-base sm:text-lg font-semibold tracking-tight m-0 text-slate-700">Sales Overview</h3>
            <button className="appearance-none px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-100">
              This Month
            </button>
          </div>
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Sales</span>
            <div className="flex flex-wrap items-end gap-2 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-700">
              ₹{data.salesOverview.total.toLocaleString('en-IN')}
              <span className="flex items-center text-sm text-emerald-600 font-bold mb-1.5">
                <TrendingUp size={16} className="mr-1" strokeWidth={3} /> {data.salesOverview.percentage}
                <span className="text-slate-400 font-medium text-xs ml-1.5 tracking-normal">vs last month</span>
              </span>
            </div>
          </div>
          <div className="sales-chart-img flex-1 min-h-[160px]"></div>
          <div className="flex justify-between border-t border-slate-100 pt-5 mt-4">
            {[
              { label: 'This Week', value: `₹${data.salesOverview.thisWeek.toLocaleString('en-IN')}` },
              { label: 'Today', value: `₹${data.salesOverview.today.toLocaleString('en-IN')}` },
              { label: 'Orders', value: data.salesOverview.orders.toLocaleString('en-IN') },
              { label: 'Avg. Order Value', value: `₹${data.salesOverview.avgOrder.toLocaleString('en-IN')}` },
            ].map((stat: any, i: number) => (
              <div key={i} className="text-center px-2">
                <strong className="block text-base font-semibold mb-0.5 text-slate-700">{stat.value}</strong>
                <span className="text-xs font-normal text-slate-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-slate-200/75 rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold tracking-tight m-0 text-slate-700">Recent Orders</h3>
            <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            {data.recentOrders.map((order: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-default">
                <div className="flex items-center gap-3 w-[45%]">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                    {order.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold m-0 leading-tight">{order.name}</p>
                    <p className="text-xs text-slate-400 m-0">{order.id}</p>
                  </div>
                </div>
                <span className="text-sm font-bold w-[20%]">{order.amount}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold border ${order.statusStyle}`}>{order.status}</span>
                <span className="text-xs text-slate-400 w-[18%] text-right">{order.time}</span>
              </div>
            ))}
            {data.recentOrders.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                No recent orders found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Top Categories & Top Vendors */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr] gap-4 sm:gap-5">
        {/* Top Categories */}
        <div className="bg-white border border-slate-200/75 rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4 sm:mb-5">
            <h3 className="text-base sm:text-lg font-semibold tracking-tight m-0 text-slate-700">Top Categories</h3>
            <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-5">
            {data.topCategories.map((cat: any, i: number) => {
              const IconComponent = ICONS[cat.icon] || PackageSearch;
              return (
                <div key={i} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-3.5 w-[38%]">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cat.bg} ${cat.color}`}>
                      <IconComponent size={16} strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{cat.name}</span>
                  </div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full mx-4 overflow-hidden">
                    <div className="h-full bg-slate-800 rounded-full transition-all duration-500" style={{ width: cat.pct }}></div>
                  </div>
                  <span className="text-xs font-bold text-slate-500 w-[22%] text-right">{cat.orders}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Vendors Table */}
        <div className="bg-white border border-slate-200/75 rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold tracking-tight m-0 text-slate-700">Top Vendors</h3>
            <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-3 pr-4">Vendor</th>
                  <th className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-3 pr-4">Orders</th>
                  <th className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-3 pr-4">Revenue</th>
                  <th className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-3">Rating</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {data.topVendors.map((v: any, i: number) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors group cursor-default">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5 font-bold">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${v.bg} ${v.color}`}>
                          <Store size={13} strokeWidth={2.5} />
                        </div>
                        <span className="group-hover:text-slate-900 transition-colors">{v.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-semibold text-slate-600">{v.orders}</td>
                    <td className="py-3 pr-4 font-bold text-slate-800">{v.rev}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                        {v.rating} <Star size={12} fill="#f59e0b" color="#f59e0b" strokeWidth={0} />
                      </span>
                    </td>
                  </tr>
                ))}
                {data.topVendors.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500 font-medium">No vendors found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

