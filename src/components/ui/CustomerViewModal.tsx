import { X, User, Phone, Mail, MapPin, ShoppingBag, Calendar, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { ReferredCustomer } from '../../types/staff.types';

interface CustomerViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: ReferredCustomer | null;
}

export function CustomerViewModal({ isOpen, onClose, customer }: CustomerViewModalProps) {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose} 
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-200 border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base shadow-xs">
              {customer.name?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{customer.name}</h3>
                {customer.isBlocked ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                    Blocked
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{customer.phone}</p>
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
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Customer Overview Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50/60 border border-blue-100 p-3.5 rounded-xl">
              <span className="text-xs text-blue-600 font-medium block">Total Orders</span>
              <span className="text-xl font-bold text-blue-900 mt-1 block">
                {customer.ordersCount || 0}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
              <span className="text-xs text-slate-500 font-medium block">Registered On</span>
              <span className="text-sm font-semibold text-slate-800 mt-1 block">
                {new Date(customer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Contact Information
            </h4>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 text-xs">Mobile:</span>
                <span className="font-semibold text-slate-800">{customer.phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 text-xs">Email:</span>
                <span className="font-semibold text-slate-800">{customer.email || 'Not provided'}</span>
              </div>
              {customer.currentLocation && (
                <div className="flex justify-between text-sm pt-1 border-t border-slate-200/60">
                  <span className="text-slate-400 text-xs">Current City / Locality:</span>
                  <span className="text-slate-700 font-medium">{customer.currentLocation}</span>
                </div>
              )}
            </div>
          </div>

          {/* Saved Delivery Addresses */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Saved Addresses ({customer.addresses?.length || 0})
            </h4>
            {customer.addresses && customer.addresses.length > 0 ? (
              <div className="space-y-2">
                {customer.addresses.map((addr) => (
                  <div key={addr.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
                      <span>{addr.label || addr.city}</span>
                      {addr.isDefault && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded">Default</span>
                      )}
                    </div>
                    <p className="text-slate-600">
                      {[addr.line1, addr.line2, addr.city, addr.pincode].filter(Boolean).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                No delivery addresses saved yet.
              </p>
            )}
          </div>

          {/* Staff Attribution */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3.5 flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="text-emerald-800">
              Acquired through staff referral campaign QR code / link.
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
