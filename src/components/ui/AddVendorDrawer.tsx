import { useState, useEffect } from 'react';
import { X, Building, Loader2, Save } from 'lucide-react';
import { districtApi, areaApi } from '../../api';
import { toast } from 'sonner';

interface AddVendorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

interface DataRowProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}

function DataRow({ label, value, onChange, type = 'text', required = false }: DataRowProps) {
  return (
    <div className="flex flex-col mb-3">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="text-[13px] text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-slate-300 focus:bg-white transition-all w-full"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}

export function AddVendorDrawer({ isOpen, onClose, onSave }: AddVendorDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [districts, setDistricts] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    shopName: '',
    email: '',
    phone: '',
    address: '',
    districtId: '',
    areaId: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        shopName: '',
        email: '',
        phone: '',
        address: '',
        districtId: '',
        areaId: ''
      });
      districtApi.getAll().then(res => setDistricts(res.data || [])).catch(console.error);
      areaApi.getAll().then(res => setAreas(res.data || [])).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave(formData);
      onClose();
    } catch (e: any) {
      console.error(e);
      const msg = e?.response?.data?.error?.message || e?.message || 'Failed to create vendor';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredAreas = areas.filter(a => a.districtId === formData.districtId);

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100] transition-opacity" 
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] max-w-full bg-white shadow-2xl z-[101] flex flex-col border-l border-slate-100 transform transition-transform duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <Building size={20} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Add New Vendor</h2>
              <p className="text-xs text-slate-500 font-medium">Create a vendor profile manually</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Basic Details</h3>
            
            <DataRow 
              label="Shop Name" 
              value={formData.shopName} 
              onChange={(val) => handleInputChange('shopName', val)} 
              required 
            />
            <DataRow 
              label="Email Address" 
              value={formData.email} 
              onChange={(val) => handleInputChange('email', val)} 
              type="email" 
              required 
            />
            <DataRow 
              label="Phone Number" 
              value={formData.phone} 
              onChange={(val) => handleInputChange('phone', val)} 
              type="tel" 
              required 
            />
            <DataRow 
              label="Full Address" 
              value={formData.address} 
              onChange={(val) => handleInputChange('address', val)} 
              required 
            />
            
            <div className="flex flex-col mb-3">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                District <span className="text-red-500">*</span>
              </span>
              <select
                value={formData.districtId}
                onChange={(e) => {
                  handleInputChange('districtId', e.target.value);
                  handleInputChange('areaId', '');
                }}
                className="text-[13px] text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-slate-300 focus:bg-white transition-all w-full"
              >
                <option value="">Select District</option>
                {districts.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col mb-3">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                Area <span className="text-red-500">*</span>
              </span>
              <select
                value={formData.areaId}
                onChange={(e) => handleInputChange('areaId', e.target.value)}
                disabled={!formData.districtId}
                className="text-[13px] text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-slate-300 focus:bg-white transition-all w-full disabled:opacity-50"
              >
                <option value="">Select Area</option>
                {filteredAreas.map((a: any) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="h-10 px-4 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleSave}
            disabled={loading || !formData.shopName || !formData.email || !formData.phone || !formData.address || !formData.areaId || !formData.districtId}
            className="h-10 px-6 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Create Vendor
          </button>
        </div>
      </div>
    </>
  );
}
