import { useState } from 'react';
import { Store, Users, Check, X, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { vendorApi } from '../api';
import { useApiData } from '../hooks';
import { PageHeader, SearchBar, DataTable, Pagination, StatusBadge, EmptyState, ColumnDef } from '../components/ui';
import type { Vendor } from '../types';

export default function VendorsPage() {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  
  const { data: allVendors = [], loading, refetch } = useApiData(() => vendorApi.getAll());

  const approve = async (id: string) => {
    await vendorApi.approve(id);
    refetch();
  };

  const reject = async (id: string) => {
    await vendorApi.reject(id, { reason: 'Does not meet requirements' });
    refetch();
  };

  const statusCounts = {
    all: allVendors.length,
    pending: allVendors.filter(v => v.status === 'PENDING').length,
    approved: allVendors.filter(v => v.status === 'APPROVED').length,
  };

  const displayedVendors = allVendors
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
      header: 'Shop',
      cell: (v) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shrink-0">
            <Store size={14} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-slate-900">{v.shopName}</span>
        </div>
      )
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
            <>
              <button
                className="flex items-center gap-1.5 h-8 px-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs font-bold cursor-pointer hover:bg-emerald-100 transition-colors"
                title="Approve" onClick={() => approve(v.id)}
              >
                <Check size={13} strokeWidth={3} /> Approve
              </button>
              <button
                className="flex items-center gap-1.5 h-8 px-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-bold cursor-pointer hover:bg-red-100 transition-colors"
                title="Reject" onClick={() => reject(v.id)}
              >
                <X size={13} strokeWidth={3} /> Reject
              </button>
            </>
          ) : (
            <>
              <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 cursor-pointer hover:bg-slate-100 hover:text-slate-700 transition-colors" title="View">
                <Eye size={14} strokeWidth={2.5} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 cursor-pointer hover:bg-slate-100 hover:text-slate-700 transition-colors" title="Edit">
                <Edit size={14} strokeWidth={2.5} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-red-400 cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors" title="Delete">
                <Trash2 size={14} strokeWidth={2.5} />
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
          <button className="flex items-center gap-2 bg-slate-900 border border-transparent text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2">
            <Plus size={16} /> Add Vendor
          </button>
        }
      />

      <div className="flex items-center gap-3 flex-wrap">
        {[
          { label: 'All Vendors', count: statusCounts.all, icon: Store, active: filter === '' },
          { label: 'Pending Approval', count: statusCounts.pending, icon: Users, active: filter === 'PENDING' },
          { label: 'Approved', count: statusCounts.approved, icon: Check, active: filter === 'APPROVED' },
        ].map((chip, i) => (
          <button
            key={i}
            onClick={() => setFilter(i === 0 ? '' : i === 1 ? 'PENDING' : 'APPROVED')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
              chip.active
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <chip.icon size={14} strokeWidth={2.5} />
            {chip.label}
            <span className={`ml-1 text-xs font-bold px-1.5 py-0.5 rounded-md ${chip.active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {chip.count}
            </span>
          </button>
        ))}


      </div>

      <DataTable 
        columns={columns}
        data={displayedVendors}
        loading={loading}
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
    </div>
  );
}


