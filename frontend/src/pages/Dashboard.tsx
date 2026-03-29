import { useState } from 'react';
import {
  LayoutDashboard, Megaphone, CalendarDays, FileText,
  ClipboardList, Users, BarChart2, Settings,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAnnouncements, useDeleteAnnouncement } from '@/hooks/useAnnouncements';
import { useRequests, useUpdateRequestStatus } from '@/hooks/useRequests';
import { useSCSMembers } from '@/hooks/useSCS';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { useUIStore } from '@/store/uiStore';
import { formatDate, timeAgo, snakeToTitle } from '@/lib/utils';
import type { LearnerRequest, RequestStatus } from '@/types';

type DashTab =
  | 'overview'
  | 'announcements'
  | 'events'
  | 'documents'
  | 'requests'
  | 'scs'
  | 'evaluations';

const NAV_ITEMS: { id: DashTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',      label: 'Overview',      icon: <LayoutDashboard size={16} /> },
  { id: 'announcements', label: 'Announcements',  icon: <Megaphone size={16} /> },
  { id: 'events',        label: 'Events',         icon: <CalendarDays size={16} /> },
  { id: 'documents',     label: 'Documents',      icon: <FileText size={16} /> },
  { id: 'requests',      label: 'Requests',       icon: <ClipboardList size={16} /> },
  { id: 'scs',           label: 'SCS Members',    icon: <Users size={16} /> },
  { id: 'evaluations',   label: 'Evaluations',    icon: <BarChart2 size={16} /> },
];

// ── Sub-panels ────────────────────────────────────────────────────────────────

