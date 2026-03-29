import { useState } from 'react';
import { CalendarDays, MapPin, Users, ExternalLink } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpcomingEvents, usePastEvents, useRegisterForEvent } from '@/hooks/useEvents';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageSpinner } from '@/components/ui/Spinner';
import { useUIStore } from '@/store/uiStore';
import { formatDate } from '@/lib/utils';
import type { SSLGEvent } from '@/types';

const registrationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  gradeSection: z.string().min(2, 'Grade & section is required'),
  contact: z.string().min(7, 'Valid contact number required'),
  organization: z.string().optional(),
});
type RegistrationForm = z.infer<typeof registrationSchema>;

function EventCard({ event, onRegister }: { event: SSLGEvent; onRegister: () => void }) {
  const statusColor: Record<string, string> = {
    upcoming: 'bg-blue-100 text-blue-700',
    ongoing: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-gray-900">{event.title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColor[event.status]}`}>
          {event.status}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{event.description}</p>
      <div className="space-y-1.5 text-xs text-gray-400 mb-4">
        <p className="flex items-center gap-1.5">
          <CalendarDays size={13} /> {formatDate(new Date(event.dateTime), 'MMMM d, yyyy · h:mm a')}
        </p>
        <p className="flex items-center gap-1.5">
          <MapPin size={13} /> {event.location}
        </p>
        <p className="flex items-center gap-1.5">
          <Users size={13} /> {event.currentParticipants}
          {event.maxParticipants ? ` / ${event.maxParticipants}` : ''} registered
        </p>
      </div>
      {event.registrationOpen && event.status === 'upcoming' && (
        <Button size="sm" onClick={onRegister} className="w-full">
          Register Now
        </Button>
      )}
      {event.reportUrl && (
        <a
          href={event.reportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-primary-500 hover:underline mt-2"
        >
          <ExternalLink size={12} /> View Report
        </a>
      )}
    </div>
  );
}

function RegistrationModal({
  event,
  onClose,
}: {
  event: SSLGEvent;
  onClose: () => void;
}) {
  const { mutateAsync, isPending } = useRegisterForEvent();
  const addToast = useUIStore((s) => s.addToast);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegistrationForm>({ resolver: zodResolver(registrationSchema) });

  const onSubmit = async (data: RegistrationForm) => {
    try {
      await mutateAsync({ eventId: event.id, data });
      addToast('Registered successfully! Check your email for confirmation.', 'success');
      reset();
      onClose();
    } catch {
      addToast('Registration failed. Please try again.', 'error');
    }
  };

  return (
    <Modal open onClose={onClose} title={`Register for ${event.title}`} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Full Name" required error={errors.name?.message} {...register('name')} />
        <Input label="Grade & Section" required error={errors.gradeSection?.message} {...register('gradeSection')} placeholder="e.g. Grade 12 — STEM A" />
        <Input label="Contact Number" required error={errors.contact?.message} {...register('contact')} placeholder="09XXXXXXXXX" />
        <Input label="Organization (optional)" error={errors.organization?.message} {...register('organization')} />
        <Button type="submit" loading={isPending} className="w-full">
          Submit Registration
        </Button>
      </form>
    </Modal>
  );
}

export default function Events() {
  const { data: upcoming, isLoading: loadingUpcoming } = useUpcomingEvents();
  const { data: past, isLoading: loadingPast } = usePastEvents();
  const [registeringFor, setRegisteringFor] = useState<SSLGEvent | null>(null);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <p className="text-primary-500 text-sm font-medium uppercase tracking-widest mb-1">
          Calendar
        </p>
        <h1 className="font-heading font-bold text-3xl text-gray-900">Events</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-gray-200">
        {(['upcoming', 'past'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t} Events
          </button>
        ))}
      </div>

      {tab === 'upcoming' ? (
        loadingUpcoming ? (
          <PageSpinner />
        ) : upcoming?.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No upcoming events.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcoming?.map((e) => (
              <EventCard key={e.id} event={e} onRegister={() => setRegisteringFor(e)} />
            ))}
          </div>
        )
      ) : loadingPast ? (
        <PageSpinner />
      ) : past?.length === 0 ? (
        <p className="text-center text-gray-400 py-16">No past events yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {past?.map((e) => (
            <EventCard key={e.id} event={e} onRegister={() => setRegisteringFor(e)} />
          ))}
        </div>
      )}

      {registeringFor && (
        <RegistrationModal event={registeringFor} onClose={() => setRegisteringFor(null)} />
      )}
    </div>
  );
}
