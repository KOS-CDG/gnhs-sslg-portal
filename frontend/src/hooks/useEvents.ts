import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '@/lib/api';
import type { SSLGEvent, EventRegistration } from '@/types';

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await eventsApi.getAll();
      return res.data as SSLGEvent[];
    },
  });
}

export function useUpcomingEvents() {
  return useQuery({
    queryKey: ['events', 'upcoming'],
    queryFn: async () => {
      const res = await eventsApi.getAll();
      const all: SSLGEvent[] = res.data;
      return all
        .filter((e) => e.status === 'upcoming' || e.status === 'ongoing')
        .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    },
  });
}

export function usePastEvents() {
  return useQuery({
    queryKey: ['events', 'past'],
    queryFn: async () => {
      const res = await eventsApi.getAll();
      const all: SSLGEvent[] = res.data;
      return all
        .filter((e) => e.status === 'completed' || e.status === 'cancelled')
        .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    },
  });
}

export function useRegisterForEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: string;
      data: Omit<EventRegistration, 'id' | 'eventId' | 'registeredAt'>;
    }) => eventsApi.register(eventId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  });
}