function OverviewPanel() {
  const { user } = useAuth();
  const { data: announcements } = useAnnouncements();
  const { data: requests } = useRequests();
  const { data: members } = useSCSMembers();

  const stats = [
    { label: 'Announcements',     value: announcements?.length ?? 0,                          color: 'bg-primary-50 text-primary-600' },
    { label: 'Pending Requests',  value: requests?.filter((r) => r.status === 'pending').length ?? 0, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'SCS Members',       value: members?.length ?? 0,                                color: 'bg-green-50 text-green-600' },
    { label: 'Active Requests',   value: requests?.filter((r) => r.status === 'in_review').length ?? 0, color: 'bg-blue-50 text-blue-600' },
  ];

  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-gray-900 mb-6">
        Welcome back, {user?.displayName?.split(' ')[0]} 👋
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`${s.color} rounded-xl p-5`}>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Recent Requests</h3>
        {requests?.slice(0, 5).map((r) => (
          <div key={r.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-900">{snakeToTitle(r.type)}</p>
              <p className="text-xs text-gray-400">{r.isAnonymous ? 'Anonymous' : r.name} · {timeAgo(new Date(r.createdAt))}</p>
            </div>
            <StatusBadge status={r.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const map: Record<RequestStatus, 'warning' | 'info' | 'success' | 'danger' | 'default'> = {
    pending:   'warning',
    in_review: 'info',
    approved:  'success',
    rejected:  'danger',
    resolved:  'default',
  };
  return <Badge variant={map[status]}>{snakeToTitle(status)}</Badge>;
}

function AnnouncementsPanel() {
  const { data: announcements, isLoading } = useAnnouncements();
  const { mutate: deleteAnn } = useDeleteAnnouncement();
  const addToast = useUIStore((s) => s.addToast);

  if (isLoading) return <PageSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading font-bold text-xl text-gray-900">Announcements</h2>
        <Button size="sm">+ New</Button>
      </div>
      <div className="space-y-3">
        {announcements?.map((ann) => (
          <div key={ann.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="primary">{ann.category}</Badge>
                {ann.isPinned && <Badge variant="danger">Pinned</Badge>}
                <span className="text-xs text-gray-400 ml-auto">{timeAgo(new Date(ann.createdAt))}</span>
              </div>
              <p className="font-medium text-gray-900 text-sm">{ann.title}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="ghost">Edit</Button>
              <RoleGuard requiredRole="super_admin">
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    deleteAnn(ann.id);
                    addToast('Announcement deleted.', 'info');
                  }}
                >
                  Delete
                </Button>
              </RoleGuard>
            </div>
          </div>
        ))}
        {!announcements?.length && (
          <p className="text-gray-400 text-sm text-center py-10">No announcements yet.</p>
        )}
      </div>
    </div>
  );
}

function RequestsPanel() {
  const { data: requests, isLoading } = useRequests();
  const { mutate: updateStatus } = useUpdateRequestStatus();
  const addToast = useUIStore((s) => s.addToast);

  if (isLoading) return <PageSpinner />;

  const handleAction = (id: string, status: RequestStatus) => {
    updateStatus({ id, status });
    addToast(`Request marked as ${snakeToTitle(status)}.`, 'success');
  };

  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-gray-900 mb-5">Service Requests</h2>
      <div className="space-y-3">
        {requests?.map((r) => (
          <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-gray-900 text-sm">{snakeToTitle(r.type)}</p>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-xs text-gray-400">
                  {r.isAnonymous ? 'Anonymous' : `${r.name} · ${r.gradeSection}`}
                  {' · '}{timeAgo(new Date(r.createdAt))}
                </p>
                <p className="text-sm text-gray-600 mt-2 max-w-lg">{r.message}</p>
              </div>
              <div className="flex gap-2">
                {r.status === 'pending' && (
                  <Button size="sm" variant="outline" onClick={() => handleAction(r.id, 'in_review')}>
                    Review
                  </Button>
                )}
                {r.status === 'in_review' && (
                  <>
                    <Button size="sm" onClick={() => handleAction(r.id, 'approved')}>Approve</Button>
                    <Button size="sm" variant="danger" onClick={() => handleAction(r.id, 'rejected')}>Reject</Button>
                  </>
                )}
                {r.status === 'approved' && (
                  <Button size="sm" variant="ghost" onClick={() => handleAction(r.id, 'resolved')}>
                    Mark Resolved
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        {!requests?.length && (
          <p className="text-gray-400 text-sm text-center py-10">No requests yet.</p>
        )}
      </div>
    </div>
  );
}

function SCSPanel() {
  const { data: members, isLoading } = useSCSMembers();
  if (isLoading) return <PageSpinner />;

  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-gray-900 mb-5">SCS Members</h2>
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Name', 'Grade/Section', 'Committee', 'Status', 'Joined'].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members?.map((m) => (
              <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-900">{m.fullName}</td>
                <td className="px-5 py-3 text-gray-600">{m.gradeSection}</td>
                <td className="px-5 py-3 text-gray-600">{m.committee}</td>
                <td className="px-5 py-3">
                  <Badge variant={m.status === 'active' ? 'success' : m.status === 'probationary' ? 'warning' : 'default'}>
                    {m.status}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-gray-400 text-xs">{formatDate(new Date(m.joinedAt))}</td>
              </tr>
            ))}
            {!members?.length && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-400">No members yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlaceholderPanel({ title }: { title: string }) {
  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-gray-900 mb-5">{title}</h2>
      <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-12 text-center text-gray-400 text-sm">
        This panel is under construction. Full CRUD coming soon.
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashTab>('overview');

  const renderPanel = () => {
    switch (activeTab) {
      case 'overview':      return <OverviewPanel />;
      case 'announcements': return <AnnouncementsPanel />;
      case 'requests':      return <RequestsPanel />;
      case 'scs':           return <SCSPanel />;
      case 'events':        return <PlaceholderPanel title="Events Management" />;
      case 'documents':     return <PlaceholderPanel title="Documents Management" />;
      case 'evaluations':   return <PlaceholderPanel title="Evaluations" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-white border-r border-gray-100 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-100">
          <p className="font-heading font-bold text-gray-900 text-sm">SSLG Dashboard</p>
          <p className="text-xs text-gray-400 mt-0.5">Officer Portal</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === item.id
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <RoleGuard requiredRole="super_admin">
          <div className="px-3 py-4 border-t border-gray-100">
            <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors">
              <Settings size={16} /> Admin Settings
            </button>
          </div>
        </RoleGuard>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {renderPanel()}
      </main>
    </div>
  );
}
