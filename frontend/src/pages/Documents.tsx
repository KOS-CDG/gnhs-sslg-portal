import { useState } from 'react';
import { Search, Download, Upload, FileText } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { PageSpinner } from '@/components/ui/Spinner';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { formatDate } from '@/lib/utils';
import type { DocumentCategory } from '@/types';

const CATEGORIES: DocumentCategory[] = [
  'Resolution', 'Excuse Letter', 'Approval', 'Activity Design',
  'Accomplishment Report', 'Financial Report', 'Publication',
];

export default function Documents() {
  const [category, setCategory] = useState<DocumentCategory | undefined>(undefined);
  const [search, setSearch] = useState('');
  const { data: documents, isLoading } = useDocuments(category);

  const filtered = (documents ?? []).filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-primary-500 text-sm font-medium uppercase tracking-widest mb-1">
            Repository
          </p>
          <h1 className="font-heading font-bold text-3xl text-gray-900">Documents</h1>
        </div>
        <RoleGuard requiredRole="officer">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors">
            <Upload size={15} /> Upload Document
          </button>
        </RoleGuard>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search documents…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={16} />}
          className="max-w-md"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCategory(undefined)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!category ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${category === cat ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex gap-4">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                <FileText size={18} className="text-primary-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">{doc.title}</h3>
                <Badge variant="default" className="mb-2">{doc.category}</Badge>
                <p className="text-xs text-gray-400">{formatDate(new Date(doc.createdAt))}</p>
              </div>
              {doc.isPublic && (
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start p-1.5 text-gray-400 hover:text-primary-500 transition-colors"
                  title="Download"
                >
                  <Download size={16} />
                </a>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-gray-400 py-16">No documents found.</p>
          )}
        </div>
      )}
    </div>
  );
}
