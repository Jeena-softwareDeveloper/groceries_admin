import { useEffect, useState, useCallback } from 'react';
import { vendorRequestApi, type VendorRequest, type VendorRequestStatus } from '../api/vendor-request.api';
import {
  Store, CheckCircle, XCircle, Info, Clock, ChevronRight, ArrowLeft,
  AlertCircle, User, MapPin, Building2, CreditCard, FileText, RefreshCw,
} from 'lucide-react';

// ─── Types & Constants ─────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<VendorRequestStatus, { label: string; color: string; bg: string }> = {
  DRAFT: { label: 'Draft', color: '#6b7280', bg: '#f9fafb' },
  PENDING: { label: 'Pending', color: '#d97706', bg: '#fffbeb' },
  MORE_INFO_REQUIRED: { label: 'More Info Required', color: '#2563eb', bg: '#eff6ff' },
  APPROVED: { label: 'Approved', color: '#16a34a', bg: '#f0fdf4' },
  REJECTED: { label: 'Rejected', color: '#dc2626', bg: '#fef2f2' },
};

const FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'More Info', value: 'MORE_INFO_REQUIRED' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: VendorRequestStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px',
        borderRadius: 999, fontSize: 12, fontWeight: 600,
        color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}30`,
      }}
    >
      {status === 'PENDING' && <Clock size={12} />}
      {status === 'APPROVED' && <CheckCircle size={12} />}
      {status === 'REJECTED' && <XCircle size={12} />}
      {status === 'MORE_INFO_REQUIRED' && <Info size={12} />}
      {cfg.label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ color: '#64748b', fontSize: 13, minWidth: 160 }}>{label}</span>
      <span style={{ color: '#0f172a', fontSize: 13, fontWeight: 500, textAlign: 'right', flex: 1 }}>{String(value)}</span>
    </div>
  );
}

function DocImage({ label, url }: { label: string; url?: string | null }) {
  if (!url) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
      <a href={url} target="_blank" rel="noreferrer">
        <img src={url} alt={label} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer' }} />
      </a>
      <span style={{ fontSize: 11, color: '#64748b' }}>{label}</span>
    </div>
  );
}

// ─── Modal Component ───────────────────────────────────────────────────────────

function ActionModal({
  open, title, placeholder, onConfirm, onClose, confirmLabel, confirmColor,
}: {
  open: boolean; title: string; placeholder: string;
  onConfirm: (text: string) => void; onClose: () => void;
  confirmLabel: string; confirmColor: string;
}) {
  const [text, setText] = useState('');
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 480, maxWidth: '90vw', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{title}</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          rows={4}
          style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
        />
        <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>Cancel</button>
          <button
            onClick={() => { if (!text.trim()) return; onConfirm(text.trim()); setText(''); }}
            style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: confirmColor, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Panel ──────────────────────────────────────────────────────────────

function RequestDetailPanel({
  request, onBack, onRefresh,
}: {
  request: VendorRequest; onBack: () => void; onRefresh: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<'reject' | 'info' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleApprove() {
    if (!confirm(`Approve "${request.shopName}"? This will create a Vendor account automatically.`)) return;
    setLoading(true); setError(null); setSuccess(null);
    try {
      const r = await vendorRequestApi.approve(request.id);
      setSuccess(`✅ Approved! Temp password for vendor: ${(r as any).data?.tempPassword ?? '—'}`);
      onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Approval failed');
    } finally { setLoading(false); }
  }

  async function handleReject(reason: string) {
    setModal(null); setLoading(true); setError(null);
    try {
      await vendorRequestApi.reject(request.id, reason);
      setSuccess('Application rejected and applicant notified.');
      onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Rejection failed');
    } finally { setLoading(false); }
  }

  async function handleRequestInfo(remarks: string) {
    setModal(null); setLoading(true); setError(null);
    try {
      await vendorRequestApi.requestInfo(request.id, remarks);
      setSuccess('Applicant has been notified to provide more information.');
      onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally { setLoading(false); }
  }

  const sectionHead = (Icon: any, label: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '24px 0 12px', paddingBottom: 8, borderBottom: '2px solid #f1f5f9' }}>
      <Icon size={18} color="#16a34a" />
      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>{label}</span>
    </div>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#fff', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{request.shopName ?? 'Application Detail'}</h2>
          <span style={{ fontSize: 13, color: '#64748b' }}>Submitted by {request.customer?.name ?? request.customer?.phone}</span>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {/* Alerts */}
      <div style={{ padding: '0 24px' }}>
        {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '12px 16px', borderRadius: 10, margin: '16px 0', fontSize: 14 }}>{error}</div>}
        {success && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a', padding: '12px 16px', borderRadius: 10, margin: '16px 0', fontSize: 14, fontWeight: 600 }}>{success}</div>}
        {request.adminRemarks && (
          <div style={{ background: '#eff6ff', border: '1px solid #93c5fd', color: '#2563eb', padding: '12px 16px', borderRadius: 10, margin: '16px 0', fontSize: 14 }}>
            <strong>Admin Remarks:</strong> {request.adminRemarks}
          </div>
        )}
        {request.rejectionReason && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '12px 16px', borderRadius: 10, margin: '16px 0', fontSize: 14 }}>
            <strong>Rejection Reason:</strong> {request.rejectionReason}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
        {sectionHead(User, 'Basic Information')}
        <InfoRow label="Shop Name" value={request.shopName} />
        <InfoRow label="Owner Name" value={request.ownerName} />
        <InfoRow label="Mobile Number" value={request.mobileNumber} />
        <InfoRow label="Email" value={request.email} />
        <InfoRow label="Customer" value={request.customer?.phone} />

        {sectionHead(Building2, 'Business Information')}
        <InfoRow label="Category" value={request.shopCategory} />
        <InfoRow label="Description" value={request.description} />
        <InfoRow label="GST Number" value={request.gstNumber} />
        <InfoRow label="FSSAI Number" value={request.fssaiNumber} />
        <InfoRow label="Business Reg No." value={request.businessRegNumber} />

        {sectionHead(MapPin, 'Location')}
        <InfoRow label="District" value={request.district?.name} />
        <InfoRow label="Area" value={request.area?.name} />
        <InfoRow label="Address" value={request.address} />
        <InfoRow label="Latitude" value={request.latitude} />
        <InfoRow label="Longitude" value={request.longitude} />
        <InfoRow label="Delivery Radius" value={request.deliveryRadius ? `${request.deliveryRadius} km` : null} />

        {sectionHead(CreditCard, 'Banking Details')}
        <InfoRow label="Account Holder" value={request.accountHolderName} />
        <InfoRow label="Bank Name" value={request.bankName} />
        <InfoRow label="Account Number" value={request.accountNumber} />
        <InfoRow label="IFSC Code" value={request.ifscCode} />
        <InfoRow label="UPI ID" value={request.upiId} />

        {sectionHead(FileText, 'Documents')}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 8 }}>
          <DocImage label="Shop Logo" url={request.logoUrl} />
          <DocImage label="Shop Banner" url={request.bannerUrl} />
          <DocImage label="Owner Photo" url={request.ownerPhotoUrl} />
          <DocImage label="Govt ID" url={request.govtIdUrl} />
          <DocImage label="GST Certificate" url={request.gstCertUrl} />
          <DocImage label="FSSAI Certificate" url={request.fssaiCertUrl} />
        </div>

        <InfoRow label="Submitted At" value={request.submittedAt ? new Date(request.submittedAt).toLocaleString('en-IN') : null} />
        <InfoRow label="Last Updated" value={new Date(request.updatedAt).toLocaleString('en-IN')} />
        <InfoRow label="Reviewed By" value={request.reviewedBy} />
        <InfoRow label="Reviewed At" value={request.reviewedAt ? new Date(request.reviewedAt).toLocaleString('en-IN') : null} />
      </div>

      {/* Action footer */}
      {request.status === 'PENDING' && (
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={() => setModal('info')}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 8, border: '1px solid #93c5fd', background: '#eff6ff', color: '#2563eb', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
          >
            <Info size={16} /> Request More Info
          </button>
          <button
            onClick={() => setModal('reject')}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 8, border: '1px solid #fca5a5', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
          >
            <XCircle size={16} /> Reject
          </button>
          <button
            onClick={handleApprove}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px', borderRadius: 8, border: 'none', background: '#16a34a', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
          >
            <CheckCircle size={16} /> {loading ? 'Processing…' : 'Approve'}
          </button>
        </div>
      )}

      <ActionModal
        open={modal === 'reject'}
        title="Reject Application"
        placeholder="Enter the reason for rejection..."
        confirmLabel="Reject Application"
        confirmColor="#dc2626"
        onConfirm={handleReject}
        onClose={() => setModal(null)}
      />
      <ActionModal
        open={modal === 'info'}
        title="Request More Information"
        placeholder="Describe what information you need from the applicant..."
        confirmLabel="Send Request"
        confirmColor="#2563eb"
        onConfirm={handleRequestInfo}
        onClose={() => setModal(null)}
      />
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function VendorRequestsPage() {
  const [requests, setRequests] = useState<VendorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<VendorRequest | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const limit = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await vendorRequestApi.getAll(filter || undefined, page, limit);
      setRequests((res as any).data ?? []);
      setTotal((res as any).meta?.total ?? 0);
    } catch { setRequests([]); }
    finally { setLoading(false); }
  }, [filter, page]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    vendorRequestApi.getPendingCount().then((r) => setPendingCount((r as any).data?.count ?? 0)).catch(() => {});
  }, [requests]);

  function handleBack() {
    setSelected(null);
    load();
  }

  if (selected) {
    return <RequestDetailPanel request={selected} onBack={handleBack} onRefresh={load} />;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a' }}>Vendor Requests</h1>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>Review and manage vendor onboarding applications</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {pendingCount > 0 && (
              <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '6px 14px', borderRadius: 999, fontWeight: 700, fontSize: 13 }}>
                {pendingCount} Pending
              </span>
            )}
            <button
              onClick={load}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '2px solid #f1f5f9', paddingBottom: 0 }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setFilter(f.value); setPage(1); }}
            style={{
              padding: '10px 18px', border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, color: filter === f.value ? '#16a34a' : '#64748b',
              borderBottom: filter === f.value ? '2px solid #16a34a' : '2px solid transparent',
              marginBottom: -2,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ flex: 1, background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Loading…</div>
        ) : requests.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', gap: 12 }}>
            <Store size={40} color="#cbd5e1" />
            <span>No vendor requests found.</span>
          </div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Shop', 'Owner', 'Mobile', 'District / Area', 'Category', 'Submitted', 'Status', ''].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r)}
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {r.logoUrl
                          ? <img src={r.logoUrl} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
                          : <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Store size={18} color="#16a34a" /></div>
                        }
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{r.shopName ?? '—'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#374151' }}>{r.ownerName ?? r.customer?.name ?? '—'}</td>
                    <td style={{ padding: '14px 16px', color: '#374151' }}>{r.mobileNumber ?? r.customer?.phone}</td>
                    <td style={{ padding: '14px 16px', color: '#374151' }}>
                      {r.district?.name && r.area?.name ? `${r.district.name} / ${r.area.name}` : '—'}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#374151' }}>{r.shopCategory ?? '—'}</td>
                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: 12 }}>
                      {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={r.status} /></td>
                    <td style={{ padding: '14px 16px' }}><ChevronRight size={16} color="#94a3b8" /></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>
                Showing {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} of {total} results
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1, fontSize: 13 }}
                >
                  ‹ Prev
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * limit >= total}
                  style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: page * limit >= total ? 'not-allowed' : 'pointer', opacity: page * limit >= total ? 0.4 : 1, fontSize: 13 }}
                >
                  Next ›
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


