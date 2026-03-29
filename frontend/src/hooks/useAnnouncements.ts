import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementsApi } from '@/lib/api';
import type { Announcement, AnnouncementCategory } from '@/types';

export function useAnnouncements(category?: AnnouncementCategory) {
  return useQuery({
    queryKey: ['announcements', category],
    queryFn: async () => {
      const res = await announcementsApi.getAll();
      let data: Announcement[] = res.data;
      if (category) data = data.filter((a) => a.category === category);
      // Pinned first, then by date
      return data.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    },
  });
}

export function useCreateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) =>
      announcementsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['announcements'] }),
  });
}

export function useUpdateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Announcement> }) =>
      announcementsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['announcements'] }),
  });
}

export function useDeleteAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => announcementsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['announcements'] }),
  });
}
