import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { PageHeader, DataTable, ColumnDef, Modal } from '../components/ui';
import { ArrowLeft } from 'lucide-react';

interface ProductApproval {
  id: string;
  productId: string;
  vendorId: string;
  status: string;
  rejectionReason: string | null;
  adminNotes: string | null;
  createdAt: string;
  product: {
    name: string;
    sellingPrice: number | string;
    inventory?: { stock: number } | null;
    category?: { name: string } | null;
    images?: { url: string }[];
    vendor?: { shopName: string; email?: string; phone?: string; status?: string; rating?: number } | null;
  };
}

export default function ProductApprovalsPage() {
  const [approvals, setApprovals] = useState<ProductApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('PENDING');

  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

  const [modalApproval, setModalApproval] = useState<ProductApproval | null>(null);
  const [actionType, setActionType] = useState<'REJECT' | 'REQUEST_CHANGES' | null>(null);
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [viewProduct, setViewProduct] = useState<ProductApproval | null>(null);
  const [confirmApproveId, setConfirmApproveId] = useState<string | null>(null);

  const fetchApprovals = async (status: string) => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/product-approvals', { params: { status, limit: 100 } });
      setApprovals(data.data ?? []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to fetch approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals(activeTab);
    setSelectedVendorId(null);
  }, [activeTab]);

  const handleApprove = async () => {
    if (!confirmApproveId) return;
    setActionLoading(true);
    try {
      await api.post(`/admin/product-approvals/${confirmApproveId}/approve`);
      setApprovals(prev => prev.map(a => a.id === confirmApproveId ? { ...a, status: 'APPROVED' } : a));
      setConfirmApproveId(null);
    } catch (e: any) {
      alert(e.response?.data?.error?.message || 'Error approving product');
    } finally {
      setActionLoading(false);
    }
  };

  const submitAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalApproval || !actionType) return;
    if (!notes.trim()) return alert('Notes/Reason is required');

    setActionLoading(true);
    try {
      if (actionType === 'REJECT') {
        await api.post(`/admin/product-approvals/${modalApproval.id}/reject`, { reason: notes });
        setApprovals(prev => prev.map(a => a.id === modalApproval.id ? { ...a, status: 'REJECTED', rejectionReason: notes } : a));
      } else {
        await api.post(`/admin/product-approvals/${modalApproval.id}/request-changes`, { notes });
        setApprovals(prev => prev.map(a => a.id === modalApproval.id ? { ...a, status: 'CHANGES_REQUESTED', adminNotes: notes } : a));
      }
      setModalApproval(null);
      setNotes('');
    } catch (e: any) {
      alert(e.response?.data?.error?.message || 'Error processing request');
    } finally {
      setActionLoading(false);
    }
  };

  const vendorsMap = new Map<string, { id: string, name: string, email: string, phone: string, rating: number, vendorStatus: string, count: number, products: ProductApproval[] }>();
  approvals.forEach(a => {
    if (!vendorsMap.has(a.vendorId)) {
      vendorsMap.set(a.vendorId, { 
        id: a.vendorId, 
        name: a.product.vendor?.shopName || 'Unknown Vendor', 
        email: a.product.vendor?.email || 'N/A',
        phone: a.product.vendor?.phone || 'N/A',
        rating: a.product.vendor?.rating ?? 0,
        vendorStatus: a.product.vendor?.status || 'UNKNOWN',
        count: 0, 
        products: [] 
      });
    }
    const v = vendorsMap.get(a.vendorId)!;
    v.count++;
    v.products.push(a);
  });
  const groupedVendors = Array.from(vendorsMap.values());
  const selectedVendorData = selectedVendorId ? vendorsMap.get(selectedVendorId) : null;

  const vendorColumns: ColumnDef<any>[] = [
    {
      key: 'name',
      header: 'Store Details',
      cell: (v) => (
        <div>
          <div className="font-bold text-slate-900">{v.name}</div>
          <div className="text-xs text-slate-400 mt-0.5 font-mono">ID: {v.id.slice(-8)}</div>
        </div>
      )
    },
    {
      key: 'contact',
      header: 'Contact',
      cell: (v) => (
        <div>
          <div className="font-semibold text-slate-700">{v.phone}</div>
          <div className="text-slate-500 text-sm">{v.email}</div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status / Rating',
      cell: (v) => (
        <div className="flex flex-col items-start gap-1.5">
          <span className="bg-slate-100 text-slate-700 py-1 px-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-200">
            {v.vendorStatus}
          </span>
          <div className="text-amber-500 text-xs font-bold flex items-center gap-1">
            <span className="text-sm">★</span> {Number(v.rating).toFixed(1)}
          </div>
        </div>
      )
    },
    {
      key: 'count',
      header: 'Items Count',
      cell: (v) => (
        <span className="inline-flex items-center justify-center h-7 px-3 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-bold">
          {v.count} products
        </span>
      )
    },
    {
      key: 'actions',
      header: '',
      cell: (v) => (
        <button 
          onClick={() => setSelectedVendorId(v.id)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 font-semibold text-sm"
        >
          View Products
        </button>
      ),
      cellClassName: 'text-right'
    }
  ];

  const productColumns: ColumnDef<any>[] = [
    {
      key: 'product',
      header: 'Product',
      cell: (item) => (
        <div className="flex items-center gap-3">
          {item.product.images?.[0]?.url ? (
            <img src={item.product.images[0].url} alt="" className="w-10 h-10 object-cover rounded-lg border border-slate-200 shadow-sm" />
          ) : (
            <div className="w-10 h-10 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-xs text-slate-400 font-medium">N/A</div>
          )}
          <strong className="text-slate-900 font-bold">{item.product.name}</strong>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      cell: (item) => <span className="text-slate-600 font-medium">{item.product.category?.name || 'Uncategorized'}</span>
    },
    {
      key: 'price',
      header: 'Price',
      cellClassName: 'font-bold text-slate-900',
      cell: (item) => `₹${item.product.sellingPrice}`
    },
    {
      key: 'stock',
      header: 'Stock',
      cellClassName: 'font-semibold text-slate-700',
      cell: (item) => item.product.inventory?.stock ?? 0
    },
    {
      key: 'status',
      header: 'Status',
      cell: (item) => (
        <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
          {item.status.replace('_', ' ')}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (item) => (
        <div className="flex items-center gap-2 justify-end">
          <button 
            className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors font-semibold border border-transparent hover:border-indigo-200 text-sm"
            onClick={() => setViewProduct(item)}
          >
            View
          </button>
          {item.status === 'PENDING' && (
            <>
              <button 
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors font-semibold border border-transparent hover:border-emerald-200 text-sm"
                onClick={() => setConfirmApproveId(item.id)}
              >
                Approve
              </button>
              <button 
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors font-semibold border border-transparent hover:border-rose-200 text-sm"
                onClick={() => { setModalApproval(item); setActionType('REJECT'); }}
              >
                Reject
              </button>
              <button 
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors font-semibold border border-transparent hover:border-blue-200 text-sm"
                onClick={() => { setModalApproval(item); setActionType('REQUEST_CHANGES'); }}
              >
                Changes
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={
          selectedVendorId ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedVendorId(null)}
                className="text-slate-400 hover:text-slate-900 transition-colors bg-white hover:bg-slate-50 p-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-center group"
                title="Back to Stores"
              >
                <ArrowLeft size={22} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
              Products for: {selectedVendorData?.name}
            </div>
          ) : "Product Approvals"
        } 
        description={selectedVendorId ? "Review products submitted by this vendor" : "Review products submitted by vendors"} 
        action={
          !selectedVendorId && (
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="border border-slate-200 rounded-lg px-4 py-2.5 bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
            >
              <option value="PENDING">Pending Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CHANGES_REQUESTED">Changes Requested</option>
            </select>
          )
        }
      />

      {loading ? (
        <div className="text-slate-500 font-medium p-8 flex items-center justify-center bg-white rounded-lg border border-slate-200">
          Loading approvals...
        </div>
      ) : error ? (
        <div className="text-rose-600 bg-rose-50 p-4 rounded-lg border border-rose-200">{error}</div>
      ) : approvals.length === 0 ? (
        <div className="text-slate-500 font-medium text-center py-16 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center gap-2 shadow-sm">
          <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200 mb-2">
            <span className="text-xl">📦</span>
          </div>
          No products found in this category.
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          {!selectedVendorId ? (
            <DataTable columns={vendorColumns} data={groupedVendors} />
          ) : (
            <DataTable columns={productColumns} data={selectedVendorData?.products || []} />
          )}
        </div>
      )}

      {/* Action Modal */}
      {modalApproval && actionType && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">
                {actionType === 'REJECT' ? 'Reject Product' : 'Request Changes'}
              </h2>
            </div>
            <form onSubmit={submitAction} className="p-6">
              <div className="mb-5 bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-center gap-3">
                {modalApproval.product.images?.[0]?.url && (
                  <img src={modalApproval.product.images[0].url} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                )}
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Product</div>
                  <div className="font-bold text-slate-900">{modalApproval.product.name}</div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {actionType === 'REJECT' ? 'Rejection Reason *' : 'Changes Required *'}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  required
                  rows={4}
                  className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 focus:bg-white transition-colors"
                  placeholder="Enter notes to send to the vendor..."
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  className="px-5 py-2.5 font-semibold border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors" 
                  onClick={() => { setModalApproval(null); setNotes(''); }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm shadow-indigo-200" 
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Product Details</h2>
              <button onClick={() => setViewProduct(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>
            <div className="p-6">
              <div className="flex gap-4">
                {viewProduct.product.images?.[0]?.url ? (
                  <img src={viewProduct.product.images[0].url} alt="" className="w-24 h-24 object-cover rounded-lg border border-slate-200 shadow-sm" />
                ) : (
                  <div className="w-24 h-24 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-sm text-slate-400 font-medium">No Image</div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900 leading-tight">{viewProduct.product.name}</h3>
                  <div className="text-sm font-semibold text-slate-500 mt-1">{viewProduct.product.category?.name || 'Uncategorized'}</div>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-sm font-bold border border-emerald-100">
                      ₹{viewProduct.product.sellingPrice}
                    </div>
                    <div className="text-sm font-semibold text-slate-600 border border-slate-200 px-3 py-1 rounded-lg">
                      Stock: {viewProduct.product.inventory?.stock ?? 0}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-slate-400 font-bold tracking-wider uppercase text-xs mb-1">Status</span>
                    <span className="font-semibold text-slate-700">{viewProduct.status.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold tracking-wider uppercase text-xs mb-1">Vendor</span>
                    <span className="font-semibold text-slate-700">{viewProduct.product.vendor?.shopName || 'Unknown'}</span>
                  </div>
                  {viewProduct.rejectionReason && (
                    <div className="col-span-2">
                      <span className="block text-slate-400 font-bold tracking-wider uppercase text-xs mb-1">Rejection Reason</span>
                      <p className="text-slate-700 bg-rose-50 p-3 rounded-lg border border-rose-100">{viewProduct.rejectionReason}</p>
                    </div>
                  )}
                  {viewProduct.adminNotes && (
                    <div className="col-span-2">
                      <span className="block text-slate-400 font-bold tracking-wider uppercase text-xs mb-1">Admin Notes</span>
                      <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">{viewProduct.adminNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setViewProduct(null)}
                className="px-5 py-2.5 font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Confirm Approve Modal */}
      <Modal 
        isOpen={!!confirmApproveId} 
        onClose={() => setConfirmApproveId(null)}
        title="Approve Product"
      >
        <div className="p-6">
          <p className="text-slate-600 mb-6 font-medium">Are you sure you want to approve this product? It will become visible to customers immediately.</p>
          <div className="flex justify-end gap-3">
            <button 
              className="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
              onClick={() => setConfirmApproveId(null)}
            >
              Cancel
            </button>
            <button 
              className="px-5 py-2.5 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              onClick={handleApprove}
              disabled={actionLoading}
            >
              {actionLoading ? 'Approving...' : 'Yes, Approve'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


