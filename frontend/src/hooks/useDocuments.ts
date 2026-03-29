import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '@/lib/api';
import type { SSLGDocument, DocumentCategory } from '@/types';

export function useDocuments(category?: DocumentCategory) {
  return useQuery({
    queryKey: ['documents', category],
    queryFn: async () => {
      const res = await documentsApi.getAll();
      let data: SSLGDocument[] = res.data;
      if (category) data = data.filter((d) => d.category === category);
      return data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
  });
}

export function useUploadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => documentsApi.upload(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }),
  });
}
