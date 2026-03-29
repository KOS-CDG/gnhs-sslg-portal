import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  HandCoins, CalendarPlus, FileCheck, DoorOpen, MessageSquareHeart, ClipboardList,
} from 'lucide-react';
import { useSubmitRequest } from '@/hooks/useRequests';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { useUIStore } from '@/store/uiStore';
import type { RequestType } from '@/types';

const SERVICE_CARDS = [
  { type: 'financial_assistance' as RequestType, icon: <HandCoins size={22} />, label: 'Financial Assistance', desc: 'Apply for emergency or academic financial support.' },
  { type: 'event_support' as RequestType, icon: <CalendarPlus size={22} />, label: 'Event Support', desc: 'Request SSLG support for your class or org event.' },
  { type: 'document_request' as RequestType, icon: <FileCheck size={22} />, label: 'Document Request', desc: 'Request official letters, certifications, or permits.' },
  { type: 'office_usage' as RequestType, icon: <DoorOpen size={22} />, label: 'SSLG Office Usage', desc: 'Reserve the SSLG office for meetings or activities.' },
  { type: 'feedback' as RequestType, icon: <MessageSquareHeart size={22} />, label: 'Feedback / Suggestion', desc: 'Share your ideas or feedback with the SSLG.' },
  { type: 'concern' as RequestType, icon: <ClipboardList size={22} />, label: 'Submit a Concern', desc: 'Report a concern anonymously or with your name.' },
];

const requestSchema = z.object({
  name: z.string().optional(),
  gradeSection: z.string().optional(),
  message: z.string().min(10, 'Please provide more detail (at least 10 characters)'),
  isAnonymous: z.boolean(),
});
type RequestForm = z.infer<typeof requestSchema>;

function RequestModal({ type, onClose }: { type: RequestType; onClose: () => void }) {
  const card = SERVICE_CARDS.find((c) => c.type === type)!;
  const { mutateAsync, isPending } = useSubmitRequest();
  const addToast = useUIStore((s) => s.addToast);

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<RequestForm>({
    resolver: zodResolver(requestSchema),
    defaultValues: { isAnonymous: false },
  });

  const isAnonymous = watch('isAnonymous');

  const onSubmit = async (data: RequestForm) => {
    try {
      await mutateAsync({
        type,
        submittedBy: data.isAnonymous ? 'anonymous' : (data.name ?? 'unknown'),
        name: data.isAnonymous ? undefined : data.name,
        gradeSection: data.isAnonymous ? undefined : data.gradeSection,
        message: data.message,
        isAnonymous: data.isAnonymous,
      });
      addToast('Request submitted successfully!', 'success');
      reset();
      onClose();
    } catch {
      addToast('Failed to submit. Please try again.', 'error');
    }
  };

  return (
    <Modal open onClose={onClose} title={card.label} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input type="checkbox" {...register('isAnonymous')} className="rounded text-primary-500" />
          Submit anonymously
        </label>

        {!isAnonymous && (
          <>
            <Input label="Full Name" {...register('name')} placeholder="Your name" />
            <Input label="Grade & Section" {...register('gradeSection')} placeholder="e.g. Grade 11 — ABM A" />
          </>
        )}

        <Textarea
          label="Details / Message"
          required
          error={errors.message?.message}
          {...register('message')}
          placeholder="Describe your request in detail…"
          rows={5}
        />

        <Button type="submit" loading={isPending} className="w-full">
          Submit Request
        </Button>
      </form>
    </Modal>
  );
}

export default function Services() {
  const [activeType, setActiveType] = useState<RequestType | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <p className="text-primary-500 text-sm font-medium uppercase tracking-widest mb-1">
          Support
        </p>
        <h1 className="font-heading font-bold text-3xl text-gray-900">Services</h1>
        <p className="text-gray-500 text-sm mt-2 max-w-lg">
          Request assistance, submit concerns, or give feedback. Anonymous submissions are available for sensitive concerns.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {SERVICE_CARDS.map((card) => (
          <button
            key={card.type}
            onClick={() => setActiveType(card.type)}
            className="text-left bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-primary-200 hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500 mb-4 group-hover:bg-primary-100 transition-colors">
              {card.icon}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{card.label}</h3>
            <p className="text-sm text-gray-500">{card.desc}</p>
          </button>
        ))}
      </div>

      {/* Officer Panel */}
      <RoleGuard requiredRole="officer">
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ClipboardList size={18} className="text-primary-500" />
            Request Tracking Panel
          </h2>
          <p className="text-sm text-gray-500">
            View and manage all submitted requests from this panel. (Officer-only)
          </p>
          {/* Full request table lives in Dashboard */}
        </div>
      </RoleGuard>

      {activeType && (
        <RequestModal type={activeType} onClose={() => setActiveType(null)} />
      )}
    </div>
  );
}
