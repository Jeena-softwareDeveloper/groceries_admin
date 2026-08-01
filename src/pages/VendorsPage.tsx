import { useState } from 'react';
import { Store, Users, Check, X, Eye, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { vendorApi, vendorRequestApi } from '../api';
import { useApiData } from '../hooks';
import { PageHeader, SearchBar, DataTable, Pagination, StatusBadge, EmptyState, ColumnDef, VendorReviewDrawer } from '../components/ui';
import type { Vendor } from '../types';

export default function VendorsPage() {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [drawerMode, setDrawerMode] = useState<'review' | 'view' | 'edit'>('review');
  
  const { data: allVendors = [], loading: vLoading, refetch: vRefetch } = useApiData(() => vendorApi.getAll());
  const { data: requestData, loading: rLoading, refetch: rRefetch } = useApiData(() => vendorRequestApi.getAll('PENDING', 1, 100));

  const allRequests = Array.isArray(requestData) ? requestData : [];
  
  const normalizedRequests = allRequests.map(r => ({
    id: r.id,
    shopName: r.shopName || 'Unknown Shop',
    email: r.email || 'No Email',
    status: r.status,
    area: { name: r.area?.name || 'Unknown', district: { name: r.district?.name || 'Unknown' } },
    isRequest: true
  }));

  const normalizedVendors = allVendors.map(v => ({
    ...v,
    isRequest: false
  }));

  const mergedList = [...normalizedVendors, ...normalizedRequests];

  const approve = async (id: string, isRequest: boolean) => {
    if (isRequest) await vendorRequestApi.approve(id);
    else await vendorApi.approve(id);
    vRefetch();
    rRefetch();
  };

  const reject = async (id: string, isRequest: boolean, reason?: string) => {
    if (isRequest) await vendorRequestApi.reject(id, reason || 'Does not meet requirements');
    else await vendorApi.reject(id, { reason: reason || 'Does not meet requirements' });
    vRefetch();
    rRefetch();
  };

  const save = async (id: string, data: any) => {
    await vendorApi.update(id, data);
    vRefetch();
  };

  const handleReview = (v: any) => {
    let originalData = v;
    if (v.isRequest) {
       originalData = allRequests.find((r: any) => r.id === v.id) || v;
       originalData.isRequest = true;
    }
    setSelectedVendor(originalData);
    setDrawerMode('review');
    setIsDrawerOpen(true);
  };

  const handleView = (v: any) => {
    setSelectedVendor(v);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  const handleEdit = (v: any) => {
    setSelectedVendor(v);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const handleDelete = async (v: any) => {
    if (window.confirm(`Are you sure you want to delete "${v.shopName}"? This action cannot be undone.`)) {
      setDeletingId(v.id);
      try {
        if (!v.isRequest) {
          await vendorApi.delete(v.id);
        } else {
          // If it's a request, just reject it or skip (backend might not support delete request yet)
          alert('Cannot delete pending requests, please reject them instead.');
        }
        vRefetch();
        rRefetch();
      } catch (e: any) {
        alert(e.message || 'Failed to delete vendor');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const statusCounts = {
    all: mergedList.length,
    pending: mergedList.filter(v => v.status === 'PENDING').length,
    approved: mergedList.filter(v => v.status === 'APPROVED').length,
  };

  const displayedVendors = mergedList
    .filter(v => (filter ? v.status === filter : true))
    .filter(v => v.shopName.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase()));

  const columns: ColumnDef<Vendor>[] = [
    {
      key: 'id',
      header: '#',
      headerClassName: 'pl-6',
      cellClassName: 'pl-6 font-semibold text-slate-400',
      cell: (_, index) => String(index + 1).padStart(2, '0')
    },
    {
      key: 'shop',
      header: 'SHOP',
      cell: (v) => (
        <div className="flex items-center gap-3">
          {v.logoUrl ? (
            <img src={v.logoUrl} alt={v.shopName} className="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <span className="font-bold">{v.shopName.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <span className="font-medium text-slate-800">{v.shopName}</span>
        </div>
      )
    },
    {
      key: 'code',
      header: 'CODE',
      cell: (v) => <span className="text-xs text-slate-500 font-mono font-medium">{v.code || 'NO-CODE'}</span>
    },
    {
      key: 'products',
      header: 'PRODUCTS',
      cell: (v) => <span className="text-slate-600">{v.productsCount || 0} items</span>
    },
    {
      key: 'turnover',
      header: 'TURNOVER',
      cell: (v) => <span className="font-medium text-slate-700">₹ {Number(v.turnover || 0).toLocaleString()}</span>
    },
    {
      key: 'email',
      header: 'Email',
      cellClassName: 'text-slate-500 font-medium',
      cell: (v) => v.email
    },
    {
      key: 'location',
      header: 'Location',
      cellClassName: 'text-slate-600 font-medium',
      cell: (v) => `${v.area.name}, ${v.area.district.name}`
    },
    {
      key: 'status',
      header: 'Status',
      cell: (v) => (
        <StatusBadge 
          status={v.status} 
          colorMap={{
            APPROVED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
            PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
            REJECTED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
          }} 
        />
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'pr-6',
      cellClassName: 'pr-6',
      cell: (v) => (
        <div className="flex items-center gap-2">
          {v.status === 'PENDING' ? (
            <button
              className="flex items-center gap-1.5 h-8 px-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs font-bold cursor-pointer hover:bg-blue-100 transition-colors"
              title="Review Request" 
              onClick={() => handleReview(v)}
            >
              <Eye size={13} strokeWidth={3} /> Review
            </button>
          ) : (
            <>
              <button 
                className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 cursor-pointer hover:bg-slate-100 hover:text-slate-700 transition-colors" 
                title="View"
                onClick={() => handleView(v)}
              >
                <Eye size={14} strokeWidth={2.5} />
              </button>
              <button 
                className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 cursor-pointer hover:bg-slate-100 hover:text-slate-700 transition-colors" 
                title="Edit"
                onClick={() => handleEdit(v)}
              >
                <Edit size={14} strokeWidth={2.5} />
              </button>
              <button 
                className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-red-400 cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50" 
                title="Delete"
                onClick={() => handleDelete(v)}
                disabled={deletingId === v.id}
              >
                {deletingId === v.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} strokeWidth={2.5} />}
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-12 text-slate-900">
      <PageHeader 
        title="Vendors" 
        description="Manage and monitor all registered vendors on the platform." 
        action={
          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-[13px] font-medium py-2 px-3 rounded-lg outline-none cursor-pointer hover:border-slate-300 focus:border-slate-300 focus:ring-2 focus:ring-slate-100 min-w-[160px] h-9"
            >
              <option value="">All Vendors ({statusCounts.all})</option>
              <option value="PENDING">Pending ({statusCounts.pending})</option>
              <option value="APPROVED">Approved ({statusCounts.approved})</option>
            </select>
            <button className="flex items-center h-9 gap-2 bg-slate-900 border border-transparent text-white px-4 rounded-lg text-[13px] font-semibold shadow-sm hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2">
              <Plus size={15} strokeWidth={2.5} /> Add Vendor
            </button>
          </div>
        }
      />

      <DataTable 
        columns={columns}
        data={displayedVendors as any}
        loading={vLoading || rLoading}
        emptyState={
          <EmptyState 
            icon={Store} 
            title="No vendors found" 
            description={search ? "No vendors match your search." : "No vendors match the current filter. Try a different status."}
          />
        }
        pagination={
          displayedVendors.length > 0 && (
            <Pagination 
              total={displayedVendors.length}
              page={1}
              limit={10}
              entityName="vendors"
            />
          )
        }
      />
      
      <VendorReviewDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        vendor={selectedVendor} 
        mode={drawerMode}
        onApprove={approve} 
        onReject={reject} 
        onSave={save}
      />
    </div>
  );
}


