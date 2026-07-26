import React, { useState } from 'react';
import { X, Check, FileText, Image as ImageIcon, Info, DollarSign, Package, AlertCircle } from 'lucide-react';

interface ProductReviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  approval: any | null;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
  onRequestChanges: (id: string, notes: string) => Promise<void>;
}

export function ProductReviewDrawer({ isOpen, onClose, approval, onApprove, onReject, onRequestChanges }: ProductReviewDrawerProps) {
  const [actionMode, setActionMode] = useState<'REJECT' | 'REQUEST_CHANGES' | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !approval) return null;

  const product = approval.product;

  const handleAction = async () => {
    setLoading(true);
    try {
      if (actionMode === 'REJECT') {
        await onReject(approval.id, notes);
      } else if (actionMode === 'REQUEST_CHANGES') {
        await onRequestChanges(approval.id, notes);
      } else {
        await onApprove(approval.id);
      }
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setActionMode(null);
      setNotes('');
    }
  };

  const SectionTitle = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
      <Icon className="w-4 h-4 text-slate-400" />
      {title}
    </h3>
  );

  const DataRow = ({ label, value, col = false }: { label: string, value: React.ReactNode, col?: boolean }) => (
    <div className={`flex ${col ? 'flex-col gap-1.5' : 'items-start justify-between py-2 border-b border-slate-100 last:border-0'}`}>
      <span className="text-sm text-slate-500 font-medium">{label}</span>
      <span className={`text-sm font-semibold text-slate-900 ${col ? '' : 'text-right'}`}>{value || 'N/A'}</span>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 w-[500px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Review Product</h2>
            <p className="text-sm text-slate-500">Vendor: {product.vendor?.shopName || 'Unknown'}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <SectionTitle icon={ImageIcon} title="Product Images" />
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images && product.images.length > 0 ? (
                product.images.map((img: any, idx: number) => (
                  <img key={idx} src={img.url} alt={`Product ${idx}`} className="w-24 h-24 object-cover rounded-xl border border-slate-200 shadow-sm shrink-0" />
                ))
              ) : (
                <div className="w-24 h-24 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs font-medium">No Images</div>
              )}
            </div>
          </section>

          <section>
            <SectionTitle icon={Info} title="Basic Information" />
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <DataRow label="Product Name" value={product.name} />
              <DataRow label="Category" value={product.category?.name} />
              <DataRow label="Brand" value={product.brand} />
              <DataRow label="SKU" value={product.sku} />
              <DataRow label="Weight / Unit" value={`${product.weight || ''} ${product.unit || ''}`.trim()} />
            </div>
          </section>

          <section>
            <SectionTitle icon={DollarSign} title="Pricing Details" />
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <DataRow label="MRP" value={`₹${product.mrp || 0}`} />
              <DataRow label="Selling Price" value={`₹${product.sellingPrice || 0}`} />
              <DataRow label="Tax %" value={`${product.taxPct || 0}%`} />
            </div>
          </section>

          <section>
            <SectionTitle icon={Package} title="Inventory" />
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <DataRow label="Current Stock" value={product.inventory?.stock ?? 0} />
            </div>
          </section>

          <section>
            <SectionTitle icon={FileText} title="Description" />
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{product.description || 'No description provided.'}</p>
            </div>
          </section>
        </div>

        {approval.status === 'PENDING' && (
          <div className="p-6 border-t border-slate-100 bg-white">
            {actionMode ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <button onClick={() => setActionMode(null)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                  <h4 className="font-bold text-slate-800 text-sm">{actionMode === 'REJECT' ? 'Reject Product' : 'Request Changes'}</h4>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Reason / Notes</label>
                  <textarea
                    autoFocus
                    placeholder={`Reason for ${actionMode.toLowerCase().replace('_', ' ')}...`}
                    className="w-full h-24 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setActionMode(null);
                      setNotes('');
                    }}
                    className="flex-1 px-4 py-2 text-slate-700 font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAction}
                    disabled={loading || !notes.trim()}
                    className={`flex-1 px-4 py-2 text-white font-semibold rounded-lg ${actionMode === 'REJECT' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-50`}
                  >
                    {loading ? 'Processing...' : 'Confirm'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setActionMode('REJECT')}
                  className="flex-1 px-4 py-2.5 text-rose-700 font-bold bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
                  disabled={loading}
                >
                  Reject
                </button>
                <button
                  onClick={() => setActionMode('REQUEST_CHANGES')}
                  className="flex-1 px-4 py-2.5 text-blue-700 font-bold bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  disabled={loading}
                >
                  Changes
                </button>
                <button
                  onClick={handleAction}
                  className="flex-1 px-4 py-2.5 text-white font-bold bg-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Approving...' : 'Approve'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
