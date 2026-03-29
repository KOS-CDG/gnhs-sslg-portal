import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsApi } from '@/lib/api';
import type { LearnerRequest, RequestStatus } from '@/types';

export function useRequests() {
  return useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const res = await requestsApi.getAll();
      return res.data as LearnerRequest[];
    },
  });
}

export function useSubmitRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<LearnerRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) =>
      requestsApi.submit(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['requests'] }),
  });
}

export function useUpdateRequestStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: RequestStatus;
      notes?: string;
    }) => requestsApi.updateStatus(id, { status, notes }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['requests'] }),
  });
}
