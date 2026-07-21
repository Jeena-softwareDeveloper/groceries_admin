import { 
  Calendar, 
  Download,
  Wallet,
  ShoppingBag,
  Users,
  Store,
  IndianRupee,
  Apple,
  Milk,
  PackageSearch,
  CupSoda,
  Cookie,
  MapPin,
  Banknote,
  Smartphone,
  CreditCard,
  ChevronDown,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import './AnalyticsPage.css';

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight m-0 mb-1.5">Analytics Overview</h1>
          <p className="text-sm font-medium text-slate-500 m-0">Track key performance metrics and insights of your marketplace.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-slate-200 bg-white rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200">
            <Calendar size={16} className="text-slate-500" />
            12 Jul 2025 - 12 Aug 2025
            <ChevronDown size={14} className="text-slate-400 ml-1" />
          </button>
          <button className="flex items-center gap-2 border border-transparent bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Row 1: KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {[
          { title: 'Total Revenue', value: '₹24,85,320', delta: '28.4%', up: true, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-100', line: 'emerald' },
          { title: 'Total Orders', value: '8,942', delta: '22.7%', up: true, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100', line: 'blue' },
          { title: 'Total Customers', value: '24,568', delta: '18.3%', up: true, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100', line: 'indigo' },
          { title: 'Total Vendors', value: '156', delta: '15.2%', up: true, icon: Store, color: 'text-orange-600', bg: 'bg-orange-100', line: 'orange' },
          { title: 'Average Order Value', value: '₹278', delta: '12.6%', up: true, icon: IndianRupee, color: 'text-teal-600', bg: 'bg-teal-100', line: 'teal' },
        ].map((kpi, i) => (
          <div key={i} className="group bg-white border border-slate-200/75 rounded-lg p-5 relative overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                <kpi.icon size={18} strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-slate-600">{kpi.title}</span>
            </div>
            <div className="z-10">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0 mb-2">{kpi.value}</h3>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="flex items-center text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                  <TrendingUp size={12} className="mr-1" /> {kpi.delta}
                </span>
                <span className="opacity-70 group-hover:opacity-100 transition-opacity">vs last 30d</span>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-10 opacity-30 group-hover:opacity-60 transition-opacity duration-500">
              <svg preserveAspectRatio="none" className="w-full h-full">
                {kpi.line === 'emerald' && <><path d="M0,40 L10,32 L30,36 L50,22 L70,28 L90,14 L100,5 L100,40 L0,40 Z" fill="rgba(16, 185, 129, 0.15)" /><path d="M0,40 L10,32 L30,36 L50,22 L70,28 L90,14 L100,5" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></>}
                {kpi.line === 'blue' && <><path d="M0,40 L20,28 L40,32 L60,14 L80,18 L100,5 L100,40 L0,40 Z" fill="rgba(59, 130, 246, 0.15)" /><path d="M0,40 L20,28 L40,32 L60,14 L80,18 L100,5" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></>}
                {kpi.line === 'indigo' && <><path d="M0,40 L10,36 L30,28 L50,30 L70,14 L90,18 L100,5 L100,40 L0,40 Z" fill="rgba(99, 102, 241, 0.15)" /><path d="M0,40 L10,36 L30,28 L50,30 L70,14 L90,18 L100,5" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></>}
                {kpi.line === 'orange' && <><path d="M0,40 L20,32 L40,22 L60,28 L80,10 L100,5 L100,40 L0,40 Z" fill="rgba(249, 115, 22, 0.15)" /><path d="M0,40 L20,32 L40,22 L60,28 L80,10 L100,5" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></>}
                {kpi.line === 'teal' && <><path d="M0,40 L20,36 L40,28 L60,32 L80,14 L100,5 L100,40 L0,40 Z" fill="rgba(20, 184, 166, 0.15)" /><path d="M0,40 L20,36 L40,28 L60,32 L80,14 L100,5" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></>}
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Revenue Line Chart & Orders Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/75 rounded-lg p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 m-0 tracking-tight">Revenue Overview</h3>
            <div className="relative">
              <select className="appearance-none pl-3 pr-8 py-1.5 border border-slate-200 rounded-md bg-white text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50 cursor-pointer focus:ring-2 focus:ring-slate-100 transition-colors">
                <option>This Month</option>
                <option>Last Month</option>
              </select>
              <ChevronDown size={14} className="text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Revenue</span>
            <div className="flex items-end gap-3 text-4xl font-black text-slate-900 tracking-tight">
              ₹24,85,320
              <span className="flex items-center text-sm text-emerald-600 font-bold mb-1.5"><TrendingUp size={16} className="mr-1" strokeWidth={3}/> 28.4% <span className="text-slate-400 font-medium text-xs ml-1.5 tracking-normal">vs last month</span></span>
            </div>
          </div>
          
          <div className="rev-chart-mock mb-8 flex-1"></div>
          
          <div className="flex justify-between border-t border-slate-100 pt-6">
            {[
              { label: 'This Week', value: '₹8,45,210' },
              { label: 'Today', value: '₹2,35,640' },
              { label: 'Orders', value: '8,942' },
              { label: 'Avg. Order Value', value: '₹278' },
              { label: 'Cancellation Rate', value: '5.6%' },
            ].map((stat, i) => (
              <div key={i} className="text-center px-2">
                <strong className="block text-lg font-extrabold text-slate-900 mb-1">{stat.value}</strong>
                <span className="text-xs font-medium text-slate-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Overview */}
        <div className="bg-white border border-slate-200/75 rounded-lg p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 m-0 tracking-tight">Orders Overview</h3>
            <div className="relative">
              <select className="appearance-none pl-3 pr-8 py-1.5 border border-slate-200 rounded-md bg-white text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50 cursor-pointer focus:ring-2 focus:ring-slate-100 transition-colors">
                <option>This Month</option>
              </select>
              <ChevronDown size={14} className="text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="donut-chart mb-8 shadow-sm">
              <div className="donut-inner shadow-sm">
                <strong className="text-3xl font-black text-slate-900 tracking-tight">8,942</strong>
                <span className="text-xs font-medium text-slate-500 mt-0.5">Total Orders</span>
              </div>
            </div>
            
            <div className="w-full flex flex-col gap-3">
              {[
                { label: 'Delivered', val: '5,124', pct: '57.3%', color: 'bg-emerald-500' },
                { label: 'Processing', val: '1,842', pct: '20.6%', color: 'bg-yellow-500' },
                { label: 'Shipped', val: '1,256', pct: '14.0%', color: 'bg-blue-500' },
                { label: 'Pending', val: '720', pct: '8.1%', color: 'bg-slate-300' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm group cursor-default">
                  <div className="flex items-center gap-2.5 text-slate-600 font-medium group-hover:text-slate-900 transition-colors">
                    <span className={`w-3 h-3 rounded-full ${item.color} shadow-sm`}></span> 
                    {item.label}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">{item.val}</span> 
                    <span className="text-slate-400 font-medium ml-1.5 w-12 inline-block text-right">({item.pct})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <a href="#" className="flex items-center justify-center gap-1.5 mt-8 pt-4 border-t border-slate-100 text-xs font-bold text-slate-500 no-underline hover:text-slate-900 transition-colors">
            View full orders report <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Row 3: Revenue Trend Bar Chart & Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Trend Bar Chart */}
        <div className="bg-white border border-slate-200/75 rounded-lg p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-900 m-0 tracking-tight">Revenue Trend</h3>
            <div className="relative">
              <select className="appearance-none pl-3 pr-8 py-1.5 border border-slate-200 rounded-md bg-white text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50 cursor-pointer focus:ring-2 focus:ring-slate-100 transition-colors">
                <option>Last 6 Months</option>
              </select>
              <ChevronDown size={14} className="text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between border-b border-l border-slate-100 pb-3 pl-3 relative ml-12 mt-4">
            {/* Y-Axis Labels */}
            <div className="absolute -left-12 h-full flex flex-col justify-between text-[11px] font-semibold text-slate-400 pb-3">
              <span>₹30L</span>
              <span>₹20L</span>
              <span>₹10L</span>
              <span>₹0</span>
            </div>
            {/* Y-Axis Grid Lines */}
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between pointer-events-none">
              <div className="w-full border-t border-slate-100/50"></div>
              <div className="w-full border-t border-slate-100/50"></div>
              <div className="w-full border-t border-slate-100/50"></div>
              <div></div>
            </div>

            {/* Bars */}
            {[
              { label: 'Mar 25', h: '50%' },
              { label: 'Apr 25', h: '55%' },
              { label: 'May 25', h: '55%' },
              { label: 'Jun 25', h: '65%' },
              { label: 'Jul 25', h: '70%' },
            ].map((bar, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-[12%] relative group z-10">
                <div className={`w-full bg-slate-200 rounded-t transition-colors group-hover:bg-slate-300`} style={{ height: bar.h }}></div>
                <span className="text-[11px] font-semibold text-slate-400 absolute -bottom-7 whitespace-nowrap">{bar.label}</span>
              </div>
            ))}
            
            {/* Active Bar */}
            <div className="flex flex-col items-center gap-2 w-[12%] relative z-10">
              <div className="bar-tooltip absolute -top-12 bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap pointer-events-none z-20 shadow-lg">
                <div className="text-[10px] font-medium text-slate-400 mb-0.5 tracking-wide uppercase">Aug 2025</div>
                ₹24,85,320
              </div>
              <div className="w-full bg-emerald-500 rounded-t transition-colors hover:bg-emerald-600 h-[82%] shadow-sm"></div>
              <span className="text-[11px] font-bold text-slate-900 absolute -bottom-7 whitespace-nowrap">Aug 25</span>
            </div>
          </div>
          
          <div className="flex justify-center items-center gap-2 mt-12 text-xs font-semibold text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></span> Revenue (₹)
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white border border-slate-200/75 rounded-lg p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 m-0 tracking-tight">Top Categories by Revenue</h3>
            <div className="relative">
              <select className="appearance-none pl-3 pr-8 py-1.5 border border-slate-200 rounded-md bg-white text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50 cursor-pointer focus:ring-2 focus:ring-slate-100 transition-colors">
                <option>This Month</option>
              </select>
              <ChevronDown size={14} className="text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex flex-col gap-5 mt-2 flex-1">
            {[
              { name: 'Fruits & Vegetables', val: '₹6,45,210', pct: '100%', icon: Apple, color: 'text-orange-500', bg: 'bg-orange-50' },
              { name: 'Dairy & Bakery', val: '₹4,82,110', pct: '80%', icon: Milk, color: 'text-blue-500', bg: 'bg-blue-50' },
              { name: 'Groceries & Staples', val: '₹4,25,340', pct: '65%', icon: PackageSearch, color: 'text-indigo-500', bg: 'bg-indigo-50' },
              { name: 'Beverages', val: '₹2,65,880', pct: '45%', icon: CupSoda, color: 'text-purple-500', bg: 'bg-purple-50' },
              { name: 'Snacks & Branded Foods', val: '₹2,10,780', pct: '35%', icon: Cookie, color: 'text-teal-500', bg: 'bg-teal-50' },
            ].map((cat, i) => (
              <div key={i} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-3.5 w-[35%]">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cat.bg} ${cat.color}`}>
                    <cat.icon size={16} strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{cat.name}</span>
                </div>
                <div className="flex-1 flex items-center gap-4 ml-4">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-800 rounded-full transition-all duration-500" style={{ width: cat.pct }}></div>
                  </div>
                  <span className="text-sm font-bold text-slate-600 w-[75px] text-right">{cat.val}</span>
                </div>
              </div>
            ))}
          </div>
          
          <a href="#" className="flex items-center justify-center gap-1.5 mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-slate-500 no-underline hover:text-slate-900 transition-colors">
            View full category report <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Row 4: Small Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Top Vendors */}
        <div className="bg-white border border-slate-200/75 rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-sm font-bold text-slate-900 m-0 uppercase tracking-wider">Top Vendors</h3>
            <a href="#" className="text-xs font-bold text-slate-400 no-underline hover:text-slate-900 transition-colors">View All</a>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { name: 'Fresh Mart', val: '₹3,45,210', icon: Store, color: 'text-blue-600', bg: 'bg-blue-50' },
              { name: 'Green Basket', val: '₹2,85,640', icon: Store, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { name: 'Daily Needs', val: '₹2,15,320', icon: Store, color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bg} ${item.color}`}>
                    <item.icon size={14} strokeWidth={2.5}/>
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{item.name}</span>
                </div>
                <div className="text-sm font-semibold text-slate-500">{item.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Areas */}
        <div className="bg-white border border-slate-200/75 rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-sm font-bold text-slate-900 m-0 uppercase tracking-wider">Top Areas (Orders)</h3>
            <a href="#" className="text-xs font-bold text-slate-400 no-underline hover:text-slate-900 transition-colors">View All</a>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { name: 'Koramangala', val: '1,245' },
              { name: 'HSR Layout', val: '987' },
              { name: 'Indiranagar', val: '856' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600 transition-colors">
                    <MapPin size={14} strokeWidth={2.5}/>
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{item.name}</span>
                </div>
                <div className="text-sm font-semibold text-slate-500">{item.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Payment Methods */}
        <div className="bg-white border border-slate-200/75 rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-sm font-bold text-slate-900 m-0 uppercase tracking-wider">Payment Methods</h3>
            <a href="#" className="text-xs font-bold text-slate-400 no-underline hover:text-slate-900 transition-colors">View All</a>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { name: 'UPI', val: '62.4%', icon: Smartphone },
              { name: 'COD', val: '28.7%', icon: Banknote },
              { name: 'Wallet', val: '8.9%', icon: CreditCard },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600 transition-colors">
                    <item.icon size={14} strokeWidth={2.5}/>
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{item.name}</span>
                </div>
                <div className="text-sm font-semibold text-slate-500">{item.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* New Customers */}
        <div className="bg-emerald-900 border border-emerald-800 rounded-lg p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800 rounded-bl-full opacity-50 pointer-events-none -mr-10 -mt-10"></div>
          
          <div className="flex justify-between items-center mb-2 z-10">
            <h3 className="text-sm font-bold text-emerald-100 m-0 uppercase tracking-wider">New Customers</h3>
            <a href="#" className="text-xs font-bold text-emerald-300/80 no-underline hover:text-white transition-colors">View All</a>
          </div>
          
          <div className="z-10 mt-2">
            <div className="text-4xl font-black text-white mb-2 tracking-tight">2,456</div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-200 mb-4">
              <span className="flex items-center text-emerald-950 bg-emerald-400 px-1.5 py-0.5 rounded border border-emerald-300 font-bold">
                <TrendingUp size={10} className="mr-1" strokeWidth={3}/> 18.3%
              </span> 
              <span className="opacity-80">vs last 30d</span>
            </div>
            
            {/* Embedded sparkline matching the aesthetic */}
            <div className="relative h-8 opacity-80">
               <svg preserveAspectRatio="none" className="w-full h-full">
                 <path d="M0,32 L20,24 L40,26 L60,13 L80,16 L100,6 L100,32 L0,32 Z" fill="rgba(52, 211, 153, 0.2)" />
                 <path d="M0,32 L20,24 L40,26 L60,13 L80,16 L100,6" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

