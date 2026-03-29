import { useQuery } from '@tanstack/react-query';
import { fetchCollection, where } from '@/lib/firestore';
import { COLLECTIONS } from '@/lib/firestore';
import type { StudentOrganization, OrgStatus } from '@/types';

export function useOrganizations(status?: OrgStatus) {
  return useQuery({
    queryKey: ['organizations', status],
    queryFn: async () => {
      const constraints = status ? [where('status', '==', status)] : [];
      return fetchCollection<StudentOrganization>(COLLECTIONS.ORGANIZATIONS, constraints);
    },
  });
}
