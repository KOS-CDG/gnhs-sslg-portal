import { useQuery } from '@tanstack/react-query';
import { fetchCollection, orderBy, COLLECTIONS } from '@/lib/firestore';
import { PageSpinner } from '@/components/ui/Spinner';
import type { HistoryMilestone, PastAdministration } from '@/types';

function useHistoryMilestones() {
  return useQuery({
    queryKey: ['history', 'milestones'],
    queryFn: () =>
      fetchCollection<HistoryMilestone>(COLLECTIONS.HISTORY_MILESTONES, [
        orderBy('year', 'asc'),
      ]),
  });
}

function usePastAdministrations() {
  return useQuery({
    queryKey: ['history', 'administrations'],
    queryFn: () =>
      fetchCollection<PastAdministration>(COLLECTIONS.PAST_ADMINISTRATIONS, [
        orderBy('year', 'desc'),
      ]),
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  founding:       'bg-secondary-500',
  achievement:    'bg-primary-500',
  program:        'bg-blue-500',
  administration: 'bg-green-600',
};

export default function History() {
  const { data: milestones, isLoading: loadingMilestones } = useHistoryMilestones();
  const { data: administrations, isLoading: loadingAdmin } = usePastAdministrations();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-14">
        <p className="text-primary-500 text-sm font-medium uppercase tracking-widest mb-1">
          Our Story
        </p>
        <h1 className="font-heading font-bold text-3xl text-gray-900">History & Milestones</h1>
        <p className="text-gray-500 text-sm mt-2 max-w-lg">
          A look back at the founding, growth, and achievements of the GNHS SSLG through the years.
        </p>
      </div>

      {/* Timeline */}
      <section className="mb-20">
        <h2 className="font-heading font-bold text-2xl text-gray-900 mb-8">Timeline</h2>
        {loadingMilestones ? (
          <PageSpinner />
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

            <div className="space-y-8">
              {milestones?.map((m) => (
                <div key={m.id} className="relative flex gap-6 pl-16">
                  {/* Dot */}
                  <div
                    className={`absolute left-4 top-1.5 w-4 h-4 rounded-full border-2 border-white ring-2 ring-gray-200 ${CATEGORY_COLORS[m.category] ?? 'bg-gray-400'}`}
                  />
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-2xl font-heading font-bold text-primary-500">
                        {m.year}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full text-white font-medium capitalize ${CATEGORY_COLORS[m.category] ?? 'bg-gray-400'}`}
                      >
                        {m.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{m.title}</h3>
                    <p className="text-sm text-gray-500">{m.description}</p>
                    {m.imageUrl && (
                      <img
                        src={m.imageUrl}
                        alt={m.title}
                        className="mt-3 rounded-lg w-full max-w-sm object-cover h-40"
                      />
                    )}
                  </div>
                </div>
              ))}
              {!milestones?.length && (
                <p className="text-gray-400 text-sm pl-4">No milestones added yet.</p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Past Administrations */}
      <section>
        <h2 className="font-heading font-bold text-2xl text-gray-900 mb-8">
          Past Administrations
        </h2>
        {loadingAdmin ? (
          <PageSpinner />
        ) : (
          <div className="space-y-5">
            {administrations?.map((admin) => (
              <div
                key={admin.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-gray-900 text-lg">
                    S.Y. {admin.year}
                  </h3>
                  {admin.photoUrl && (
                    <img
                      src={admin.photoUrl}
                      alt={`S.Y. ${admin.year} administration`}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Officers
                    </p>
                    <ul className="space-y-1">
                      {admin.officers.map((o) => (
                        <li key={o.name} className="text-sm text-gray-700">
                          <span className="font-medium">{o.name}</span>
                          <span className="text-gray-400"> — {o.position}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Key Accomplishments
                    </p>
                    <ul className="space-y-1">
                      {admin.accomplishments.map((acc, i) => (
                        <li key={i} className="text-sm text-gray-600 flex gap-2">
                          <span className="text-primary-400 mt-1">•</span> {acc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
            {!administrations?.length && (
              <p className="text-gray-400 text-sm">No past administration records yet.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
