import { useQuery } from '@tanstack/react-query';
import { fetchCollection, orderBy } from '@/lib/firestore';
import { COLLECTIONS } from '@/lib/firestore';
import type { Officer } from '@/types';

export function useOfficers(termYear?: string) {
  return useQuery({
    queryKey: ['officers', termYear],
    queryFn: async () => {
      const officers = await fetchCollection<Officer>(COLLECTIONS.OFFICERS, [
        orderBy('order', 'asc'),
      ]);
      if (termYear) return officers.filter((o) => o.termYear === termYear);
      return officers;
    },
  });
}
