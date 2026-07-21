import { useState, useEffect } from 'react';
import { MapPin, Plus, X, Eye, Edit, Trash2 } from 'lucide-react';
import { areaApi, districtApi } from '../api';
import { useApiData } from '../hooks';
import { PageHeader, SearchBar, DataTable, Pagination, StatusBadge, EmptyState, ColumnDef } from '../components/ui';
import type { Area } from '../types';

export default function AreasPage() {
  const { data: areas = [], loading, refetch: refetchAreas } = useApiData(() => areaApi.getAll());
  const { data: districts = [] } = useApiData(() => districtApi.getAll());
  
  const [showForm, setShowForm] = useState(false);
  const [districtId, setDistrictId] = useState('');
  const [name, setName] = useState('');
  const [pincode, setPincode] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (districts.length > 0 && !districtId) {
      setDistrictId(districts[0].id);
    }
  }, [districts, districtId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await areaApi.create({ districtId, name, pincode, isActive: true });
    setName('');
    setPincode('');
    setShowForm(false);
    refetchAreas();
  };

  const filteredAreas = areas.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    (a.pincode && a.pincode.toLowerCase().includes(search.toLowerCase())) ||
    a.district.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns: ColumnDef<Area>[] = [
    {
      key: 'id',
      header: '#',
      headerClassName: 'pl-6',
      cellClassName: 'pl-6 font-semibold text-slate-400',
      cell: (_, index) => String(index + 1).padStart(2, '0')
    },
    {
      key: 'name',
      header: 'Area Name',
      cell: (a) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
            <MapPin size={14} className="text-blue-500" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-slate-900">{a.name}</span>
        </div>
      )
    },
    {
      key: 'district',
      header: 'District',
      cellClassName: 'font-medium text-slate-600',
      cell: (a) => a.district.name
    },
    {
      key: 'pincode',
      header: 'Pincode',
      cell: (a) => a.pincode ? (
        <span className="bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold font-mono">
          {a.pincode}
        </span>
      ) : (
        <span className="text-slate-300 font-medium">—</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (a) => (
        <StatusBadge 
          status={a.isActive ? 'Active' : 'Inactive'} 
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
      cell: () => '12 Jul 2025' // Hardcoded as per original
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
        title="Areas" 
        description="Manage delivery areas and their district mappings." 
        action={
          <button
            className="flex items-center gap-2 bg-slate-900 border border-transparent text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-800 transition-all"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? <X size={16} strokeWidth={2.5} /> : <Plus size={16} strokeWidth={2.5} />}
            {showForm ? 'Cancel' : 'Add Area'}
          </button>
        }
      />

      {showForm && (
        <form
          className="flex flex-wrap items-end gap-4 p-5 bg-white rounded-lg border border-slate-200/75 shadow-sm"
          onSubmit={handleCreate}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">District</label>
            <select
              className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 outline-none bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all w-48 appearance-none"
              value={districtId}
              onChange={(e) => setDistrictId(e.target.value)}
              required
            >
              {districts.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Area Name</label>
            <input
              className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 outline-none bg-white placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all w-52"
              placeholder="e.g. Koramangala"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Pincode <span className="text-slate-300 normal-case font-medium">(optional)</span></label>
            <input
              className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 outline-none bg-white placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all w-36"
              placeholder="e.g. 560034"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Save Area
          </button>
        </form>
      )}



      <DataTable 
        columns={columns}
        data={filteredAreas}
        loading={loading}
        emptyState={
          <EmptyState 
            icon={MapPin} 
            title="No areas found" 
            description={search ? "No areas match your search." : "Add your first area to get started."}
          />
        }
        pagination={
          filteredAreas.length > 0 && (
            <Pagination 
              total={filteredAreas.length}
              page={1}
              limit={10}
              entityName="areas"
            />
          )
        }
      />
    </div>
  );
}

