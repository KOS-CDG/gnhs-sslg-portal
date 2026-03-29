// Organizations.tsx
import { useOrganizations } from '@/hooks/useOrganizations';
import { Badge } from '@/components/ui/Badge';
import { PageSpinner } from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';

export default function Organizations() {
  const { data: orgs, isLoading } = useOrganizations();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <p className="text-primary-500 text-sm font-medium uppercase tracking-widest mb-1">Directory</p>
        <h1 className="font-heading font-bold text-3xl text-gray-900">Student Organizations</h1>
        <p className="text-gray-500 text-sm mt-2">Accredited organizations under the SSLG.</p>
      </div>

      {isLoading ? <PageSpinner /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orgs?.map((org) => (
            <div key={org.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                {org.logoUrl ? (
                  <img src={org.logoUrl} alt={org.name} className="w-14 h-14 rounded-full object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-lg">{org.name[0]}</span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{org.name}</h3>
                  <Badge variant={org.status === 'accredited' ? 'success' : org.status === 'pending' ? 'warning' : 'danger'}>
                    {org.status}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4 line-clamp-3">{org.description}</p>
              <p className="text-xs text-gray-400">Accredited: {org.accreditedYear} · Renewal: {formatDate(new Date(org.renewalDate), 'MMM yyyy')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
