import { useEffect, useState } from 'react';
import { adminClient } from '../api/client';
import DataTable from '../components/ui/DataTable';
import { ShieldAlert, Search, RefreshCw } from 'lucide-react';

interface AuditLogItem {
  id: string;
  actorType: string;
  actorId?: string;
  actorName?: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: any;
  ipAddress?: string;
  createdAt: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminClient.get<{ data: AuditLogItem[] }>('/audit-logs', {
        params: { search: search || undefined },
      });
      setLogs(res.data?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const columns = [
    {
      key: 'createdAt',
      header: 'Timestamp',
      render: (row: AuditLogItem) => (
        <span className="text-xs text-slate-500 font-mono">
          {new Date(row.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'actorType',
      header: 'Actor',
      render: (row: AuditLogItem) => (
        <div>
          <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-slate-100 text-slate-700">
            {row.actorType}
          </span>
          {row.actorName && (
            <div className="text-xs font-semibold text-slate-900 mt-1">{row.actorName}</div>
          )}
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (row: AuditLogItem) => (
        <span className="font-bold text-slate-900 text-sm">{row.action}</span>
      ),
    },
    {
      key: 'entity',
      header: 'Target Entity',
      render: (row: AuditLogItem) => (
        <div className="text-xs">
          <span className="font-semibold text-emerald-800">{row.entityType}</span>
          <span className="text-slate-500 font-mono ml-1">#{row.entityId.substring(0, 10)}</span>
        </div>
      ),
    },
    {
      key: 'details',
      header: 'Details',
      render: (row: AuditLogItem) => (
        <pre className="text-[11px] font-mono text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200 max-w-xs overflow-x-auto m-0">
          {row.details ? JSON.stringify(row.details, null, 1) : '-'}
        </pre>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="text-emerald-600" /> Immutable Audit Logs
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Complete system activity trail for security, governance, and compliance.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 cursor-pointer flex items-center gap-2 shrink-0 self-start"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="flex items-center gap-2 max-w-md bg-white border border-slate-200 rounded-lg px-3 py-2">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
          placeholder="Filter logs by action, actor, or ID..."
          className="w-full text-sm outline-none border-none bg-transparent"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <DataTable columns={columns} data={logs} loading={loading} />
      </div>
    </div>
  );
}
