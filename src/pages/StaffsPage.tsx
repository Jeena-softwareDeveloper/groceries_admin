import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { staffApi } from '../api';
import { useApiData } from '../hooks';
import { 
  SearchBar, 
  DataTable, 
  EmptyState, 
  ColumnDef, 
  ConfirmModal, 
  AddStaffDrawer, 
  StaffQrModal,
  PageHeader
} from '../components/ui';
import { 
  Users, 
  UserCheck, 
  Store, 
  QrCode, 
  Plus, 
  Edit2,
  Trash2, 
  Power, 
  Copy, 
  Check, 
  Award, 
  Briefcase,
  Eye,
  TrendingUp,
  Zap,
  Shield,
  MapPin
} from 'lucide-react';
import type { Staff, CreateStaffInput, UpdateStaffInput } from '../types/staff.types';
import { toast } from 'sonner';

export default function StaffsPage() {
  const navigate = useNavigate();
  const { data: staffs = [], loading, refetch } = useApiData<Staff[]>(() => staffApi.getAll());
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<Staff | null>(null);
  
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedStaffForQr, setSelectedStaffForQr] = useState<Staff | null>(null);

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; staff: Staff | null; action: 'delete' | 'toggle' }>({
    isOpen: false,
    staff: null,
    action: 'delete'
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied code: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenAdd = () => {
    setStaffToEdit(null);
    setIsAddDrawerOpen(true);
  };

  const handleOpenEdit = (staff: Staff) => {
    setStaffToEdit(staff);
    setIsAddDrawerOpen(true);
  };

  const handleOpenQr = (staff: Staff) => {
    setSelectedStaffForQr(staff);
    setIsQrModalOpen(true);
  };

  const handleSaveStaff = async (data: CreateStaffInput | UpdateStaffInput, id?: string) => {
    if (id) {
      await staffApi.update(id, data as UpdateStaffInput);
      toast.success('Staff details updated successfully');
    } else {
      const res = await staffApi.create(data as CreateStaffInput);
      const code = res.data?.code || (data as CreateStaffInput).code || '';
      toast.success(`Staff registered! Assigned Code: ${code}`);
    }
    refetch();
  };

  const executeAction = async () => {
    const { staff, action } = confirmModal;
    if (!staff) return;

    try {
      if (action === 'delete') {
        await staffApi.delete(staff.id);
        toast.success(staff.vendorsCount && staff.vendorsCount > 0 
          ? 'Staff deactivated (records preserved for referral tracking)' 
          : 'Staff member removed successfully');
      } else {
        await staffApi.toggleStatus(staff.id);
        toast.success(`Staff marked as ${staff.isActive ? 'Inactive' : 'Active'}`);
      }
      refetch();
    } catch (e: any) {
      toast.error(e.message || 'Action failed');
    } finally {
      setConfirmModal({ isOpen: false, staff: null, action: 'delete' });
    }
  };

  // Stats calculations
  const staffList = (staffs || []) as Staff[];
  const totalStaff = staffList.length;
  const activeStaff = staffList.filter(s => s.isActive).length;
  const totalReferrals = staffList.reduce((sum, s) => sum + (s.vendorsCount || 0), 0);
  const topPerformer = [...staffList].sort((a, b) => (b.vendorsCount || 0) - (a.vendorsCount || 0))[0];

  // Filtering
  const displayedStaffs = staffList
    .filter(s => {
      if (filter === 'active') return s.isActive;
      if (filter === 'inactive') return !s.isActive;
      return true;
    })
    .filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search) ||
      (s.designation && s.designation.toLowerCase().includes(search.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(search.toLowerCase()))
    );

  // Avatar color palette — cycles through a rich set
  const avatarPalettes = [
    { bg: 'from-emerald-500 to-teal-600', ring: 'ring-emerald-300' },
    { bg: 'from-violet-500 to-purple-600', ring: 'ring-violet-300' },
    { bg: 'from-amber-500 to-orange-600', ring: 'ring-amber-300' },
    { bg: 'from-blue-500 to-indigo-600', ring: 'ring-blue-300' },
    { bg: 'from-rose-500 to-pink-600', ring: 'ring-rose-300' },
    { bg: 'from-cyan-500 to-sky-600', ring: 'ring-cyan-300' },
  ];

  const columns: ColumnDef<Staff>[] = [
    {
      key: 'id',
      header: '#',
      headerClassName: 'pl-6',
      cellClassName: 'pl-6',
      cell: (_, index) => (
        <span className="text-xs font-bold text-slate-400 font-mono">
          {String(index + 1).padStart(2, '0')}
        </span>
      )
    },
    {
      key: 'staff',
      header: 'STAFF MEMBER',
      cell: (s, index) => {
        const palette = avatarPalettes[index % avatarPalettes.length];
        return (
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${palette.bg} text-white font-bold text-sm flex items-center justify-center shrink-0 ring-2 ${palette.ring} ring-offset-1 shadow-sm`}>
              {s.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-slate-900 text-[13px] truncate">{s.name}</span>
              <span className="text-[11px] text-slate-400 truncate">{s.email || 'No email'}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'code',
      header: 'REFERRAL CODE',
      cell: (s) => (
        <button
          onClick={() => handleCopyCode(s.code)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer group"
          style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            borderColor: '#86efac',
            color: '#166534',
          }}
          title="Click to copy referral code"
        >
          <span>{s.code}</span>
          {copiedCode === s.code ? (
            <Check size={11} className="text-emerald-600" />
          ) : (
            <Copy size={11} className="text-emerald-400 group-hover:text-emerald-700 transition-colors" />
          )}
        </button>
      )
    },
    {
      key: 'designation',
      header: 'DESIGNATION',
      hideOnMobile: true,
      cell: (s) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
          <Briefcase size={11} className="text-slate-400" />
          {s.designation || 'Field Executive'}
        </span>
      )
    },
    {
      key: 'phone',
      header: 'PHONE',
      cell: (s) => (
        <a
          href={`tel:${s.phone}`}
          className="font-mono text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:underline transition-colors"
        >
          {s.phone}
        </a>
      )
    },
    {
      key: 'location',
      header: 'AREA',
      hideOnMobile: true,
      cell: (s) => (
        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
          <MapPin size={11} className="text-slate-400 shrink-0" />
          {s.area?.name ? `${s.area.name}, ${s.district?.name}` : s.district?.name || 'Platform-wide'}
        </span>
      )
    },
    {
      key: 'referrals',
      header: 'VENDORS',
      cell: (s) => (
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-sm">
            <Store size={12} />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-slate-900 text-sm leading-none">{s.vendorsCount || 0}</span>
            <span className="text-[10px] text-slate-400 leading-none">referred</span>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'STATUS',
      hideOnMobile: true,
      cell: (s) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
          s.isActive
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-slate-100 text-slate-500 border-slate-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          {s.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'qr',
      header: 'QR',
      cell: (s) => (
        <button
          onClick={() => handleOpenQr(s)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-white text-xs font-bold transition-all hover:scale-105 shadow-sm cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #059669, #0d9488)' }}
        >
          <QrCode size={12} />
          <span>QR</span>
        </button>
      )
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      headerClassName: 'pr-6',
      cellClassName: 'pr-6',
      cell: (s) => (
        <div className="flex items-center gap-1">
          <button 
            onClick={() => navigate(`/staffs/${s.id}`)}
            className="p-1.5 rounded-lg text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors"
            title="View Staff Details"
          >
            <Eye size={14} />
          </button>

          <button 
            onClick={() => handleOpenEdit(s)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Edit Staff"
          >
            <Edit2 size={14} />
          </button>
          
          <button 
            onClick={() => setConfirmModal({ isOpen: true, staff: s, action: 'toggle' })}
            className={`p-1.5 rounded-lg transition-colors ${s.isActive ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
            title={s.isActive ? 'Deactivate' : 'Activate'}
          >
            <Power size={14} />
          </button>

          <button 
            onClick={() => setConfirmModal({ isOpen: true, staff: s, action: 'delete' })}
            className="p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete Staff"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-0 w-full text-slate-900 pb-12">
      
      <PageHeader 
        title="Field Executives" 
        description="Manage staff, referral codes & QR campaigns" 
        action={
          <div className="flex items-center gap-3">
            <div className="flex p-1 rounded-xl border border-slate-200 bg-slate-50">
              {[
                { id: 'all', label: 'All', count: totalStaff },
                { id: 'active', label: 'Active', count: activeStaff, dot: 'bg-emerald-500' },
                { id: 'inactive', label: 'Inactive', count: totalStaff - activeStaff, dot: 'bg-slate-400' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filter === tab.id 
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.dot && <span className={`w-1.5 h-1.5 rounded-full ${tab.dot}`} />}
                  {tab.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    filter === tab.id ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="w-64">
              <SearchBar 
                value={search} 
                onChange={setSearch} 
                placeholder="Search staff..." 
              />
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 text-sm font-bold transition-all shadow-sm shrink-0 cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Staff</span>
            </button>
          </div>
        }
      />

      {/* ── PREMIUM STAFF TABLE ── */}
      <div className="rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm bg-white">
        {/* Table Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
              <Users size={13} className="text-white" />
            </div>
            <span className="text-sm font-bold text-slate-800">Staff Directory</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              {displayedStaffs.length} members
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Zap size={12} className="text-amber-500" />
            <span>Live data</span>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={displayedStaffs}
          loading={loading}
          emptyState={
            <EmptyState
              icon={Users}
              title="No staff members found"
              description={search ? `No staff matching "${search}"` : "Register field marketing executives to start issuing referral QR codes."}
              action={
                <button
                  onClick={handleOpenAdd}
                  className="h-9 px-5 rounded-xl text-white text-xs font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-sm cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #059669, #0d9488)' }}
                >
                  <Plus size={14} />
                  <span>Register First Staff</span>
                </button>
              }
            />
          }
        />
      </div>



      {/* Add / Edit Staff Drawer */}
      <AddStaffDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onSave={handleSaveStaff}
        staffToEdit={staffToEdit}
      />

      {/* Staff QR Modal */}
      <StaffQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        staff={selectedStaffForQr}
      />

      {/* Action Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, staff: null, action: 'delete' })}
        onConfirm={executeAction}
        title={confirmModal.action === 'delete' ? 'Delete Staff Member' : 'Change Account Status'}
        message={
          confirmModal.action === 'delete'
            ? `Are you sure you want to remove ${confirmModal.staff?.name}? If they have referred vendors, they will be deactivated to preserve vendor referral records.`
            : `Are you sure you want to mark ${confirmModal.staff?.name} as ${confirmModal.staff?.isActive ? 'Inactive' : 'Active'}?`
        }
        confirmText={confirmModal.action === 'delete' ? 'Delete' : 'Confirm'}
        isDestructive={confirmModal.action === 'delete'}
      />

    </div>
  );
}
