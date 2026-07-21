import { useEffect, useState } from 'react';
import { adminExtrasApi } from '../api';
import { Filter, Plus, ChevronsUpDown, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Ban, Send, Check } from 'lucide-react';
import { Modal, ImageUpload } from '../components/ui';

// Generic Pagination component to avoid repetition
const Pagination = ({ count }: { count: number }) => (
  <div className="flex items-center justify-between p-4 px-6 border-t border-slate-200 bg-white">
    <span className="text-sm text-slate-500">Showing 1 to {count} of {count} results</span>
    <div className="flex items-center gap-2">
      <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-md text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors"><ChevronLeft size={16} /></button>
      <button className="w-8 h-8 flex items-center justify-center bg-green-600 border border-green-600 rounded-md text-white font-medium cursor-pointer">1</button>
      <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-md text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors"><ChevronRight size={16} /></button>
      <select className="ml-4 px-3 py-1.5 border border-slate-200 rounded-md bg-white text-sm text-slate-600 outline-none cursor-pointer">
        <option>10 / page</option>
        <option>20 / page</option>
        <option>50 / page</option>
      </select>
    </div>
  </div>
);

export function BannersPage() {
  const [banners, setBanners] = useState<Array<{ id: string; title: string; imageUrl: string; themeColor?: string; themeColorEnd?: string; isActive: boolean }>>([]);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [themeColor, setThemeColor] = useState('#16a34a');
  const [themeColorEnd, setThemeColorEnd] = useState('#4ade80'); // lighter shade by default
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = () => adminExtrasApi.banners.getAll().then((r) => setBanners(r.data));
  useEffect(() => { load(); }, []);

  const createOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminExtrasApi.banners.update(editingId, { title, imageUrl: imageUrl || 'https://placehold.co/800x300', themeColor, themeColorEnd, isActive: true });
      } else {
        await adminExtrasApi.banners.create({ title, imageUrl: imageUrl || 'https://placehold.co/800x300', themeColor, themeColorEnd, isActive: true });
      }
      setTitle('');
      setImageUrl('');
      setThemeColor('#16a34a');
      setThemeColorEnd('#4ade80');
      setEditingId(null);
      setShowForm(false);
      load();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || JSON.stringify(err);
      alert('Failed to save banner: ' + msg);
    }
  };

  const handleEdit = (b: any) => {
    setEditingId(b.id);
    setTitle(b.title);
    setImageUrl(b.imageUrl || '');
    setThemeColor(b.themeColor || '#16a34a');
    setThemeColorEnd(b.themeColorEnd || '#4ade80');
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setTitle('');
    setImageUrl('');
    setThemeColor('#16a34a');
    setThemeColorEnd('#4ade80');
    setShowForm(!showForm);
  };

  const remove = async (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      await adminExtrasApi.banners.delete(id);
      load();
    }
  };

  return (
    <div className="text-slate-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="m-0 text-2xl text-slate-900 font-bold">Banners</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-green-600 text-green-600 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-green-50">
            <Filter size={16} /> Filters
          </button>
          <button className="flex items-center gap-2 bg-green-600 border border-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-green-700" onClick={handleAdd}>
            <Plus size={16} /> Add Banner
          </button>
        </div>
      </div>
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Edit Banner' : 'Add Banner'}>
        <form className="flex flex-col gap-4" onSubmit={createOrUpdate}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
            <ImageUpload value={imageUrl} onChange={setImageUrl} folder="districtmart-banners" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Header Gradient Colors</label>
            {/* Live gradient preview */}
            <div
              className="w-full h-12 rounded-lg mb-3 border border-slate-200"
              style={{ background: `linear-gradient(135deg, ${themeColor}, ${themeColorEnd})` }}
            />
            <div className="grid grid-cols-2 gap-3">
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
            <p className="text-xs text-slate-500 mt-2">🎨 These 2 colors create a gradient for the app's top header when this banner is active.</p>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="bg-green-600 border border-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-green-700">{editingId ? 'Update Banner' : 'Save Banner'}</button>
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
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap">Color</th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap"><div className="inline-flex items-center gap-1.5">Status <ChevronsUpDown size={14} className="text-slate-400" /></div></th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b, i) => (
                <tr key={b.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-900">{i + 1}</td>
                  <td className="p-4"><img src={b.imageUrl || "https://placehold.co/100x40"} alt="Banner" className="rounded border border-slate-200 max-w-[100px] max-h-[40px] object-cover" /></td>
                  <td className="p-4 text-sm font-medium text-slate-900">{b.title}</td>
                  <td className="p-4">
                    {b.themeColor ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-24 h-6 rounded-full border border-slate-200 flex-shrink-0"
                          style={{
                            background: b.themeColorEnd
                              ? `linear-gradient(90deg, ${b.themeColor}, ${b.themeColorEnd})`
                              : b.themeColor
                          }}
                        />
                      </div>
                    ) : <span className="text-slate-400">-</span>}
                  </td>
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
        <Pagination count={banners.length} />
      </div>
    </div>
  );
}

