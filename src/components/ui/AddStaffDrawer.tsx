import { useEffect, useState } from 'react';
import { X, Save, Loader2, UserPlus, Briefcase, Phone, Mail, MapPin, Tag, CheckCircle2 } from 'lucide-react';
import { districtApi, areaApi } from '../../api';
import type { Staff, CreateStaffInput, UpdateStaffInput } from '../../types/staff.types';
import { toast } from 'sonner';

interface AddStaffDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateStaffInput | UpdateStaffInput, id?: string) => Promise<any>;
  staffToEdit?: Staff | null;
}

export function AddStaffDrawer({ isOpen, onClose, onSave, staffToEdit }: AddStaffDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [districts, setDistricts] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    code: '',
    designation: 'Field Marketing Executive',
    districtId: '',
    areaId: '',
    isActive: true,
  });

  useEffect(() => {
    if (isOpen) {
      if (staffToEdit) {
        setFormData({
          name: staffToEdit.name || '',
          phone: staffToEdit.phone || '',
          email: staffToEdit.email || '',
          code: staffToEdit.code || '',
          designation: staffToEdit.designation || 'Field Marketing Executive',
          districtId: staffToEdit.districtId || staffToEdit.district?.id || '',
          areaId: staffToEdit.areaId || staffToEdit.area?.id || '',
          isActive: staffToEdit.isActive ?? true,
        });
      } else {
        setFormData({
          name: '',
          phone: '',
          email: '',
          code: '',
          designation: 'Field Marketing Executive',
          districtId: '',
          areaId: '',
          isActive: true,
        });
      }

      districtApi.getAll().then(res => setDistricts(res.data || [])).catch(console.error);
      areaApi.getAll().then(res => setAreas(res.data || [])).catch(console.error);
    }
  }, [isOpen, staffToEdit]);

  if (!isOpen) return null;

  const filteredAreas = areas.filter(a => a.districtId === formData.districtId);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Staff name is required');
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      toast.error('Enter a valid 10-digit Indian mobile number');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        phone: cleanPhone,
        code: formData.code.trim() ? formData.code.trim().toUpperCase() : undefined,
        email: formData.email.trim() || undefined,
        districtId: formData.districtId || undefined,
        areaId: formData.areaId || undefined,
      };

      await onSave(payload, staffToEdit?.id);
      onClose();
    } catch (e: any) {
      console.error(e);
      const msg = e?.response?.data?.error?.message || e?.message || 'Failed to save staff details';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

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
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <UserPlus size={20} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 m-0">
                {staffToEdit ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h3>
              <p className="text-xs text-slate-400 m-0">
                {staffToEdit ? 'Update marketing staff details' : 'Register a field marketing executive & generate referral code'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4" style={{ scrollbarWidth: 'thin' }}>
          
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g. Kumaravel S"
              className="text-[13px] text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500 focus:bg-white transition-all w-full"
            />
          </div>

          {/* Mobile Number */}
          <div className="flex flex-col">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Mobile Number (10 Digits) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-semibold text-slate-400">+91</span>
              <input 
                type="tel"
                required
                maxLength={10}
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                className="text-[13px] text-slate-800 font-mono font-medium bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 outline-none focus:border-emerald-500 focus:bg-white transition-all w-full"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Email Address (Optional)
            </label>
            <input 
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="kumar@districtmart.com"
              className="text-[13px] text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500 focus:bg-white transition-all w-full"
            />
          </div>

          {/* Staff Code */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Staff Referral Code
              </label>
              <span className="text-[10px] text-emerald-600 font-medium">Auto-generated if blank</span>
            </div>
            <input 
              type="text"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
              placeholder="e.g. STF-001 (Optional)"
              className="text-[13px] text-slate-800 font-mono uppercase font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500 focus:bg-white transition-all w-full"
            />
          </div>

          {/* Designation */}
          <div className="flex flex-col">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Designation / Role
            </label>
            <input 
              type="text"
              value={formData.designation}
              onChange={(e) => handleInputChange('designation', e.target.value)}
              placeholder="e.g. Field Marketing Executive"
              className="text-[13px] text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500 focus:bg-white transition-all w-full"
            />
            {/* Quick role suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {['Field Executive', 'Area Manager', 'Sales Representative', 'Agency Partner'].map(r => (
                <button
                  type="button"
                  key={r}
                  onClick={() => handleInputChange('designation', r)}
                  className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md transition-colors"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Location Assignment */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-600" />
              Assigned Operational Area
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                  District
                </span>
                <select
                  value={formData.districtId}
                  onChange={(e) => {
                    handleInputChange('districtId', e.target.value);
                    handleInputChange('areaId', '');
                  }}
                  className="text-[13px] text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 focus:bg-white transition-all w-full"
                >
                  <option value="">All / Platform-wide</option>
                  {districts.map((d: any) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                  Area
                </span>
                <select
                  value={formData.areaId}
                  onChange={(e) => handleInputChange('areaId', e.target.value)}
                  disabled={!formData.districtId}
                  className="text-[13px] text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 focus:bg-white transition-all w-full disabled:opacity-50"
                >
                  <option value="">All Areas</option>
                  {filteredAreas.map((a: any) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active status toggle (edit mode) */}
          {staffToEdit && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800">Account Status</span>
                <p className="text-[11px] text-slate-400 m-0">Enable or disable staff referral activity</p>
              </div>
              <button
                type="button"
                onClick={() => handleInputChange('isActive', !formData.isActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.isActive ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    formData.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}

        </form>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={loading || !formData.name || !formData.phone}
            className="h-10 px-6 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {staffToEdit ? 'Save Changes' : 'Register Staff'}
          </button>
        </div>

      </div>
    </>
  );
}
