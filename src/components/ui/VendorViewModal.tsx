import { X, Store, Phone, Mail, MapPin, Calendar, Percent, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import type { ReferredVendor } from '../../types/staff.types';
import { StatusBadge } from './StatusBadge';

interface VendorViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: ReferredVendor | null;
}

const statusColorMap = {
  APPROVED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  SUSPENDED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  REJECTED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export function VendorViewModal({ isOpen, onClose, vendor }: VendorViewModalProps) {
  if (!isOpen || !vendor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose} 
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-200 border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{vendor.shopName}</h3>
                <StatusBadge status={vendor.status} colorMap={statusColorMap} />
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Code: {vendor.code || 'N/A'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Contact Information
            </h4>
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block">Phone Number</span>
                <span className="text-sm font-semibold text-slate-800">{vendor.phone}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Email Address</span>
                <span className="text-sm font-semibold text-slate-800 truncate block">
                  {vendor.email || 'Not provided'}
                </span>
              </div>
            </div>
          </div>

          {/* Location & Address */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Location & Delivery
            </h4>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-slate-400 block">District</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {vendor.district?.name || 'Tamil Nadu'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Operational Area</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {vendor.area?.name || 'All Areas'}
                  </span>
                </div>
              </div>
              {vendor.address && (
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-xs text-slate-400 block">Store Address</span>
                  <span className="text-sm text-slate-700">{vendor.address}</span>
                </div>
              )}
              {vendor.deliveryRadius != null && (
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Delivery Coverage Radius:</span>
                  <span className="font-semibold text-slate-800">{vendor.deliveryRadius} km</span>
                </div>
              )}
            </div>
          </div>

          {/* Business & Legal Information */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Business & Compliance
            </h4>
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block">Commission Rate</span>
                <span className="text-sm font-semibold text-emerald-700">
                  {vendor.commissionRate != null ? `${vendor.commissionRate}%` : 'Standard'}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Customer Rating</span>
                <span className="text-sm font-semibold text-amber-600">
                  ★ {vendor.rating ? Number(vendor.rating).toFixed(1) : 'New'}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">FSSAI License</span>
                <span className="text-xs font-mono text-slate-700">
                  {vendor.fssaiNumber || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">GST Number</span>
                <span className="text-xs font-mono text-slate-700">
                  {vendor.gstNumber || 'Not provided'}
                </span>
              </div>
            </div>
          </div>

          {/* Referral & Onboarding Meta */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div>
                <span className="text-xs font-semibold text-emerald-900 block">Referred by this Staff</span>
                <span className="text-[11px] text-emerald-700">
                  Registered on {new Date(vendor.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-1 bg-white rounded-md text-emerald-800 border border-emerald-200 shadow-2xs">
              Verified
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
