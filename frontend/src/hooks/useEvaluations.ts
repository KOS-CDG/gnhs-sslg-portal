import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { evaluationsApi } from '@/lib/api';
import type { Evaluation } from '@/types';

export function useEvaluationInsights() {
  return useQuery({
    queryKey: ['evaluations', 'insights'],
    queryFn: async () => {
      const res = await evaluationsApi.getInsights();
      return res.data;
    },
  });
}

export function useSubmitEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Evaluation, 'id' | 'submittedAt'>) =>
      evaluationsApi.submit(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['evaluations'] }),
  });
}
