import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { PageHeader, DataTable, ColumnDef, Modal, ProductReviewDrawer, EditProductDrawer } from '../components/ui';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [viewProduct, setViewProduct] = useState<ProductApproval | null>(null);
  const [editProduct, setEditProduct] = useState<ProductApproval | null>(null);

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

  const handleApprove = async (id: string) => {
    try {
      await api.post(`/admin/product-approvals/${id}/approve`);
      setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a));
    } catch (e: any) {
      alert(e.response?.data?.error?.message || 'Error approving product');
      throw e;
    } finally { setIsSubmitting(false); }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      await api.post(`/admin/product-approvals/${id}/reject`, { reason });
      setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'REJECTED', rejectionReason: reason } : a));
    } catch (e: any) {
      alert(e.response?.data?.error?.message || 'Error rejecting product');
      throw e;
    } finally { setIsSubmitting(false); }
  };

  const handleRequestChanges = async (id: string, notesStr: string) => {
    try {
      await api.post(`/admin/product-approvals/${id}/request-changes`, { notes: notesStr });
      setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'CHANGES_REQUESTED', adminNotes: notesStr } : a));
    } catch (e: any) {
      alert(e.response?.data?.error?.message || 'Error requesting changes');
      throw e;
    } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (item: ProductApproval) => {
    if (!window.confirm(`Are you sure you want to delete ${item.product.name}?`)) return;
    try {
      await api.delete(`/admin/product-approvals/products/${item.productId}`);
      setApprovals(prev => prev.filter(a => a.productId !== item.productId));
      alert('Product deleted successfully');
    } catch (e: any) {
      alert(e.response?.data?.error?.message || 'Failed to delete product');
    } finally { setDeletingId(null); }
  };

  const handleEditSuccess = (updatedItem: ProductApproval) => {
    setApprovals(prev => prev.map(a => a.productId === updatedItem.productId ? updatedItem : a));
  };

  const vendorsMap = new Map<string, { id: string, name: string, email: string, phone: string, rating: number, vendorStatus: string, code?: string, logoUrl?: string, count: number, products: ProductApproval[] }>();
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
      header: 'STORE DETAILS',
      cell: (v) => (
        <div className="flex items-center gap-3">
          {v.logoUrl ? (
            <img src={v.logoUrl} alt={v.name} className="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <span className="font-bold">{v.name.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <span className="font-medium text-slate-800">{v.name}</span>
        </div>
      )
    },
    {
      key: 'code',
      header: 'CODE',
      cell: (v) => <span className="text-xs text-slate-500 font-mono font-medium">{v.code || 'NO-CODE'}</span>
    },
    {
      key: 'contact',
      header: 'CONTACT',
      cell: (v) => (
        <div>
          <div className="font-semibold text-slate-700">{v.phone}</div>
          <div className="text-slate-500 text-sm">{v.email}</div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'STATUS',
      cell: (v) => (
        <span className="bg-emerald-50 text-emerald-600 py-1 px-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-emerald-100">
          {v.vendorStatus}
        </span>
      )
    },
    {
      key: 'rating',
      header: 'RATING',
      cell: (v) => (
        <div className="text-amber-500 text-sm font-bold flex items-center gap-1.5">
          <span>★</span> {Number(v.rating).toFixed(1)}
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
        <div className="flex items-center justify-end gap-2">
          {item.status === 'APPROVED' ? (
            <>
              <button 
                onClick={() => setViewProduct(item)}
                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                title="View Details"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </button>
              <button 
                onClick={() => setEditProduct(item)}
                className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Edit Product"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button 
                onClick={() => handleDelete(item)}
                className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete Product"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </>
          ) : (
            <button 
              className="text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-1.5 rounded-lg transition-colors font-bold text-sm"
              onClick={() => setViewProduct(item)}
            >
              Review
            </button>
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

      {/* Product Review Drawer */}
      <ProductReviewDrawer 
        isOpen={!!viewProduct}
        onClose={() => setViewProduct(null)}
        approval={viewProduct}
        onApprove={async (id) => {
          await handleApprove(id);
          setViewProduct(null);
        }}
        onReject={async (id, reason) => {
          await handleReject(id, reason);
          setViewProduct(null);
        }}
        onRequestChanges={async (id, notes) => {
          await handleRequestChanges(id, notes);
          setViewProduct(null);
        }}
      />

      <EditProductDrawer
        isOpen={!!editProduct}
        onClose={() => setEditProduct(null)}
        productItem={editProduct}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
