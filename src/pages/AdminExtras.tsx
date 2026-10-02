import { useEffect, useState } from 'react';
import { adminExtrasApi } from '../api';
import { Filter, Plus, ChevronsUpDown, Eye, Edit, Trash2, Ban, Send, Check, Power, PowerOff } from 'lucide-react';
import { Modal, ImageUpload, PageHeader, ConfirmModal, DataTable, ColumnDef, StatusBadge, Pagination, SearchBar } from '../components/ui';
import { toast } from 'sonner';


export function BannersPage() {
  const [banners, setBanners] = useState<Array<any>>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [type, setType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [row, setRow] = useState(1);
  const [sortOrder, setSortOrder] = useState('0');
  const [themeColor, setThemeColor] = useState('#16a34a');
  const [themeColorEnd, setThemeColorEnd] = useState('#4ade80');

  const load = () => adminExtrasApi.banners.getAll().then((r) => setBanners(r.data));
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setTitle(''); setImageUrl(''); setVideoUrl('');
    setType('IMAGE'); setRow(1);
    setSortOrder('0');
    setThemeColor('#16a34a'); setThemeColorEnd('#4ade80');
    setEditingId(null);
  };

  const createOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        imageUrl: imageUrl || '',
        videoUrl: videoUrl || null,
        type, row,
        sortOrder: Number(sortOrder),
        themeColor, themeColorEnd,
        isActive: true
      };
      if (editingId) {
        await adminExtrasApi.banners.update(editingId, payload);
      } else {
        await adminExtrasApi.banners.create(payload);
      }
      resetForm();
      setShowForm(false);
      load();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || JSON.stringify(err);
      toast.error('Failed to save banner: ' + msg);
    }
  };

  const handleEdit = (b: any) => {
    setEditingId(b.id);
    setTitle(b.title);
    setImageUrl(b.imageUrl || '');
    setVideoUrl(b.videoUrl || '');
    setType(b.type || 'IMAGE');
    setRow(b.row || 1);
    setSortOrder(String(b.sortOrder ?? 0));
    setThemeColor(b.themeColor || '#16a34a');
    setThemeColorEnd(b.themeColorEnd || '#4ade80');
    setShowForm(true);
  };

  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, id: string | null}>({isOpen: false, id: null});

  const remove = (id: string) => {
    setConfirmModal({ isOpen: true, id });
  };

  const executeDelete = async () => {
    if (confirmModal.id) {
      await adminExtrasApi.banners.delete(confirmModal.id);
      load();
    }
    setConfirmModal({ isOpen: false, id: null });
  };

  const handleToggleStatus = async (b: any) => {
    try {
      await adminExtrasApi.banners.update(b.id, { isActive: b.isActive === false ? true : false });
      load();
    } catch (err: any) {
      toast.error('Failed to toggle status');
    }
  };

  const rowLabels: Record<number, { label: string; desc: string; color: string }> = {
    1: { label: 'Row 1 — Video Banner', desc: 'Full-width video at the top of the home screen', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    2: { label: 'Row 2 — Dual Images', desc: 'Two side-by-side promotional images', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    3: { label: 'Row 3 — Wide Image', desc: 'Full-width promotional banner image', color: 'bg-green-100 text-green-700 border-green-200' },
  };

  const rows = [1, 2, 3];

  const bannerColumns: ColumnDef<any>[] = [
    {
      key: 'id',
      header: '#',
      cell: (_, i) => String(i + 1).padStart(2, '0')
    },
    {
      key: 'preview',
      header: 'Preview',
      cell: (b) => (
        <div className="flex items-center gap-2">
          <img src={b.imageUrl || ''} alt={b.title} className="rounded border border-slate-200 w-16 h-8 sm:w-20 sm:h-10 object-cover shrink-0" />
          {b.type === 'VIDEO' && (
            <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-bold">VIDEO</span>
          )}
        </div>
      )
    },
    {
      key: 'title',
      header: 'Title',
      cell: (b) => <span className="font-semibold text-slate-800 text-xs sm:text-sm">{b.title}</span>
    },
    {
      key: 'type',
      header: 'Type',
      hideOnMobile: true,
      cell: (b) => <span className="text-xs font-semibold text-slate-500">{b.type || 'IMAGE'}</span>
    },
    {
      key: 'sortOrder',
      header: 'Order',
      hideOnMobile: true,
      cell: (b) => <span className="font-mono text-slate-500 font-bold">{b.sortOrder ?? 0}</span>
    },
    {
      key: 'status',
      header: 'Status',
      hideOnMobile: true,
      cell: (b) => (
        <StatusBadge 
          status={b.isActive !== false ? 'Active' : 'Inactive'}
          colorMap={{
            Active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
            Inactive: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
          }}
        />
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (b) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleToggleStatus(b)}
            className={`w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg cursor-pointer transition-colors ${b.isActive !== false ? 'text-amber-500 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600' : 'text-emerald-500 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600'}`}
            title={b.isActive !== false ? "Deactivate" : "Activate"}
          >
            {b.isActive !== false ? <PowerOff size={14} strokeWidth={2.5} /> : <Power size={14} strokeWidth={2.5} />}
          </button>
          <button 
            onClick={() => handleEdit(b)} 
            className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 cursor-pointer hover:bg-slate-100 hover:text-slate-700 transition-colors"
            title="Edit Banner"
          >
            <Edit size={14} strokeWidth={2.5} />
          </button>
          <button 
            onClick={() => remove(b.id)} 
            className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-red-400 cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors"
            title="Delete Banner"
          >
            <Trash2 size={14} strokeWidth={2.5} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="text-slate-900">
      <PageHeader
        title="Banners"
        description=""
        action={
          <button className="flex items-center gap-1.5 sm:gap-2 bg-green-600 border border-green-600 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors hover:bg-green-700" onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus size={16} /> <span>Add Banner</span>
          </button>
        }
      />

      {/* 3-Row Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {rows.map(r => {
          const info = rowLabels[r];
          const count = banners.filter(b => (b.row ?? 1) === r).length;
          return (
            <div key={r} className={`border rounded-lg p-3 sm:p-4 ${info.color}`}>
              <div className="font-bold text-xs sm:text-sm mb-1">{info.label}</div>
              <div className="text-[11px] sm:text-xs opacity-80 mb-2">{info.desc}</div>
              <div className="font-bold text-xl sm:text-2xl">{count}</div>
              <div className="text-[10px] sm:text-xs opacity-70">banners</div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); resetForm(); }} title={editingId ? 'Edit Banner' : 'Add Banner'}>
        <form className="flex flex-col gap-4" onSubmit={createOrUpdate}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Banner Row</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-600" value={row} onChange={(e) => setRow(Number(e.target.value))}>
              <option value={1}>Row 1 — Video Banner (Top video)</option>
              <option value={2}>Row 2 — Dual Images (Left & Right side-by-side)</option>
              <option value={3}>Row 3 — Wide Image (Full-width banner)</option>
            </select>
            <p className="text-xs text-slate-400 mt-1">{rowLabels[row]?.desc}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Banner Type</label>
            <div className="flex gap-3">
              <label className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer text-sm font-medium transition-all ${type === 'IMAGE' ? 'border-green-600 bg-green-50 text-green-700' : 'border-slate-200 text-slate-600'}`}>
                <input type="radio" value="IMAGE" checked={type === 'IMAGE'} onChange={() => setType('IMAGE')} className="sr-only" />
                🖼 Image
              </label>
              {row === 1 && (
                <label className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer text-sm font-medium transition-all ${type === 'VIDEO' ? 'border-green-600 bg-green-50 text-green-700' : 'border-slate-200 text-slate-600'}`}>
                  <input type="radio" value="VIDEO" checked={type === 'VIDEO'} onChange={() => setType('VIDEO')} className="sr-only" />
                  🎬 Video
                </label>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all" placeholder="Enter banner title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
            <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all" placeholder="e.g. 1" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} required />
          </div>
          {type === 'VIDEO' ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Video File</label>
              <ImageUpload value={videoUrl} onChange={setVideoUrl} folder="districtmart-videos" />
              <p className="text-xs text-slate-400 mt-1">Upload an MP4 video (max 50MB).</p>
            </div>
          ) : null}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{type === 'VIDEO' ? 'Thumbnail / Poster Image' : 'Banner Image'}</label>
            <ImageUpload value={imageUrl} onChange={setImageUrl} folder="districtmart-banners" />
          </div>
          {row === 1 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Header Gradient Colors</label>
              <div className="w-full h-10 rounded-lg mb-3 border border-slate-200" style={{ background: `linear-gradient(135deg, ${themeColor}, ${themeColorEnd})` }} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Start Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-9 h-9 p-0.5 border border-slate-200 rounded cursor-pointer flex-shrink-0" />
                    <input type="text" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="flex-1 px-2 py-1.5 border border-slate-200 rounded-lg text-xs outline-none uppercase font-mono min-w-0" placeholder="#HEX" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">End Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={themeColorEnd} onChange={(e) => setThemeColorEnd(e.target.value)} className="w-9 h-9 p-0.5 border border-slate-200 rounded cursor-pointer flex-shrink-0" />
                    <input type="text" value={themeColorEnd} onChange={(e) => setThemeColorEnd(e.target.value)} className="flex-1 px-2 py-1.5 border border-slate-200 rounded-lg text-xs outline-none uppercase font-mono min-w-0" placeholder="#HEX" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 mt-2">
            <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="bg-green-600 border border-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-green-700">{editingId ? 'Update Banner' : 'Save Banner'}</button>
          </div>
        </form>
      </Modal>

      {/* Row-grouped banner list */}
      {rows.map(r => {
        const rowBanners = banners.filter(b => (b.row ?? 1) === r);
        const info = rowLabels[r];
        return (
          <div key={r} className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <h3 className={`text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full border ${info.color}`}>{info.label}</h3>
              <span className="text-xs text-slate-400 hidden sm:inline">{info.desc}</span>
            </div>
            <DataTable
              data={rowBanners}
              columns={bannerColumns}
              emptyState={
                <div className="p-6 text-center text-slate-400 text-sm">
                  No banners for this row. Click "Add Banner" to create one.
                </div>
              }
            />
          </div>
        );
      })}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={executeDelete}
        title="Delete Banner"
        message="Are you sure you want to delete this banner?"
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}

export function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [blockingId, setBlockingId] = useState<string | null>(null);

  // View modal state
  const [viewCustomer, setViewCustomer] = useState<any | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminExtrasApi.customers.getAll(page, limit, debouncedSearch);
      setCustomers(res.data ?? []);
      setTotal(res.meta?.total ?? 0);
    } catch {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, limit, debouncedSearch]);

  const handleView = async (id: string) => {
    setIsViewOpen(true);
    setViewCustomer(null);
    setViewLoading(true);
    try {
      const res = await adminExtrasApi.customers.getById(id);
      setViewCustomer(res.data);
    } catch {
      toast.error('Failed to load customer details');
    } finally {
      setViewLoading(false);
    }
  };

  const toggleBlock = async (id: string, block: boolean) => {
    setBlockingId(id);
    try {
      await adminExtrasApi.customers.block(id, block);
      toast.success(block ? 'Customer blocked' : 'Customer unblocked');
      load();
    } catch {
      toast.error('Action failed');
    } finally {
      setBlockingId(null);
    }
  };

  // Client-side status filter (on top of server paginated data)
  const displayed = customers.filter(c => {
    if (statusFilter === 'active') return !c.isBlocked;
    if (statusFilter === 'blocked') return c.isBlocked;
    return true;
  });

  const customerColumns: ColumnDef<any>[] = [
    {
      key: 'id',
      header: '#',
      headerClassName: 'pl-6',
      cellClassName: 'pl-6 font-semibold text-slate-400',
      cell: (_, i) => String((page - 1) * limit + i + 1).padStart(2, '0')
    },
    {
      key: 'name',
      header: 'Name',
      cell: (c) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {(c.name ?? c.phone ?? '?').charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-slate-800 text-sm">{c.name ?? <span className="text-slate-400 font-normal italic">Guest</span>}</span>
        </div>
      )
    },
    {
      key: 'phone',
      header: 'Phone',
      cell: (c) => <span className="font-medium text-slate-600 text-sm">{c.phone}</span>
    },
    {
      key: 'location',
      header: 'Location',
      hideOnMobile: true,
      cell: (c) => (
        <span className="text-slate-500 text-xs">
          {c.currentLocation ? c.currentLocation.slice(0, 40) + (c.currentLocation.length > 40 ? '…' : '') : <span className="text-slate-300">—</span>}
        </span>
      )
    },
    {
      key: 'joined',
      header: 'Joined',
      hideOnMobile: true,
      cell: (c) => <span className="text-slate-400 text-xs">{new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
    },
    {
      key: 'status',
      header: 'Status',
      hideOnMobile: true,
      cell: (c) => (
        <StatusBadge
          status={c.isBlocked ? 'Blocked' : 'Active'}
          colorMap={{
            Active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
            Blocked: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
          }}
        />
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'pr-6',
      cellClassName: 'pr-6',
      cell: (c) => (
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 cursor-pointer hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
            title="View Customer"
            onClick={() => handleView(c.id)}
          >
            <Eye size={14} strokeWidth={2.5} />
          </button>
          <button
            className={`w-8 h-8 flex items-center justify-center bg-white border rounded-lg cursor-pointer transition-colors disabled:opacity-40 ${
              c.isBlocked
                ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                : 'border-red-200 text-red-500 hover:bg-red-50'
            }`}
            title={c.isBlocked ? 'Unblock Customer' : 'Block Customer'}
            onClick={() => toggleBlock(c.id, !c.isBlocked)}
            disabled={blockingId === c.id}
          >
            {blockingId === c.id
              ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : <Ban size={14} strokeWidth={2.5} />
            }
          </button>
        </div>
      )
    }
  ];

  const blockedCount = customers.filter(c => c.isBlocked).length;
  const activeCount = customers.filter(c => !c.isBlocked).length;

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-12 text-slate-900">
      <PageHeader
        title="Customers"
        description="Manage all registered customers on the platform."
        action={
          <div className="flex items-center gap-3 flex-wrap">
            {/* Status filter tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {([
                { key: 'all', label: `All (${total})` },
                { key: 'active', label: `Active (${activeCount})` },
                { key: 'blocked', label: `Blocked (${blockedCount})` },
              ] as const).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    statusFilter === tab.key
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by phone or name..."
            />
          </div>
        }
      />

      <DataTable
        data={displayed}
        columns={customerColumns}
        loading={loading}
        emptyState={
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Eye size={20} className="text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No customers found</p>
            <p className="text-xs text-slate-400 mt-1">{search ? 'Try a different search term.' : 'No customers match this filter.'}</p>
          </div>
        }
        pagination={
          total > 0 && (
            <Pagination
              total={total}
              page={page}
              limit={limit}
              entityName="customers"
              onPageChange={setPage}
              onLimitChange={(l) => { setLimit(l); setPage(1); }}
            />
          )
        }
      />

      {/* Customer Detail Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => { setIsViewOpen(false); setViewCustomer(null); }}
        title="Customer Details"
      >
        {viewLoading ? (
          <div className="flex items-center justify-center py-12">
            <span className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : viewCustomer ? (
          <div className="flex flex-col gap-5">
            {/* Avatar + Basic Info */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
                {(viewCustomer.name ?? viewCustomer.phone ?? '?').charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-base font-bold text-slate-900 truncate">{viewCustomer.name ?? <span className="text-slate-400 font-normal italic">Guest</span>}</p>
                <p className="text-sm text-slate-500 font-medium">{viewCustomer.phone}</p>
                {viewCustomer.email && <p className="text-xs text-slate-400">{viewCustomer.email}</p>}
                <span className={`mt-1 inline-flex self-start items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                  viewCustomer.isBlocked
                    ? 'bg-red-50 text-red-600 border-red-200'
                    : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                }`}>
                  {viewCustomer.isBlocked ? 'Blocked' : 'Active'}
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Customer ID', value: viewCustomer.id.slice(0, 16) + '…' },
                { label: 'Joined', value: new Date(viewCustomer.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) },
                { label: 'Last Updated', value: new Date(viewCustomer.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
                { label: 'Addresses', value: viewCustomer.addresses?.length ?? 0 },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">{label}</span>
                  <span className="text-sm font-bold text-slate-800">{value}</span>
                </div>
              ))}
            </div>

            {/* Location */}
            {viewCustomer.currentLocation && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">Last Location</span>
                <span className="text-xs text-slate-700 font-medium leading-relaxed">{viewCustomer.currentLocation}</span>
              </div>
            )}

            {/* Recent Orders */}
            {viewCustomer.orders?.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Recent Orders ({viewCustomer.orders.length})</p>
                <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
                  {viewCustomer.orders.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 gap-3">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-xs font-mono font-semibold text-slate-600 truncate">{order.id.slice(0, 18)}…</span>
                        <span className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="flex flex-col items-end gap-0.5 shrink-0">
                        <span className="text-sm font-bold text-slate-900">₹{Number(order.total ?? 0).toLocaleString('en-IN')}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full border ${
                          order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                          order.status === 'CANCELLED' ? 'bg-red-50 text-red-500 border-red-200' :
                          'bg-amber-50 text-amber-600 border-amber-200'
                        }`}>{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Block / Unblock Action */}
            <button
              onClick={() => {
                toggleBlock(viewCustomer.id, !viewCustomer.isBlocked);
                setIsViewOpen(false);
              }}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                viewCustomer.isBlocked
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {viewCustomer.isBlocked ? '✓ Unblock Customer' : '⊘ Block Customer'}
            </button>
          </div>
        ) : (
          <p className="text-center text-slate-400 py-8 text-sm">Could not load customer details.</p>
        )}
      </Modal>
    </div>
  );
}


export function MicroBannersPage() {
  const [items, setItems] = useState<Array<{ id: string; title: string; isActive: boolean; imageUrl?: string }>>([]);
  const [title, setTitle] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = () => adminExtrasApi.microBanners.getAll().then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const createOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminExtrasApi.microBanners.update(editingId, { title, isActive: true });
      } else {
        await adminExtrasApi.microBanners.create({ title, imageUrl: '', isActive: true });
      }
      setTitle('');
      setEditingId(null);
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error('Failed: ' + (err?.response?.data?.error || err.message));
    }
  };

  const handleEdit = (r: any) => {
    setEditingId(r.id);
    setTitle(r.title);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setTitle('');
    setShowForm(true);
  };

  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, id: string | null}>({isOpen: false, id: null});

  const remove = (id: string) => {
    setConfirmModal({ isOpen: true, id });
  };

  const executeDelete = async () => {
    if (confirmModal.id) {
      await adminExtrasApi.microBanners.delete(confirmModal.id);
      load();
    }
    setConfirmModal({ isOpen: false, id: null });
  };

  return (
    <div className="text-slate-900">
            <PageHeader 
        title="Micro Banners"
        description=""
        action={
          <div className="flex items-center gap-3">
            
          <button className="flex items-center gap-2 bg-green-600 border border-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-green-700" onClick={handleAdd}>
            <Plus size={16} /> Add Micro Banner
          </button>
          </div>
        }
      />
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Edit Micro Banner' : 'Add Micro Banner'}>
        <form className="flex flex-col gap-4" onSubmit={createOrUpdate}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="flex items-center gap-2 bg-green-600 border border-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-green-700">Save Micro Banner</button>
          </div>
        </form>
      </Modal>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap">#</th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap"><div className="inline-flex items-center gap-1.5">Image <ChevronsUpDown size={14} className="text-slate-400" /></div></th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap"><div className="inline-flex items-center gap-1.5">Title <ChevronsUpDown size={14} className="text-slate-400" /></div></th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap"><div className="inline-flex items-center gap-1.5">Status <ChevronsUpDown size={14} className="text-slate-400" /></div></th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b, i) => (
                <tr key={b.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-900">{i + 1}</td>
                  <td className="p-4">{b.imageUrl ? <img src={b.imageUrl} alt="Micro Banner" className="rounded border border-slate-200 w-16 h-8 object-cover" /> : <span className="text-xs text-slate-400">No image</span>}</td>
                  <td className="p-4 text-sm font-medium text-slate-900">{b.title}</td>
                  <td className="p-4 text-sm align-middle">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${b.isActive !== false ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                      {b.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-sm align-middle">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(b)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-md text-slate-500 cursor-pointer hover:bg-slate-50 hover:text-slate-900 transition-colors"><Edit size={14} /></button>
                      <button onClick={() => remove(b.id)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-md text-red-600 cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={items.length} page={1} limit={items.length || 1} entityName="micro banners" />
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={executeDelete}
        title="Delete Micro Banner"
        message="Are you sure you want to delete this micro banner?"
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}

export function DeliveryChargesPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [charge, setCharge] = useState('29');
  const [freeAbove, setFreeAbove] = useState('');
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerIcon, setBannerIcon] = useState('');
  const [bannerBgColor, setBannerBgColor] = useState('');
  const [bannerTextColor, setBannerTextColor] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = () => adminExtrasApi.deliveryCharges.getAll().then((r) => setRules(r.data));
  useEffect(() => { load(); }, []);

  const createOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { 
        name, 
        charge: Number(charge),
        freeAbove: freeAbove ? Number(freeAbove) : null,
        bannerTitle: bannerTitle || null,
        bannerSubtitle: bannerSubtitle || null,
        bannerIcon: bannerIcon || null,
        bannerBgColor: bannerBgColor || null,
        bannerTextColor: bannerTextColor || null,
        isActive: true
      };
      
      if (editingId) {
        await adminExtrasApi.deliveryCharges.update(editingId, payload);
      } else {
        await adminExtrasApi.deliveryCharges.create({ ...payload, minDistance: 0, maxDistance: 10 });
      }
      setName('');
      setCharge('29');
      setEditingId(null);
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error('Failed: ' + (err?.response?.data?.error || err.message));
    }
  };

  const handleEdit = (r: any) => {
    setEditingId(r.id);
    setName(r.name);
    setCharge(r.charge.toString());
    setFreeAbove(r.freeAbove?.toString() || '');
    setBannerTitle(r.bannerTitle || '');
    setBannerSubtitle(r.bannerSubtitle || '');
    setBannerIcon(r.bannerIcon || '');
    setBannerBgColor(r.bannerBgColor || '#f0fdf4');
    setBannerTextColor(r.bannerTextColor || '#16a34a');
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setName('');
    setCharge('29');
    setFreeAbove('199');
    setBannerTitle('FREE DELIVERY');
    setBannerSubtitle('');
    setBannerIcon('bicycle');
    setBannerBgColor('#f0fdf4'); // Default light green
    setBannerTextColor('#16a34a'); // Default dark green
    setShowForm(true);
  };

  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, id: string | null}>({isOpen: false, id: null});

  const remove = (id: string) => {
    setConfirmModal({ isOpen: true, id });
  };

  const executeDelete = async () => {
    if (confirmModal.id) {
      await adminExtrasApi.deliveryCharges.delete(confirmModal.id);
      load();
    }
    setConfirmModal({ isOpen: false, id: null });
  };

  return (
    <div className="text-slate-900">
            <PageHeader 
        title="Delivery Charges"
        description=""
        action={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-green-600 border border-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-green-700" onClick={handleAdd}>
            <Plus size={16} /> Add Rule
          </button>
          </div>
        }
      />
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Edit Rule' : 'Add Rule'}>
        <form className="flex flex-col gap-5 p-2" onSubmit={createOrUpdate}>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">Rule Name</label>
            <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all" placeholder="e.g. Standard" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">Base Charge (₹)</label>
              <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all" placeholder="29" value={charge} onChange={(e) => setCharge(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">Free Above (₹)</label>
              <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all" placeholder="199" value={freeAbove} onChange={(e) => setFreeAbove(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">Banner Title</label>
              <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all" placeholder="e.g. FREE DELIVERY" value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">Banner Subtitle</label>
              <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all" placeholder="e.g. On all orders above ₹199" value={bannerSubtitle} onChange={(e) => setBannerSubtitle(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">Banner Icon <span className="text-slate-500 font-normal">(Ionicons Name or Lottie URL)</span></label>
            <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all" placeholder="e.g. bicycle or https://..." value={bannerIcon} onChange={(e) => setBannerIcon(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">Background Color</label>
              <div className="flex items-center gap-2">
                <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-200 shrink-0 shadow-sm cursor-pointer">
                  <input type="color" className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer border-0 p-0" value={bannerBgColor} onChange={(e) => setBannerBgColor(e.target.value)} />
                </div>
                <input className="flex-1 min-w-0 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:bg-white focus:border-green-500 transition-all uppercase" placeholder="#f0fdf4" value={bannerBgColor} onChange={(e) => setBannerBgColor(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">Text/Icon Color</label>
              <div className="flex items-center gap-2">
                <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-200 shrink-0 shadow-sm cursor-pointer">
                  <input type="color" className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer border-0 p-0" value={bannerTextColor} onChange={(e) => setBannerTextColor(e.target.value)} />
                </div>
                <input className="flex-1 min-w-0 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:bg-white focus:border-green-500 transition-all uppercase" placeholder="#16a34a" value={bannerTextColor} onChange={(e) => setBannerTextColor(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4 mt-2 border-t border-slate-100">
            <button type="button" onClick={() => setShowForm(false)} className="mr-3 px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
            <button type="submit" className="flex items-center gap-2 bg-green-600 text-white px-8 py-2.5 rounded-lg text-sm font-semibold cursor-pointer shadow-md shadow-green-600/20 transition-all hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5">Save Rule</button>
          </div>
        </form>
      </Modal>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap">#</th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap"><div className="inline-flex items-center gap-1.5">Rule Name <ChevronsUpDown size={14} className="text-slate-400" /></div></th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap"><div className="inline-flex items-center gap-1.5">Base Charge <ChevronsUpDown size={14} className="text-slate-400" /></div></th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap"><div className="inline-flex items-center gap-1.5">Free Above <ChevronsUpDown size={14} className="text-slate-400" /></div></th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap"><div className="inline-flex items-center gap-1.5">Status <ChevronsUpDown size={14} className="text-slate-400" /></div></th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r, i) => (
                <tr key={r.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-900">{i + 1}</td>
                  <td className="p-4 text-sm font-medium text-slate-900">{r.name}</td>
                  <td className="p-4 text-sm font-semibold text-green-600">₹{r.charge}</td>
                  <td className="p-4 text-sm font-medium text-slate-900">{r.freeAbove ? `₹${r.freeAbove}` : '—'}</td>
                  <td className="p-4 text-sm align-middle">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${r.isActive !== false ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                      {r.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-sm align-middle">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(r)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-md text-slate-500 cursor-pointer hover:bg-slate-50 hover:text-slate-900 transition-colors"><Edit size={14} /></button>
                      <button onClick={() => remove(r.id)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-md text-red-600 cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={rules.length} page={1} limit={rules.length || 1} entityName="rules" />
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={executeDelete}
        title="Delete Delivery Rule"
        message="Are you sure you want to delete this rule?"
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}

export function OffersPage() {
  const [offers, setOffers] = useState<Array<{ id: string; title: string; scope: string; isActive: boolean }>>([]);
  const [title, setTitle] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = () => adminExtrasApi.offers.getAll().then((r) => setOffers(r.data));
  useEffect(() => { load(); }, []);

  const createOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminExtrasApi.offers.update(editingId, { title, isActive: true });
      } else {
        await adminExtrasApi.offers.create({ title, scope: 'PLATFORM', discountAmt: 10, isActive: true });
      }
      setTitle('');
      setEditingId(null);
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error('Failed: ' + (err?.response?.data?.error || err.message));
    }
  };

  const handleEdit = (r: any) => {
    setEditingId(r.id);
    setTitle(r.title);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setTitle('');
    setShowForm(true);
  };

  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, id: string | null}>({isOpen: false, id: null});

  const remove = (id: string) => {
    setConfirmModal({ isOpen: true, id });
  };

  const executeDelete = async () => {
    if (confirmModal.id) {
      await adminExtrasApi.offers.delete(confirmModal.id);
      load();
    }
    setConfirmModal({ isOpen: false, id: null });
  };

  return (
    <div className="text-slate-900">
            <PageHeader 
        title="Offers"
        description=""
        action={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-green-600 border border-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-green-700" onClick={handleAdd}>
            <Plus size={16} /> Add Offer
          </button>
          </div>
        }
      />
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Edit Offer' : 'Add Offer'}>
        <form className="flex flex-col gap-4" onSubmit={createOrUpdate}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="flex items-center gap-2 bg-green-600 border border-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-green-700">Save Offer</button>
          </div>
        </form>
      </Modal>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap">#</th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap"><div className="inline-flex items-center gap-1.5">Title <ChevronsUpDown size={14} className="text-slate-400" /></div></th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap"><div className="inline-flex items-center gap-1.5">Scope <ChevronsUpDown size={14} className="text-slate-400" /></div></th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap"><div className="inline-flex items-center gap-1.5">Status <ChevronsUpDown size={14} className="text-slate-400" /></div></th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((o, i) => (
                <tr key={o.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-900">{i + 1}</td>
                  <td className="p-4 text-sm font-medium text-slate-900">{o.title}</td>
                  <td className="p-4 text-sm align-middle"><span className="bg-green-100 text-green-800 border border-green-200 px-2 py-1 rounded text-xs font-semibold uppercase">{o.scope}</span></td>
                  <td className="p-4 text-sm align-middle">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${o.isActive !== false ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                      {o.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-sm align-middle">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(o)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-md text-slate-500 cursor-pointer hover:bg-slate-50 hover:text-slate-900 transition-colors"><Edit size={14} /></button>
                      <button onClick={() => remove(o.id)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-md text-red-600 cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={offers.length} page={1} limit={offers.length || 1} entityName="offers" />
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={executeDelete}
        title="Delete Offer"
        message="Are you sure you want to delete this offer?"
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}

export function CouponsPage() {
  const [coupons, setCoupons] = useState<Array<{ id: string; code: string; discountAmt: number; isActive: boolean }>>([]);
  const [code, setCode] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = () => adminExtrasApi.coupons.getAll().then((r) => setCoupons(r.data));
  useEffect(() => { load(); }, []);

  const createOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminExtrasApi.coupons.update(editingId, { code, isActive: true });
      } else {
        await adminExtrasApi.coupons.create({ code, discountAmt: 50, minOrder: 200, isActive: true, scope: 'PLATFORM' });
      }
      setCode('');
      setEditingId(null);
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error('Failed: ' + (err?.response?.data?.error || err.message));
    }
  };

  const handleEdit = (c: any) => {
    setEditingId(c.id);
    setCode(c.code);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setCode('');
    setShowForm(true);
  };

  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, id: string | null}>({isOpen: false, id: null});

  const remove = (id: string) => {
    setConfirmModal({ isOpen: true, id });
  };

  const executeDelete = async () => {
    if (confirmModal.id) {
      await adminExtrasApi.coupons.delete(confirmModal.id);
      load();
    }
    setConfirmModal({ isOpen: false, id: null });
  };

  return (
    <div className="text-slate-900">
            <PageHeader 
        title="Coupons"
        description=""
        action={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-green-600 border border-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-green-700" onClick={handleAdd}>
            <Plus size={16} /> Add Coupon
          </button>
          </div>
        }
      />
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Edit Coupon' : 'Add Coupon'}>
        <form className="flex flex-col gap-4" onSubmit={createOrUpdate}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Coupon Code</label>
            <input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all uppercase" placeholder="e.g. WELCOME50" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required />
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="flex items-center gap-2 bg-green-600 border border-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-green-700">Save Coupon</button>
          </div>
        </form>
      </Modal>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap">#</th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap"><div className="inline-flex items-center gap-1.5">Code <ChevronsUpDown size={14} className="text-slate-400" /></div></th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap"><div className="inline-flex items-center gap-1.5">Discount <ChevronsUpDown size={14} className="text-slate-400" /></div></th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap"><div className="inline-flex items-center gap-1.5">Status <ChevronsUpDown size={14} className="text-slate-400" /></div></th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c, i) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-900">{i + 1}</td>
                  <td className="p-4 text-sm align-middle"><span className="bg-green-100 text-green-800 border border-dashed border-green-400 px-2 py-1 rounded text-xs font-bold uppercase">{c.code}</span></td>
                  <td className="p-4 text-sm font-semibold text-green-600">₹{c.discountAmt} Off</td>
                  <td className="p-4 text-sm align-middle">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${c.isActive !== false ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                      {c.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-sm align-middle">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(c)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-md text-slate-500 cursor-pointer hover:bg-slate-50 hover:text-slate-900 transition-colors"><Edit size={14} /></button>
                      <button onClick={() => remove(c.id)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-md text-red-600 cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={coupons.length} page={1} limit={coupons.length || 1} entityName="coupons" />
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={executeDelete}
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon?"
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}

export function NotificationsPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sent, setSent] = useState<number | null>(null);

  const broadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await adminExtrasApi.notifications.broadcast({ title, body });
    setSent(res.data.sent);
  };

  return (
    <div className="text-slate-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="m-0 text-2xl text-slate-900 font-bold">Broadcast Notification</h1>
      </div>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm p-6">
        <form className="w-full max-w-[600px]" onSubmit={broadcast}>
          <label className="block mb-4">
            <span className="block mb-2 font-semibold text-slate-900 text-sm">Notification Title</span>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
            />
          </label>
          <label className="block mb-6">
            <span className="block mb-2 font-semibold text-slate-900 text-sm">Message Body</span>
            <textarea 
              value={body} 
              onChange={(e) => setBody(e.target.value)} 
              required 
              rows={4} 
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all resize-y"
            />
          </label>
          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-green-600 border border-green-600 text-white px-4 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-green-700">
            <Send size={16} /> Send Broadcast to All Customers
          </button>
        </form>
        {sent !== null && (
          <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg font-semibold flex items-center gap-2">
            <Check size={20} />
            Successfully sent to {sent} customers!
          </div>
        )}
      </div>
    </div>
  );
}


