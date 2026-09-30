import { useState } from 'react';
import { staffApi } from '../api';
import { useApiData } from '../hooks';
import { 
  PageHeader, 
  SearchBar, 
  DataTable, 
  StatusBadge, 
  EmptyState, 
  ColumnDef, 
  ConfirmModal, 
  AddStaffDrawer, 
  StaffQrModal 
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
  Briefcase 
} from 'lucide-react';
import type { Staff, CreateStaffInput, UpdateStaffInput } from '../types/staff.types';
import { toast } from 'sonner';

export default function StaffsPage() {
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

  const columns: ColumnDef<Staff>[] = [
    {
      key: 'id',
      header: '#',
      headerClassName: 'pl-6',
      cellClassName: 'pl-6 font-semibold text-slate-400',
      cell: (_, index) => String(index + 1).padStart(2, '0')
    },
    {
      key: 'staff',
      header: 'STAFF MEMBER',
      cell: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm flex items-center justify-center shrink-0 border border-emerald-200">
            {s.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-slate-800 text-[13px] truncate">{s.name}</span>
            <span className="text-[11px] text-slate-400 truncate">{s.email || 'No email provided'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'code',
      header: 'REFERRAL CODE',
      cell: (s) => (
        <button
          onClick={() => handleCopyCode(s.code)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200/70 text-indigo-700 font-mono text-xs font-bold hover:bg-indigo-100 transition-colors group cursor-pointer"
          title="Click to copy referral code"
        >
          <span>{s.code}</span>
          {copiedCode === s.code ? (
            <Check size={12} className="text-emerald-600" />
          ) : (
            <Copy size={12} className="text-indigo-400 group-hover:text-indigo-600" />
          )}
        </button>
      )
    },
    {
      key: 'designation',
      header: 'ROLE / DESIGNATION',
      hideOnMobile: true,
      cell: (s) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
          <Briefcase size={12} className="text-slate-400" />
          {s.designation || 'Field Representative'}
        </span>
      )
    },
    {
      key: 'phone',
      header: 'PHONE',
      cellClassName: 'font-mono text-xs font-medium text-slate-700',
      cell: (s) => (
        <a href={`tel:${s.phone}`} className="hover:text-emerald-600 hover:underline">
          {s.phone}
        </a>
      )
    },
    {
      key: 'location',
      header: 'ASSIGNED AREA',
      hideOnMobile: true,
      cell: (s) => (
        <span className="text-xs text-slate-600">
          {s.area?.name ? `${s.area.name}, ${s.district?.name}` : s.district?.name ? s.district.name : 'Platform-wide'}
        </span>
      )
    },
    {
      key: 'referrals',
      header: 'VENDORS REFERRED',
      cell: (s) => (
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Store size={13} />
          </div>
          <span className="font-bold text-slate-800 text-xs">
            {s.vendorsCount || 0}
          </span>
          <span className="text-[11px] text-slate-400">vendors</span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'STATUS',
      hideOnMobile: true,
      cell: (s) => (
        <StatusBadge 
          status={s.isActive ? 'APPROVED' : 'REJECTED'} 
          colorMap={{
            APPROVED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
            REJECTED: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-slate-200' },
            PENDING: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-slate-200' }
          }} 
        />
      )
    },
    {
      key: 'qr',
      header: 'QR CODE',
      cell: (s) => (
        <button
          onClick={() => handleOpenQr(s)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors shadow-2xs cursor-pointer"
        >
          <QrCode size={13} />
          <span>View QR</span>
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
            onClick={() => handleOpenEdit(s)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Edit Staff"
          >
            <Edit2 size={15} />
          </button>
          
          <button 
            onClick={() => setConfirmModal({ isOpen: true, staff: s, action: 'toggle' })}
            className={`p-1.5 rounded-lg transition-colors ${s.isActive ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
            title={s.isActive ? 'Deactivate Staff' : 'Activate Staff'}
          >
            <Power size={15} />
          </button>

          <button 
            onClick={() => setConfirmModal({ isOpen: true, staff: s, action: 'delete' })}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete Staff"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full text-slate-900 pb-12">
      
      {/* Page Header */}
      <PageHeader
        title="Staffs & Field Agents"
        description="Manage field marketing representatives, track vendor onboarding referrals and generate QR codes."
        action={
          <button
            onClick={handleOpenAdd}
            className="h-10 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Staff Member</span>
          </button>
        }
      />

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Staff */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Staff</span>
            <h3 className="text-2xl font-bold text-slate-900 m-0 leading-tight">{totalStaff}</h3>
          </div>
        </div>

        {/* Active Executives */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck size={22} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Field Staff</span>
            <h3 className="text-2xl font-bold text-emerald-600 m-0 leading-tight">{activeStaff}</h3>
          </div>
        </div>

        {/* Total Vendors Referred */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Store size={22} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Vendors Onboarded</span>
            <h3 className="text-2xl font-bold text-slate-900 m-0 leading-tight">{totalReferrals}</h3>
          </div>
        </div>

        {/* Top Referrer */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Award size={22} />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Top Referrer</span>
            <h4 className="text-sm font-bold text-slate-900 m-0 truncate">
              {topPerformer ? `${topPerformer.name} (${topPerformer.vendorsCount || 0})` : '—'}
            </h4>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          {[
            { id: 'all', label: `All (${totalStaff})` },
            { id: 'active', label: `Active (${activeStaff})` },
            { id: 'inactive', label: `Inactive (${totalStaff - activeStaff})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === tab.id 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            placeholder="Search by name, code, phone..." 
          />
        </div>

      </div>

      {/* Staff Table */}
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
                className="h-9 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Plus size={14} />
                <span>Register First Staff</span>
              </button>
            }
          />
        }
      />

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