export function CustomersPage() {
  const [customers, setCustomers] = useState<Array<{ id: string; phone: string; name?: string; isBlocked: boolean }>>([]);
  const load = () => adminExtrasApi.customers.getAll().then((r) => setCustomers(r.data));
  useEffect(() => { load(); }, []);

  const toggleBlock = async (id: string, block: boolean) => {
    await adminExtrasApi.customers.block(id, block);
    load();
  };

  return (
    <div className="text-slate-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="m-0 text-2xl text-slate-900 font-bold">Customers</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-green-600 text-green-600 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-green-50">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap">#</th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap"><div className="inline-flex items-center gap-1.5">Name <ChevronsUpDown size={14} className="text-slate-400" /></div></th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap"><div className="inline-flex items-center gap-1.5">Phone <ChevronsUpDown size={14} className="text-slate-400" /></div></th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap"><div className="inline-flex items-center gap-1.5">Status <ChevronsUpDown size={14} className="text-slate-400" /></div></th>
                <th className="p-4 text-left text-xs font-bold text-slate-900 capitalize whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-900">{i + 1}</td>
                  <td className="p-4 text-sm font-bold text-slate-900">{c.name ?? 'Guest'}</td>
                  <td className="p-4 text-sm font-medium text-slate-900">{c.phone}</td>
                  <td className="p-4 text-sm align-middle">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${c.isBlocked ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                      {c.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="p-4 text-sm align-middle">
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-md text-slate-500 cursor-pointer hover:bg-slate-50 hover:text-slate-900 transition-colors"><Eye size={14} /></button>
                      <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-md cursor-pointer transition-colors hover:bg-slate-50" title={c.isBlocked ? 'Unblock' : 'Block'} onClick={() => toggleBlock(c.id, !c.isBlocked)}>
                        <Ban size={14} className={c.isBlocked ? "text-green-600" : "text-red-600"} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination count={customers.length} />
      </div>
    </div>
  );
}

export function MicroBannersPage() {
  const [items, setItems] = useState<Array<{ id: string; title: string; isActive: boolean }>>([]);
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
        await adminExtrasApi.microBanners.create({ title, imageUrl: 'https://placehold.co/400x100', isActive: true });
      }
      setTitle('');
      setEditingId(null);
      setShowForm(false);
      load();
    } catch (err: any) {
      alert('Failed: ' + (err?.response?.data?.error || err.message));
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

  const remove = async (id: string) => {
    if (confirm('Delete this micro banner?')) {
      await adminExtrasApi.microBanners.delete(id);
      load();
    }
  };

  return (
    <div className="text-slate-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="m-0 text-2xl text-slate-900 font-bold">Micro Banners</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-green-600 text-green-600 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-green-50">
            <Filter size={16} /> Filters
          </button>
          <button className="flex items-center gap-2 bg-green-600 border border-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-green-700" onClick={handleAdd}>
            <Plus size={16} /> Add Micro Banner
          </button>
        </div>
      </div>
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
                  <td className="p-4"><img src="https://placehold.co/100x40" alt="Micro Banner" className="rounded border border-slate-200" /></td>
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
        <Pagination count={items.length} />
      </div>
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
      alert('Failed: ' + (err?.response?.data?.error || err.message));
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

  const remove = async (id: string) => {
    if (confirm('Delete this rule?')) {
      await adminExtrasApi.deliveryCharges.delete(id);
      load();
    }
  };

  return (
    <div className="text-slate-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="m-0 text-2xl text-slate-900 font-bold">Delivery Charges</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-green-600 border border-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-green-700" onClick={handleAdd}>
            <Plus size={16} /> Add Rule
          </button>
        </div>
      </div>
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
        <Pagination count={rules.length} />
      </div>
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
      alert('Failed: ' + (err?.response?.data?.error || err.message));
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

  const remove = async (id: string) => {
    if (confirm('Delete this offer?')) {
      await adminExtrasApi.offers.delete(id);
      load();
    }
  };

  return (
    <div className="text-slate-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="m-0 text-2xl text-slate-900 font-bold">Offers</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-green-600 border border-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-green-700" onClick={handleAdd}>
            <Plus size={16} /> Add Offer
          </button>
        </div>
      </div>
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
        <Pagination count={offers.length} />
      </div>
    </div>
  );
}

export function CouponsPage() {
  const [coupons, setCoupons] = useState<Array<{ id: string; code: string; discountValue: number; isActive: boolean }>>([]);
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
      alert('Failed: ' + (err?.response?.data?.error || err.message));
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

  const remove = async (id: string) => {
    if (confirm('Delete this coupon?')) {
      await adminExtrasApi.coupons.delete(id);
      load();
    }
  };

  return (
    <div className="text-slate-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="m-0 text-2xl text-slate-900 font-bold">Coupons</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-green-600 border border-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-green-700" onClick={handleAdd}>
            <Plus size={16} /> Add Coupon
          </button>
        </div>
      </div>
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
                  <td className="p-4 text-sm font-semibold text-green-600">₹{c.discountValue} Off</td>
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
        <Pagination count={coupons.length} />
      </div>
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


