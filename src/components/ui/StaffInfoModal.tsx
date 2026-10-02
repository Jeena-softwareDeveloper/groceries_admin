import { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Store, 
  Smartphone, 
  Copy, 
  Check, 
  QrCode, 
  Edit2, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import type { Staff } from '../../types/staff.types';
import { StatusBadge } from './StatusBadge';
import { toast } from 'sonner';

interface StaffInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
  onOpenQr?: () => void;
  onOpenEdit?: () => void;
}

const staffStatusColorMap = {
  ACTIVE: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  INACTIVE: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-slate-200' },
};

export function StaffInfoModal({ isOpen, onClose, staff, onOpenQr, onOpenEdit }: StaffInfoModalProps) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  if (!isOpen || !staff) return null;

  const baseUrl = import.meta.env.VITE_WEB_APP_URL;
  const vendorLink = `${baseUrl}/become-vendor?ref=${staff.code}`;
  const appInstallLink = `${baseUrl}/app?ref=${staff.code}`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose} 
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-200 border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Staff Profile & Referral Links</h3>
              <p className="text-xs text-slate-500">ID: {staff.code}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Profile Overview Card */}
          <div className="bg-slate-50/70 p-4.5 rounded-2xl border border-slate-200/80 flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-emerald-400 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-primary-500/20 flex-shrink-0">
              {staff.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-lg font-bold text-slate-900 truncate">{staff.name}</h4>
                <StatusBadge 
                  status={staff.isActive ? 'ACTIVE' : 'INACTIVE'} 
                  colorMap={staffStatusColorMap} 
                />
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {staff.designation || 'Field Agent'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Registered on {new Date(staff.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Contact & Operational Area
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Mobile Number</span>
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {staff.phone}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Email Address</span>
                <span className="text-sm font-semibold text-slate-800 truncate block">
                  {staff.email || 'Not provided'}
                </span>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-slate-200/60">
                <span className="text-slate-400 block mb-0.5">Assigned Operational Area</span>
                <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {staff.area?.name || 'All Areas'}, {staff.district?.name || 'Tamil Nadu'}
                </span>
              </div>
            </div>
          </div>

          {/* Staff Referral Code Box */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-4 text-white flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                Staff Referral Code
              </span>
              <span className="font-mono text-xl font-extrabold tracking-wider text-white">
                {staff.code}
              </span>
            </div>
            <button
              onClick={() => handleCopy(staff.code, 'Referral code')}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {copiedLink === 'Referral code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLink === 'Referral code' ? 'Copied' : 'Copy Code'}
            </button>
          </div>

          {/* Shareable Campaign Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" /> Shareable Referral Links
            </h5>

            {/* Vendor Onboarding Link */}
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5" /> Vendor Onboarding Link
                </span>
                <p className="text-xs text-emerald-700/90 font-mono truncate mt-0.5">
                  {vendorLink}
                </p>
              </div>
              <button
                onClick={() => handleCopy(vendorLink, 'Vendor link')}
                className="px-3 py-1.5 bg-white border border-emerald-200 hover:bg-emerald-50 rounded-lg text-xs font-semibold text-emerald-800 transition-colors shadow-2xs flex-shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                {copiedLink === 'Vendor link' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedLink === 'Vendor link' ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Customer App Link */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" /> Customer App Referral Link
                </span>
                <p className="text-xs text-blue-700/90 font-mono truncate mt-0.5">
                  {appInstallLink}
                </p>
              </div>
              <button
                onClick={() => handleCopy(appInstallLink, 'App link')}
                className="px-3 py-1.5 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg text-xs font-semibold text-blue-800 transition-colors shadow-2xs flex-shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                {copiedLink === 'App link' ? <Check className="w-3 h-3 text-blue-600" /> : <Copy className="w-3 h-3" />}
                {copiedLink === 'App link' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onOpenQr && (
              <button
                onClick={() => {
                  onClose();
                  onOpenQr();
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <QrCode size={13} />
                <span>View QR Code</span>
              </button>
            )}
            {onOpenEdit && (
              <button
                onClick={() => {
                  onClose();
                  onOpenEdit();
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Edit2 size={13} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition-colors cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
