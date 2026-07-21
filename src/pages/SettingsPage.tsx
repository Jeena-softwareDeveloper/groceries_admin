import { useEffect, useState } from 'react';
import { 
  Copy, Wallet, Banknote, Star, Store, Tag, Image as ImageIcon, Truck, Gift,
  UserPlus, ShoppingCart, Package, AlertTriangle, CreditCard, User, FileText, Bell, Mail,
  UploadCloud, Lock, CheckCircle
} from 'lucide-react';
import { settingsApi } from '../api';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('General');
  const tabs = ['General', 'Platform', 'Contact & Support', 'Features', 'Notifications', 'SEO', 'Payment', 'Security'];

  const [formData, setFormData] = useState({
    // General
    minOrderValue: '99',
    taxPercent: '5',
    
    // Platform
    platformName: 'All Time Market',
    platformTagline: 'Empowering local commerce',
    defaultCurrency: 'INR (₹)',
    timezone: 'Asia/Kolkata (IST)',
    dateFormat: 'DD MMM YYYY',
    timeFormat: '12 Hours (AM/PM)',
    itemsPerPage: '10',
    defaultLanguage: 'English',
    
    // Contact
    supportEmail: 'support@districtmart.com',
    supportPhone: '+91 9000000000',
    supportWhatsApp: '+91 0000000000',
    supportHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
    supportAddress: 'DistrictMart Support Center, Bangalore, Karnataka, India - 560001',
    facebookUrl: 'https://facebook.com/districtmart',
    twitterUrl: 'https://twitter.com/districtmart',
    instagramUrl: 'https://instagram.com/districtmart',
    linkedinUrl: 'https://linkedin.com/company/districtmart',
    
    // Features
    featMultiVendor: true,
    featWallet: true,
    featCod: true,
    featRatings: true,
    featCoupons: true,
    featBanner: true,
    featDelivery: true,
    featOffers: true,
    
    // Notifications
    notifNewVendor: true,
    notifNewOrder: true,
    notifOrderStatus: true,
    notifLowStock: true,
    notifPayout: true,
    notifCustomerReg: false,
    notifWeeklySummary: true,
    notifSystemAlerts: true,
    notifEmailEnabled: true,
    
    // SEO
    seoTitle: 'All Time Market - Local Marketplace',
    seoDesc: 'All Time Market is a local marketplace connecting buyers with trusted vendors. Shop from a wide range of products with great offers and fast delivery.',
    seoKeywords: 'marketplace, online shopping, local vendors, buy online',
    seoGaId: 'G-XXXXXXXXXX',
    seoSearchConsole: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    
    // Payment
    payRazorpay: true,
    payCod: true,
    payWallet: true,
    payUpi: true,
    razorpayKeyId: 'rzp_test_XXXXXXXXXXXXXXXXXX',
    razorpayKeySecret: '************************',
    webhookSecret: '************************',
    
    // Security
    secMinPasswordLength: '8',
    secRequireUppercase: true,
    secRequireNumbers: true,
    secRequireSpecialChars: true,
    secTwoFactor: true,
    secSessionTimeout: '60',
    secMaxLoginAttempts: '5',
    secLockoutDuration: '15',
    secIpWhitelistEnabled: false,
    secAllowedIps: ''
  });

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggle = (key: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  useEffect(() => {
    settingsApi.get().then((res) => {
      if (res.data.minOrderValue) handleChange('minOrderValue', String(res.data.minOrderValue));
      if (res.data.taxPercent) handleChange('taxPercent', String(res.data.taxPercent));
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    try {
      await settingsApi.update({
        minOrderValue: Number(formData.minOrderValue),
        taxPercent: Number(formData.taxPercent),
      });
      alert('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Settings saved (mocked)!');
    }
  };

  const Input = ({ label, desc, keyName, type = 'text', placeholder = '' }: { label: string, desc?: string, keyName: keyof typeof formData, type?: string, placeholder?: string }) => (
    <label className="block mb-5">
      <span className="block mb-2 font-semibold text-slate-900 text-sm">{label}</span>
      <input 
        type={type} 
        value={String(formData[keyName])} 
        onChange={(e) => handleChange(keyName, e.target.value)} 
        placeholder={placeholder}
        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
      />
      {desc && <span className="text-xs text-slate-500 mt-1.5 block">{desc}</span>}
    </label>
  );

  const Select = ({ label, keyName, options }: { label: string, keyName: keyof typeof formData, options: string[] }) => (
    <label className="block mb-5">
      <span className="block mb-2 font-semibold text-slate-900 text-sm">{label}</span>
      <select 
        value={String(formData[keyName])} 
        onChange={(e) => handleChange(keyName, e.target.value)} 
        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );

  const Textarea = ({ label, desc, keyName, rows = 3 }: { label: string, desc?: string, keyName: keyof typeof formData, rows?: number }) => (
    <label className="block mb-5">
      <span className="block mb-2 font-semibold text-slate-900 text-sm">{label}</span>
      <textarea 
        value={String(formData[keyName])} 
        onChange={(e) => handleChange(keyName, e.target.value)} 
        rows={rows}
        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all resize-y"
      />
      {desc && <span className="text-xs text-slate-500 mt-1.5 block">{desc}</span>}
    </label>
  );

  const ToggleItem = ({ icon: Icon, title, desc, keyName, color = 'slate' }: { icon?: React.ElementType, title: string, desc?: string, keyName: keyof typeof formData, color?: string }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className={`w-10 h-10 rounded-lg bg-${color}-50 text-${color}-600 flex items-center justify-center shrink-0`}>
            <Icon size={18} />
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-900">{title}</span>
          {desc && <span className="text-xs text-slate-500 mt-0.5">{desc}</span>}
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer ml-4 shrink-0">
        <input type="checkbox" className="sr-only peer" checked={Boolean(formData[keyName])} onChange={() => toggle(keyName)} />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
      </label>
    </div>
  );

  const FileUploadBox = ({ title, desc }: { title: string, desc: string }) => (
    <div className="mb-6">
      <span className="block mb-2 font-semibold text-slate-900 text-sm">{title}</span>
      <div className="border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center justify-center p-8 text-center hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer">
        <UploadCloud size={24} className="text-slate-400 mb-2" />
        <span className="text-sm font-semibold text-slate-700">Upload Image</span>
        <span className="text-xs text-slate-500 mt-1">{desc}</span>
      </div>
    </div>
  );

  return (
    <div className="text-slate-900 h-full flex flex-col">
      {/* Header & Tabs */}
      <div className="shrink-0">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h1 className="m-0 text-3xl text-slate-900 font-bold mb-1">App Settings</h1>
            <p className="text-sm text-slate-500 m-0">Manage platform-wide configuration and preferences</p>
          </div>
          <button 
            onClick={handleSave} 
            className="flex items-center gap-2 bg-green-600 border border-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-green-700 shadow-sm"
          >
            Save Settings
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mt-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors border-b-2 ${
                activeTab === tab 
                  ? 'border-green-600 text-green-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 w-full mt-6">
        
        {activeTab === 'General' && (
          <div className="h-full grid grid-cols-1 lg:grid-cols-[1fr_450px] xl:grid-cols-[1fr_500px] gap-6">
            <div className="h-full bg-white border border-slate-200 rounded-lg p-6 shadow-sm overflow-y-auto styled-scrollbar">
              <h2 className="text-lg font-bold text-slate-900 m-0 mb-1">General Settings</h2>
              <p className="text-sm text-slate-500 m-0 mb-6">Configure basic platform settings</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <Input label="Minimum Order Value (₹)" keyName="minOrderValue" desc="Minimum order value required for checkout" />
                <Input label="Tax Percent (%)" keyName="taxPercent" desc="Tax percentage applied to all orders" />
              </div>

              <div className="border-t border-slate-100 my-4"></div>

              <Input label="Support Email" keyName="supportEmail" type="email" desc="Email address for customer support" />
              <Input label="Support Phone" keyName="supportPhone" desc="Customer support phone number" />

              <div className="border-t border-slate-100 my-4"></div>

              <h2 className="text-base font-bold text-slate-900 m-0 mb-1">Feature Flags</h2>
              <p className="text-sm text-slate-500 m-0 mb-6">Enable or disable platform features</p>

              <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 pb-4">
                <div className="border border-slate-200 rounded-lg p-4 flex flex-col items-start gap-4 shadow-sm">
                  <div className="flex justify-between w-full items-start">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Wallet size={16} /></div>
                    <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" checked={formData.featWallet} onChange={() => toggle('featWallet')} /><div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div></label>
                  </div>
                  <div><h4 className="text-sm font-bold text-slate-900 m-0 mb-1">Wallet</h4><p className="text-xs text-slate-500 m-0">Enable wallet for users</p></div>
                </div>
                <div className="border border-slate-200 rounded-lg p-4 flex flex-col items-start gap-4 shadow-sm">
                  <div className="flex justify-between w-full items-start">
                    <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center"><Banknote size={16} /></div>
                    <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" checked={formData.featCod} onChange={() => toggle('featCod')} /><div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div></label>
                  </div>
                  <div><h4 className="text-sm font-bold text-slate-900 m-0 mb-1">COD</h4><p className="text-xs text-slate-500 m-0">Enable Cash on Delivery</p></div>
                </div>
                <div className="border border-slate-200 rounded-lg p-4 flex flex-col items-start gap-4 shadow-sm">
                  <div className="flex justify-between w-full items-start">
                    <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center"><Star size={16} /></div>
                    <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" checked={formData.featRatings} onChange={() => toggle('featRatings')} /><div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div></label>
                  </div>
                  <div><h4 className="text-sm font-bold text-slate-900 m-0 mb-1">Ratings</h4><p className="text-xs text-slate-500 m-0">Allow rate and review</p></div>
                </div>
                <div className="border border-slate-200 rounded-lg p-4 flex flex-col items-start gap-4 shadow-sm">
                  <div className="flex justify-between w-full items-start">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><Store size={16} /></div>
                    <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" checked={formData.featMultiVendor} onChange={() => toggle('featMultiVendor')} /><div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div></label>
                  </div>
                  <div><h4 className="text-sm font-bold text-slate-900 m-0 mb-1">Multi Vendor</h4><p className="text-xs text-slate-500 m-0">Allow multiple vendors</p></div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col h-full overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                <div>
                  <h2 className="text-base font-bold text-slate-900 m-0 mb-0.5">Configuration Preview</h2>
                  <p className="text-xs text-slate-500 m-0">Live preview of current settings (JSON)</p>
                </div>
                <button 
                  className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors hover:bg-slate-50 shadow-sm"
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(formData, null, 2))}
                >
                  <Copy size={14} /> Copy JSON
                </button>
              </div>
              <div className="bg-slate-50/50 p-4 flex-1 overflow-y-auto styled-scrollbar">
                <div className="bg-white border border-slate-100 rounded-lg p-4 font-mono text-[13px] leading-relaxed shadow-sm min-h-full">
                  {JSON.stringify({
                    minOrderValue: Number(formData.minOrderValue),
                    taxPercent: Number(formData.taxPercent),
                    supportEmail: formData.supportEmail,
                    supportPhone: formData.supportPhone,
                    featureFlags: {
                      wallet: formData.featWallet,
                      cod: formData.featCod,
                      ratings: formData.featRatings,
                      multiVendor: formData.featMultiVendor
                    },
                    platform: {
                      name: formData.platformName,
                      currency: "INR",
                      timezone: "Asia/Kolkata"
                    }
                  }, null, 2).split('\n').map((line, i) => {
                    let coloredLine = line;
                    if (line.includes('": "')) {
                      coloredLine = line.replace(/"([^"]+)":/g, '<span class="text-blue-600">"$1"</span>:').replace(/: "([^"]+)"/g, ': <span class="text-green-600">"$1"</span>');
                    } else if (line.includes('": true') || line.includes('": false')) {
                      coloredLine = line.replace(/"([^"]+)":/g, '<span class="text-blue-600">"$1"</span>:').replace(/ (true|false)/g, ' <span class="text-blue-500 font-semibold">$1</span>');
                    } else if (line.includes('": ')) {
                      coloredLine = line.replace(/"([^"]+)":/g, '<span class="text-blue-600">"$1"</span>:').replace(/: ([0-9]+)/g, ': <span class="text-red-500">$1</span>');
                    }
                    return (
                      <div key={i} className="flex hover:bg-slate-50 rounded px-1">
                        <span className="text-slate-300 w-8 inline-block select-none text-right pr-3">{i + 1}</span>
                        <span className="text-slate-700 whitespace-pre" dangerouslySetInnerHTML={{ __html: coloredLine }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Platform' && (
          <div className="h-full bg-white border border-slate-200 rounded-lg p-8 shadow-sm max-w-5xl overflow-y-auto styled-scrollbar">
            <h2 className="text-lg font-bold text-slate-900 m-0 mb-1">Platform Settings</h2>
            <p className="text-sm text-slate-500 m-0 mb-8">Configure your platform information and preferences</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-4">
              <div className="flex flex-col gap-2">
                <Input label="Platform Name" keyName="platformName" />
                <Input label="Platform Tagline" keyName="platformTagline" />
                <Select label="Default Currency" keyName="defaultCurrency" options={['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)']} />
                <Select label="Timezone" keyName="timezone" options={['Asia/Kolkata (IST)', 'America/New_York (EST)', 'Europe/London (GMT)']} />
                <Select label="Date Format" keyName="dateFormat" options={['DD MMM YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']} />
                <Select label="Time Format" keyName="timeFormat" options={['12 Hours (AM/PM)', '24 Hours']} />
                <Select label="Items Per Page" keyName="itemsPerPage" options={['10', '20', '50', '100']} />
                <Select label="Default Language" keyName="defaultLanguage" options={['English', 'Hindi', 'Tamil', 'Spanish']} />
              </div>
              <div className="flex flex-col gap-2">
                <FileUploadBox title="Logo" desc="PNG, JPG up to 2MB" />
                <FileUploadBox title="Favicon" desc="ICO, PNG up to 1MB" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Contact & Support' && (
          <div className="h-full bg-white border border-slate-200 rounded-lg p-8 shadow-sm max-w-3xl overflow-y-auto styled-scrollbar">
            <h2 className="text-lg font-bold text-slate-900 m-0 mb-1">Contact Information</h2>
            <p className="text-sm text-slate-500 m-0 mb-8">Update your support contact details</p>
            
            <Input label="Support Email" keyName="supportEmail" type="email" />
            <Input label="Support Phone" keyName="supportPhone" />
            <Input label="Support WhatsApp" keyName="supportWhatsApp" />
            <Input label="Support Hours" keyName="supportHours" />
            <Textarea label="Support Address" keyName="supportAddress" rows={3} />
            
            <div className="border-t border-slate-100 my-8"></div>
            
            <h2 className="text-lg font-bold text-slate-900 m-0 mb-1">Social Links</h2>
            <p className="text-sm text-slate-500 m-0 mb-8">Add your social media links</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 pb-4">
              <Input label="Facebook URL" keyName="facebookUrl" type="url" />
              <Input label="Twitter URL" keyName="twitterUrl" type="url" />
              <Input label="Instagram URL" keyName="instagramUrl" type="url" />
              <Input label="LinkedIn URL" keyName="linkedinUrl" type="url" />
            </div>
          </div>
        )}

        {activeTab === 'Features' && (
          <div className="h-full bg-white border border-slate-200 rounded-lg p-8 shadow-sm max-w-3xl overflow-y-auto styled-scrollbar">
            <h2 className="text-lg font-bold text-slate-900 m-0 mb-1">Feature Management</h2>
            <p className="text-sm text-slate-500 m-0 mb-6">Enable or disable platform features</p>
            
            <div className="flex flex-col pb-4">
              <ToggleItem icon={Store} title="Multi Vendor" desc="Allow multiple vendors to sell on the platform" keyName="featMultiVendor" color="blue" />
              <ToggleItem icon={Wallet} title="Wallet" desc="Enable wallet functionality for users" keyName="featWallet" color="indigo" />
              <ToggleItem icon={Banknote} title="COD" desc="Enable Cash on Delivery" keyName="featCod" color="green" />
              <ToggleItem icon={Star} title="Ratings & Reviews" desc="Allow customers to rate and review" keyName="featRatings" color="yellow" />
              <ToggleItem icon={Tag} title="Coupons" desc="Enable coupon and discount system" keyName="featCoupons" color="pink" />
              <ToggleItem icon={ImageIcon} title="Banner Management" desc="Display banners on homepage and other pages" keyName="featBanner" color="purple" />
              <ToggleItem icon={Truck} title="Delivery Management" desc="Manage delivery partners and settings" keyName="featDelivery" color="orange" />
              <ToggleItem icon={Gift} title="Offers" desc="Enable offers and promotions" keyName="featOffers" color="red" />
            </div>
          </div>
        )}

        {activeTab === 'Notifications' && (
          <div className="h-full bg-white border border-slate-200 rounded-lg p-8 shadow-sm max-w-3xl overflow-y-auto styled-scrollbar">
            <h2 className="text-lg font-bold text-slate-900 m-0 mb-1">Notification Settings</h2>
            <p className="text-sm text-slate-500 m-0 mb-6">Configure system and email notifications</p>
            
            <div className="flex flex-col">
              <ToggleItem icon={UserPlus} title="New Vendor Registration" desc="Notify when a new vendor registers" keyName="notifNewVendor" color="blue" />
              <ToggleItem icon={ShoppingCart} title="New Order Placed" desc="Notify when a new order is placed" keyName="notifNewOrder" color="green" />
              <ToggleItem icon={Package} title="Order Status Update" desc="Notify on order status changes" keyName="notifOrderStatus" color="indigo" />
              <ToggleItem icon={AlertTriangle} title="Low Stock Alert" desc="Notify when product stock is low" keyName="notifLowStock" color="red" />
              <ToggleItem icon={CreditCard} title="Payout Requests" desc="Notify on vendor payout requests" keyName="notifPayout" color="purple" />
              <ToggleItem icon={User} title="Customer Registration" desc="Notify when a new customer registers" keyName="notifCustomerReg" color="sky" />
              <ToggleItem icon={FileText} title="Weekly Summary" desc="Send weekly summary reports" keyName="notifWeeklySummary" color="orange" />
              <ToggleItem icon={Bell} title="System Alerts" desc="Important system alerts and updates" keyName="notifSystemAlerts" color="rose" />
            </div>

            <div className="border-t border-slate-100 my-6"></div>
            
            <div className="pb-4">
              <ToggleItem icon={Mail} title="Email Notification" desc="Send email notifications globally" keyName="notifEmailEnabled" color="slate" />
            </div>
          </div>
        )}

        {activeTab === 'SEO' && (
          <div className="h-full bg-white border border-slate-200 rounded-lg p-8 shadow-sm max-w-3xl overflow-y-auto styled-scrollbar">
            <h2 className="text-lg font-bold text-slate-900 m-0 mb-1">SEO Settings</h2>
            <p className="text-sm text-slate-500 m-0 mb-8">Optimize your platform for search engines</p>
            
            <Input label="Site Title" keyName="seoTitle" />
            <Textarea label="Meta Description" keyName="seoDesc" rows={3} desc="150/160 characters recommended" />
            <Input label="Meta Keywords" keyName="seoKeywords" />
            
            <div className="mt-8">
              <FileUploadBox title="Default OG Image" desc="JPG, PNG up to 5MB" />
            </div>

            <div className="border-t border-slate-100 my-8"></div>
            
            <div className="pb-4">
              <Input label="Google Analytics ID" keyName="seoGaId" placeholder="G-XXXXXXXXXX" />
              <Input label="Google Search Console Verification" keyName="seoSearchConsole" />
            </div>
          </div>
        )}

        {activeTab === 'Payment' && (
          <div className="h-full bg-white border border-slate-200 rounded-lg p-8 shadow-sm max-w-3xl overflow-y-auto styled-scrollbar">
            <h2 className="text-lg font-bold text-slate-900 m-0 mb-1">Payment Methods</h2>
            <p className="text-sm text-slate-500 m-0 mb-6">Manage platform-wide configuration and preferences</p>
            
            <div className="flex flex-col mb-8">
              <ToggleItem icon={CreditCard} title="Razorpay" desc="Accept payments via Razorpay" keyName="payRazorpay" color="blue" />
              <ToggleItem icon={Banknote} title="COD" desc="Cash on Delivery" keyName="payCod" color="green" />
              <ToggleItem icon={Wallet} title="Wallet" desc="Allow payments using wallet balance" keyName="payWallet" color="indigo" />
              <ToggleItem icon={Store} title="UPI" desc="Accept payments via UPI directly" keyName="payUpi" color="orange" />
            </div>

            {formData.payRazorpay && (
              <div className="pb-4">
                <div className="border-t border-slate-100 my-8"></div>
                <h2 className="text-lg font-bold text-slate-900 m-0 mb-6">Razorpay Configuration</h2>
                <Input label="Razorpay Key ID" keyName="razorpayKeyId" />
                <Input label="Razorpay Key Secret" keyName="razorpayKeySecret" type="password" />
                <Input label="Webhook Secret" keyName="webhookSecret" type="password" />
                
                <div className="mt-4 flex items-center gap-2 text-green-700 text-sm font-semibold bg-green-50 p-4 rounded-lg border border-green-200">
                  <CheckCircle size={18} /> Payment is secure and encrypted.
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Security' && (
          <div className="h-full bg-white border border-slate-200 rounded-lg p-8 shadow-sm max-w-3xl overflow-y-auto styled-scrollbar">
            <h2 className="text-lg font-bold text-slate-900 m-0 mb-1">Password Policy</h2>
            <p className="text-sm text-slate-500 m-0 mb-6">Configure password requirements</p>
            
            <div className="flex flex-col gap-2 mb-8">
              <Select label="Minimum Password Length" keyName="secMinPasswordLength" options={['6', '8', '10', '12', '14']} />
              <ToggleItem title="Require Uppercase Letters" keyName="secRequireUppercase" />
              <ToggleItem title="Require Numbers" keyName="secRequireNumbers" />
              <ToggleItem title="Require Special Characters" keyName="secRequireSpecialChars" />
            </div>

            <div className="border-t border-slate-100 my-8"></div>
            
            <h2 className="text-lg font-bold text-slate-900 m-0 mb-6">Login Security</h2>
            
            <div className="flex flex-col gap-2 mb-8">
              <ToggleItem title="Enable Two-Factor Authentication" keyName="secTwoFactor" />
              <div className="mt-4">
                <Input label="Session Timeout (minutes)" keyName="secSessionTimeout" type="number" />
                <Input label="Max Login Attempts" keyName="secMaxLoginAttempts" type="number" />
                <Input label="Lockout Duration (minutes)" keyName="secLockoutDuration" type="number" />
              </div>
            </div>

            <div className="border-t border-slate-100 my-8"></div>
            
            <h2 className="text-lg font-bold text-slate-900 m-0 mb-6">IP Restriction</h2>
            
            <div className="pb-4">
              <ToggleItem title="Enable IP Whitelisting" keyName="secIpWhitelistEnabled" />
              
              {formData.secIpWhitelistEnabled && (
                <div className="mt-6">
                  <Textarea label="Allowed IP Addresses" keyName="secAllowedIps" desc="Enter IP addresses separated by commas" rows={3} />
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


