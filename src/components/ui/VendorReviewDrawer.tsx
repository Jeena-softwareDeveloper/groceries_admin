import { useState, useEffect } from 'react';
import { X, Check, FileText, Image as ImageIcon, MapPin, Building, CreditCard, AlertCircle, Save } from 'lucide-react';

export type DrawerMode = 'review' | 'view' | 'edit';

interface VendorReviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: any | null;
  mode: DrawerMode;
  onApprove?: (id: string, isRequest: boolean) => Promise<void>;
  onReject?: (id: string, isRequest: boolean, reason: string) => Promise<void>;
  onSave?: (id: string, data: any) => Promise<void>;
}

export function VendorReviewDrawer({ isOpen, onClose, vendor, mode, onApprove, onReject, onSave }: VendorReviewDrawerProps) {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (vendor && isOpen) {
      setFormData({
        shopName: vendor.shopName || '',
        shopCategory: vendor.shopCategory || '',
        ownerName: vendor.ownerName || '', // Note: not on Vendor table
        mobileNumber: vendor.mobileNumber || vendor.phone || '',
        email: vendor.email || '',
        description: vendor.description || '',
        address: vendor.address || '',
        deliveryRadius: vendor.deliveryRadius || '',
        gstNumber: vendor.gstNumber || '',
        fssaiNumber: vendor.fssaiNumber || '',
        bankName: vendor.bankName || '', // Note: not on Vendor table
        accountHolderName: vendor.accountHolderName || vendor.bankHolderName || '',
        accountNumber: vendor.accountNumber || vendor.bankAccountNo || '',
        ifscCode: vendor.ifscCode || vendor.bankIfsc || '',
        upiId: vendor.upiId || '' // Note: not on Vendor table
      });
      setRejectMode(false);
      setRejectReason('');
    }
  }, [vendor, isOpen]);

  if (!isOpen || !vendor) return null;

  const isRequest = vendor.isRequest;

  const handleApprove = async () => {
    if (!onApprove) return;
    try {
      setLoading(true);
      await onApprove(vendor.id, isRequest);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim() || !onReject) return;
    try {
      setLoading(true);
      await onReject(vendor.id, isRequest, rejectReason);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async () => {
    if (!onSave) return;
    try {
      setLoading(true);
      await onSave(vendor.id, formData);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const DataRow = ({ label, value, field }: { label: string; value?: string | number | null, field?: string }) => (
    <div className="flex flex-col mb-3">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</span>
      {mode === 'edit' && field ? (
        <input 
          type="text" 
          value={formData[field]} 
          onChange={e => handleInputChange(field, e.target.value)}
          className="w-full bg-white border border-slate-200 rounded text-sm px-2 py-1.5 outline-none focus:border-emerald-500"
        />
      ) : (
        <span className="text-[14px] font-medium text-slate-800">{value || '-'}</span>
      )}
    </div>
  );

  const DocImage = ({ label, url }: { label: string; url?: string | null }) => (
    <div className="flex flex-col mb-4">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">{label}</span>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="block relative w-full h-32 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden group">
          <img src={url} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-xs font-semibold">View Full</span>
          </div>
        </a>
      ) : (
        <div className="w-full h-24 bg-slate-50 border border-slate-200 border-dashed rounded-lg flex flex-col items-center justify-center text-slate-400">
          <ImageIcon size={20} className="mb-1 opacity-50" />
          <span className="text-[11px]">Not provided</span>
        </div>
      )}
      {mode === 'edit' && (
        <div className="mt-2">
          <span className="text-[10px] text-slate-400 italic">Image upload in edit mode requires Cloudinary widget.</span>
        </div>
      )}
    </div>
  );
  
  const getHeaderTitle = () => {
    if (mode === 'edit') return 'Edit Vendor';
    if (mode === 'view') return 'Vendor Details';
    return 'Review Application';
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 z-[100] transition-opacity"
        onClick={onClose}
      />
      
      <div className={`fixed inset-y-0 right-0 w-[450px] bg-white shadow-2xl z-[110] flex flex-col transform transition-transform duration-300 ease-out translate-x-0`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0 bg-white">
          <div>
            <h3 className="m-0 text-lg font-bold text-slate-900 leading-tight">{getHeaderTitle()}</h3>
            <p className="m-0 text-xs text-slate-500 mt-1">
              {mode === 'edit' ? 'Update the details for this vendor' : mode === 'view' ? 'View the details for this active vendor' : 'Review vendor details before approval'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full cursor-pointer border-none transition-colors"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: 'thin' }}>
          
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <Building size={16} className="text-emerald-600" />
              <h4 className="m-0 text-sm font-bold text-slate-800">Shop Details</h4>
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <DataRow label="Shop Name" value={vendor.shopName} field="shopName" />
              <DataRow label="Category" value={vendor.shopCategory || '-'} field="shopCategory" />
              <DataRow label="Owner Name" value={vendor.ownerName || '-'} field="ownerName" />
              <DataRow label="Mobile Number" value={vendor.mobileNumber || vendor.phone} field="mobileNumber" />
              <DataRow label="Email Address" value={vendor.email || '-'} field="email" />
            </div>
            {mode === 'edit' ? (
              <div className="flex flex-col mb-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Description</span>
                <textarea 
                  value={formData.description} 
                  onChange={e => handleInputChange('description', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded text-sm px-2 py-1.5 outline-none focus:border-emerald-500 min-h-[60px]"
                />
              </div>
            ) : (
              <DataRow label="Description" value={vendor.description} />
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <MapPin size={16} className="text-emerald-600" />
              <h4 className="m-0 text-sm font-bold text-slate-800">Location</h4>
            </div>
            <DataRow label="Address" value={vendor.address} field="address" />
            <div className="grid grid-cols-2 gap-x-4">
              <DataRow label="Area" value={vendor.area?.name} />
              <DataRow label="District" value={vendor.area?.district?.name || vendor.district?.name} />
              <DataRow label="Delivery Radius" value={vendor.deliveryRadius ? `${vendor.deliveryRadius} km` : undefined} field="deliveryRadius" />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <FileText size={16} className="text-emerald-600" />
              <h4 className="m-0 text-sm font-bold text-slate-800">Legal & Documents</h4>
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <DataRow label="GST Number" value={vendor.gstNumber} field="gstNumber" />
              <DataRow label="FSSAI Number" value={vendor.fssaiNumber} field="fssaiNumber" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <DocImage label="Shop Logo" url={vendor.logoUrl} />
              <DocImage label="Shop Banner" url={vendor.bannerUrl} />
              <DocImage label="Owner Photo" url={vendor.ownerPhotoUrl} />
              <DocImage label="Govt ID / Aadhar" url={vendor.govtIdUrl} />
              <DocImage label="GST Certificate" url={vendor.gstCertUrl || vendor.gstDocUrl} />
              <DocImage label="FSSAI Certificate" url={vendor.fssaiCertUrl || vendor.fssaiDocUrl} />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <CreditCard size={16} className="text-emerald-600" />
              <h4 className="m-0 text-sm font-bold text-slate-800">Banking</h4>
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <DataRow label="Bank Name" value={vendor.bankName || '-'} field="bankName" />
              <DataRow label="Account Holder" value={vendor.accountHolderName || vendor.bankHolderName || '-'} field="accountHolderName" />
              <DataRow label="Account Number" value={vendor.accountNumber || vendor.bankAccountNo || '-'} field="accountNumber" />
              <DataRow label="IFSC Code" value={vendor.ifscCode || vendor.bankIfsc || '-'} field="ifscCode" />
              <DataRow label="UPI ID" value={vendor.upiId || '-'} field="upiId" />
            </div>
          </div>

        </div>

        {/* Sticky Footer Actions */}
        <div className="shrink-0 bg-white border-t border-slate-100 p-6 flex flex-col gap-3">
          
          {mode === 'review' && (
            rejectMode ? (
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <div className="flex items-center gap-2 mb-2 text-red-700">
                  <AlertCircle size={16} strokeWidth={2.5} />
                  <span className="font-bold text-sm">Reject Application</span>
                </div>
                <p className="text-xs text-red-600 mb-3 m-0 leading-relaxed">
                  Please provide a reason for rejecting this application. This will be visible to the vendor.
                </p>
                <textarea 
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Reason for rejection (e.g., Documents unclear, invalid GST)..."
                  className="w-full bg-white border border-red-200 rounded-lg p-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 min-h-[80px] resize-none mb-3"
                />
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setRejectMode(false)}
                    disabled={loading}
                    className="flex-1 h-10 bg-white border border-slate-200 text-slate-600 rounded-lg font-semibold text-[13px] hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleReject}
                    disabled={!rejectReason.trim() || loading}
                    className="flex-1 h-10 bg-red-600 text-white border border-transparent rounded-lg font-semibold text-[13px] hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Rejecting...' : 'Confirm Reject'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setRejectMode(true)}
                  className="flex-1 h-11 bg-red-50 border border-red-200 text-red-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100 hover:border-red-300 transition-colors cursor-pointer"
                >
                  <X size={18} strokeWidth={3} />
                  Reject
                </button>
                <button 
                  onClick={handleApprove}
                  disabled={loading}
                  className="flex-[2] h-11 bg-emerald-600 border border-transparent text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                >
                  {loading ? 'Processing...' : (
                    <>
                      <Check size={18} strokeWidth={3} />
                      Approve Vendor
                    </>
                  )}
                </button>
              </div>
            )
          )}
          
          {mode === 'edit' && (
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full h-11 bg-slate-900 border border-transparent text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-wait"
              >
                {loading ? 'Saving...' : (
                  <>
                    <Save size={18} strokeWidth={2.5} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
          
          {mode === 'view' && (
             <div className="flex items-center gap-3">
               <button 
                 onClick={onClose}
                 className="w-full h-11 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
               >
                 Close
               </button>
             </div>
          )}

        </div>
        
      </div>
    </>
  );
}
