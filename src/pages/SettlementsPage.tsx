import { useEffect, useState } from 'react';
import { adminClient } from '../api/client';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { DollarSign, CheckCircle, XCircle, Clock, RefreshCw, Building } from 'lucide-react';

interface Settlement {
  id: string;
  settlementNo: string;
  vendorId: string;
  periodStart: string;
  periodEnd: string;
  totalOrders: number;
  grossAmount: number;
  commissionAmount: number;
  gstAmount: number;
  netAmount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  bankReference?: string;
  createdAt: string;
}

export default function SettlementsPage() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [bankRef, setBankRef] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSettlements = async () => {
    setLoading(true);
    try {
      const res = await adminClient.get<{ data: Settlement[] }>('/settlements', {
        params: { status: activeTab === 'ALL' ? undefined : activeTab },
      });
      setSettlements(res.data?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, [activeTab]);

  const handleApprove = async () => {
    if (!selectedSettlement) return;
    setActionLoading(true);
    try {
      await adminClient.post(`/settlements/${selectedSettlement.id}/approve`, {
        bankReference: bankRef,
      });
      setSelectedSettlement(null);
      setBankRef('');
      fetchSettlements();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await adminClient.post(`/settlements/${id}/reject`, { reason });
      fetchSettlements();
    } catch (e) {
      alert('Rejection failed');
    }
  };

  const columns = [
    {
      key: 'settlementNo',
      header: 'Settlement #',
      render: (row: Settlement) => (
        <div>
          <div className="font-bold text-slate-900">{row.settlementNo}</div>
          <div className="text-xs text-slate-500">
            {new Date(row.periodStart).toLocaleDateString()} - {new Date(row.periodEnd).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      key: 'totalOrders',
      header: 'Orders',
      render: (row: Settlement) => <span className="font-semibold text-slate-700">{row.totalOrders}</span>,
    },
    {
      key: 'grossAmount',
      header: 'Gross Total',
      render: (row: Settlement) => <span className="font-medium text-slate-600">₹{Number(row.grossAmount).toFixed(2)}</span>,
    },
    {
      key: 'commissionAmount',
      header: 'Commission (5%)',
      render: (row: Settlement) => (
        <span className="text-amber-700 font-medium">₹{Number(row.commissionAmount).toFixed(2)}</span>
      ),
    },
    {
      key: 'netAmount',
      header: 'Net Payout',
      render: (row: Settlement) => (
        <span className="font-bold text-emerald-700 text-base">₹{Number(row.netAmount).toFixed(2)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Settlement) => {
        const badgeStyles = {
          PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
          APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          PAID: 'bg-blue-50 text-blue-700 border-blue-200',
          REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
        };
        return (
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${badgeStyles[row.status]}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: Settlement) => (
        <div className="flex items-center gap-2">
          {row.status === 'PENDING' && (
            <>
              <button
                onClick={() => setSelectedSettlement(row)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold cursor-pointer border-none flex items-center gap-1"
              >
                <CheckCircle size={14} /> Approve Payout
              </button>
              <button
                onClick={() => handleReject(row.id)}
                className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded text-xs font-semibold cursor-pointer border-none flex items-center gap-1"
              >
                <XCircle size={14} /> Reject
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <DollarSign className="text-emerald-600" /> Vendor Financial Settlements
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Automated settlement generation, double-entry wallet ledger, and payout approvals.
          </p>
        </div>
        <button
          onClick={fetchSettlements}
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 cursor-pointer flex items-center gap-2 shrink-0 self-start"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 cursor-pointer transition-colors border-none bg-transparent ${
              activeTab === tab
                ? 'border-emerald-600 text-emerald-700 border-solid'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab === 'PENDING' && 'Pending Approvals'}
            {tab === 'APPROVED' && 'Approved / Paid'}
            {tab === 'REJECTED' && 'Rejected'}
            {tab === 'ALL' && 'All Settlements'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <DataTable columns={columns} data={settlements} loading={loading} />
      </div>

      {/* Approve Modal */}
      {selectedSettlement && (
        <Modal
          isOpen={!!selectedSettlement}
          onClose={() => setSelectedSettlement(null)}
          title={`Approve Payout: ${selectedSettlement.settlementNo}`}
        >
          <div className="space-y-4 pt-2">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-900 text-sm space-y-1">
              <div><strong>Vendor ID:</strong> {selectedSettlement.vendorId}</div>
              <div><strong>Orders:</strong> {selectedSettlement.totalOrders}</div>
              <div><strong>Gross Amount:</strong> ₹{Number(selectedSettlement.grossAmount).toFixed(2)}</div>
              <div><strong>Commission (5%):</strong> ₹{Number(selectedSettlement.commissionAmount).toFixed(2)}</div>
              <div className="text-base font-bold text-emerald-800 pt-2 border-t border-emerald-200 mt-2">
                Net Payout to Credit: ₹{Number(selectedSettlement.netAmount).toFixed(2)}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bank Reference / UTR Number
              </label>
              <input
                type="text"
                value={bankRef}
                onChange={(e) => setBankRef(e.target.value)}
                placeholder="e.g. UTR192837491823"
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setSelectedSettlement(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 cursor-pointer border-none disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Confirm & Credit Wallet'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
