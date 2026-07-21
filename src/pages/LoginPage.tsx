import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBasket, Store, Package, BarChart3, ShieldCheck, Mail, Lock, Eye, EyeOff, AlertCircle, ShoppingBag, Leaf
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@districtmart.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginAdmin(email, password);
      navigate('/');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } }; message?: string })?.response
          ?.data?.error?.message ??
        (err as { message?: string })?.message ??
        'Invalid email or password';
      setError(msg.includes('Network') || msg.includes('404') ? 'Cannot reach API — use http://127.0.0.1:3000' : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-slate-50">
      {/* Left Branding Panel */}
      <div className="flex-1 bg-green-600 text-white flex flex-col justify-center p-10 md:p-16 relative overflow-hidden">
        <div className="relative z-10 max-w-[480px] mx-auto w-full flex flex-col md:items-start items-center md:text-left text-center">
          <div className="inline-flex w-20 h-20 mb-5 items-center justify-center">
            <img src="/logo.png" alt="All Time Market" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl font-bold m-0 mb-2">All Time Market</h1>
          <p className="text-lg font-medium m-0 mb-8 opacity-90">Fresh Groceries, Fast Delivery</p>
          
          <div className="h-px bg-white/20 w-full mb-8"></div>
          
          <h2 className="text-2xl font-bold m-0 mb-3">Super Admin Panel</h2>
          <p className="text-base leading-relaxed opacity-90 m-0 mb-10">Manage vendors, products, orders and customers across all districts.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-full flex items-center justify-center shrink-0">
                <Store size={20} color="#ffffff" />
              </div>
              <div className="flex flex-col">
                <h4 className="m-0 mb-1 text-sm font-semibold">Vendor Management</h4>
                <p className="m-0 text-xs opacity-80">Approve & manage vendors</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-full flex items-center justify-center shrink-0">
                <Package size={20} color="#ffffff" />
              </div>
              <div className="flex flex-col">
                <h4 className="m-0 mb-1 text-sm font-semibold">Product Control</h4>
                <p className="m-0 text-xs opacity-80">Manage all products</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-full flex items-center justify-center shrink-0">
                <BarChart3 size={20} color="#ffffff" />
              </div>
              <div className="flex flex-col">
                <h4 className="m-0 mb-1 text-sm font-semibold">Analytics & Reports</h4>
                <p className="m-0 text-xs opacity-80">Real-time insights</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck size={20} color="#ffffff" />
              </div>
              <div className="flex flex-col">
                <h4 className="m-0 mb-1 text-sm font-semibold">Secure & Reliable</h4>
                <p className="m-0 text-xs opacity-80">100% secure platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="flex-1 flex items-center justify-center p-10 bg-white">
        <div className="w-full max-w-[440px]">
          <div className="inline-flex items-center gap-1.5 text-green-600 border border-green-200 bg-green-50 px-3 py-1.5 rounded-full text-xs font-bold uppercase mb-6">
            <ShieldCheck size={16} />
            SUPER ADMIN
          </div>
          
          <h1 className="text-4xl font-extrabold text-slate-900 m-0 mb-2">Welcome <span className="text-green-600">Back!</span></h1>
          <p className="text-slate-500 text-base m-0 mb-6">Sign in to access the admin dashboard</p>

          <div className="flex items-center gap-3 bg-green-50 border border-green-200 p-4 rounded-lg text-green-800 text-sm font-medium mb-8">
            <ShieldCheck size={20} />
            Secure login for authorized personnel only.
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-6">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-900 mb-2">Email Address</label>
              <div className="relative flex items-center">
                <Mail size={18} className="absolute left-3 text-slate-400" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="admin@districtmart.com"
                  className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg text-base outline-none transition-all focus:border-green-600 focus:ring-[3px] focus:ring-green-600/10"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-900 mb-2">Password</label>
              <div className="relative flex items-center">
                <Lock size={18} className="absolute left-3 text-slate-400" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg text-base outline-none transition-all focus:border-green-600 focus:ring-[3px] focus:ring-green-600/10"
                />
                <button 
                  type="button" 
                  className="absolute right-3 bg-transparent border-none p-0 cursor-pointer text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-green-600 cursor-pointer" />
                Remember me
              </label>
              <a href="#" className="text-blue-700 text-sm font-medium no-underline hover:underline">Forgot Password?</a>
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-green-600 text-white border-none py-3.5 rounded-lg text-base font-semibold cursor-pointer hover:bg-green-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
              <Lock size={18} />
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-sm">
            <ShieldCheck size={16} className="text-green-600" />
            Protected by <span className="text-green-600 font-semibold">advanced security</span>
          </div>
        </div>
      </div>
    </div>
  );
}

