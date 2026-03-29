import { useState } from 'react';
import { Search, Pin, Paperclip } from 'lucide-react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { PageSpinner } from '@/components/ui/Spinner';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { formatDate, timeAgo, truncate } from '@/lib/utils';
import type { AnnouncementCategory } from '@/types';

const CATEGORIES: AnnouncementCategory[] = [
  'Events', 'Deadlines', 'Notices', 'Resolutions', 'Memorandums', 'Activities',
];

const CATEGORY_BADGE: Record<AnnouncementCategory, 'primary' | 'info' | 'warning' | 'default' | 'success' | 'danger'> = {
  Events: 'primary',
  Deadlines: 'danger',
  Notices: 'info',
  Resolutions: 'default',
  Memorandums: 'warning',
  Activities: 'success',
};

const ITEMS_PER_PAGE = 9;

export default function Announcements() {
  const [category, setCategory] = useState<AnnouncementCategory | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: announcements, isLoading } = useAnnouncements(category);

  const filtered = (announcements ?? []).filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase())
  );

  const pinned = filtered.filter((a) => a.isPinned);
  const regular = filtered.filter((a) => !a.isPinned);
  const paginated = regular.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = regular.length > paginated.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-primary-500 text-sm font-medium uppercase tracking-widest mb-1">
            Updates
          </p>
          <h1 className="font-heading font-bold text-3xl text-gray-900">Announcements</h1>
        </div>
        <RoleGuard requiredRole="officer">
          <button className="px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors">
            + New Announcement
          </button>
        </RoleGuard>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search announcements…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          leftIcon={<Search size={16} />}
          className="max-w-md"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => { setCategory(undefined); setPage(1); }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!category ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${category === cat ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : (
        <>
          {/* Pinned */}
          {pinned.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Pin size={14} /> Pinned
              </h2>
              <div className="space-y-3">
                {pinned.map((ann) => (
                  <div
                    key={ann.id}
                    className="bg-primary-50 border border-primary-100 rounded-xl px-5 py-4"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge variant={CATEGORY_BADGE[ann.category]}>{ann.category}</Badge>
                      <Badge variant="danger">Pinned</Badge>
                      <span className="text-xs text-gray-400 ml-auto">{timeAgo(new Date(ann.createdAt))}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mt-1">{ann.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{ann.content}</p>
                    {ann.attachmentUrl && (
                      <a
                        href={ann.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary-500 mt-2 hover:underline"
                      >
                        <Paperclip size={12} /> View attachment
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((ann) => (
              <div
                key={ann.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={CATEGORY_BADGE[ann.category]}>{ann.category}</Badge>
                  <span className="text-xs text-gray-400 ml-auto">{timeAgo(new Date(ann.createdAt))}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{ann.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-3">{truncate(ann.content, 150)}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">By {ann.authorName}</span>
                  {ann.attachmentUrl && (
                    <a
                      href={ann.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary-500 hover:underline"
                    >
                      <Paperclip size={11} /> Attachment
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-16">No announcements found.</p>
          )}

          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
