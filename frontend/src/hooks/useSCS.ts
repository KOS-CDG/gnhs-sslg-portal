import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scsApi } from '@/lib/api';
import type { SCSMember } from '@/types';

export function useSCSMembers() {
  return useQuery({
    queryKey: ['scs', 'members'],
    queryFn: async () => {
      const res = await scsApi.getMembers();
      return res.data as SCSMember[];
    },
  });
}

export function useApplyToSCS() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Pick<SCSMember, 'fullName' | 'gradeSection' | 'committee' | 'skills' | 'interests'>
    ) => scsApi.apply(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['scs'] }),
  });
}
