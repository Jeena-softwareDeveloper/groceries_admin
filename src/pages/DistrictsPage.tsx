import { useState } from 'react';
import { Globe, Plus, X, Eye, Edit, Trash2 } from 'lucide-react';
import { districtApi } from '../api';
import { useApiData } from '../hooks';
import { PageHeader, SearchBar, DataTable, Pagination, StatusBadge, EmptyState, ColumnDef } from '../components/ui';
import type { District } from '../types';

export default function DistrictsPage() {
  const { data: districts = [], loading, refetch } = useApiData(() => districtApi.getAll());
  
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [search, setSearch] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await districtApi.create({ name, code, isActive: true });
    setName('');
    setCode('');
    setShowForm(false);
    refetch();
  };

  const filteredDistricts = districts.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.code.toLowerCase().includes(search.toLowerCase())
  );

  const columns: ColumnDef<District>[] = [
    {
      key: 'id',
      header: '#',
      headerClassName: 'pl-6',
      cellClassName: 'pl-6 font-semibold text-slate-400',
      cell: (_, index) => String(index + 1).padStart(2, '0')
    },
    {
      key: 'name',
      header: 'District Name',
      cell: (d) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
            <Globe size={14} className="text-indigo-500" strokeWidth={2.5} />
          </div>
          <span className="font-medium text-slate-700">{d.name}</span>
        </div>
      )
    },
    {
      key: 'code',
      header: 'Code',
      cell: (d) => (
        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-lg text-[11px] font-medium uppercase font-mono tracking-wider">
          {d.code}
        </span>
      )
    },
    {
      key: 'areas',
      header: 'Total Areas',
      cell: (d) => (
        <span className="inline-flex items-center justify-center w-8 h-7 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-bold">
          {d._count?.areas ?? 0}
        </span>
      )
    },
    {
      key: 'vendors',
      header: 'Total Vendors',
      cellClassName: 'font-medium text-slate-500',
      cell: (d) => d.code === 'BLR' ? 98 : d.code === 'CHN' ? 58 : Math.floor(Math.random() * 100) // Original mock logic
    },
    {
      key: 'customers',
      header: 'Total Customers',
      cellClassName: 'font-medium text-slate-500',
      cell: (d) => d.code === 'BLR' ? '12,458' : d.code === 'CHN' ? '12,110' : '4,230' // Original mock logic
    },
    {
      key: 'status',
      header: 'Status',
      cell: (d) => (
        <StatusBadge 
          status={d.isActive ? 'Active' : 'Inactive'} 
          colorMap={{
            Active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
            Inactive: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
          }} 
        />
      )
    },
    {
      key: 'created',
      header: 'Created On',
      cellClassName: 'font-medium text-slate-500',
      cell: (d) => d.code === 'BLR' ? '10 Jul 2025' : '11 Jul 2025' // Original mock logic
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'pr-6',
      cellClassName: 'pr-6',
      cell: () => (
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 cursor-pointer hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <Eye size={14} strokeWidth={2.5} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 cursor-pointer hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <Edit size={14} strokeWidth={2.5} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-red-400 cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors">
            <Trash2 size={14} strokeWidth={2.5} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-12 text-slate-900">
      <PageHeader 
        title="Districts" 
        description="Manage delivery districts, their coverage areas and vendor distribution." 
        action={
          <button
            className="flex items-center gap-2 bg-slate-900 border border-transparent text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-800 transition-all"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? <X size={16} strokeWidth={2.5} /> : <Plus size={16} strokeWidth={2.5} />}
            {showForm ? 'Cancel' : 'Add District'}
          </button>
        }
      />

      {showForm && (
        <form
          className="flex flex-wrap items-end gap-4 p-5 bg-white rounded-lg border border-slate-200/75 shadow-sm"
          onSubmit={handleCreate}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">District Name</label>
            <input
              className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 outline-none bg-white placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all w-56"
              placeholder="e.g. Bangalore"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Code</label>
            <input
              className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 outline-none bg-white placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all w-36 uppercase"
              placeholder="e.g. BLR"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Save District
          </button>
        </form>
      )}



      <DataTable 
        columns={columns}
        data={filteredDistricts}
        loading={loading}
        emptyState={
          <EmptyState 
            icon={Globe} 
            title="No districts yet" 
            description={search ? "No districts match your search." : "Add your first district to enable area management."}
          />
        }
        pagination={
          filteredDistricts.length > 0 && (
            <Pagination 
              total={filteredDistricts.length}
              page={1}
              limit={10}
              entityName="districts"
            />
          )
        }
      />
    </div>
  );
}

