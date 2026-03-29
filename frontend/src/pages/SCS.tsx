import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApplyToSCS } from '@/hooks/useSCS';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { useUIStore } from '@/store/uiStore';
import type { SCSCommittee } from '@/types';

const COMMITTEES: SCSCommittee[] = [
  'Academic Affairs', 'Student Welfare', 'Cultural and Arts',
  'Sports and Health', 'Environment', 'Finance', 'Communications',
];

const COMMITTEE_DESC: Record<SCSCommittee, string> = {
  'Academic Affairs': 'Supports academic programs, tutorials, and learning initiatives.',
  'Student Welfare': 'Addresses learner needs, health, and social concerns.',
  'Cultural and Arts': 'Promotes cultural events, showcases, and artistic expression.',
  'Sports and Health': 'Organizes sports activities and promotes healthy lifestyles.',
  'Environment': 'Leads green programs and environmental awareness campaigns.',
  'Finance': 'Manages SSLG finances, budgeting, and financial reports.',
  'Communications': 'Handles publications, social media, and school announcements.',
};

const applySchema = z.object({
  fullName: z.string().min(2),
  gradeSection: z.string().min(2),
  committee: z.string().min(1, 'Select a committee'),
  skills: z.string().min(2, 'List at least one skill'),
  interests: z.string().min(2, 'List at least one interest'),
});
type ApplyForm = z.infer<typeof applySchema>;

export default function SCS() {
  const { mutateAsync, isPending } = useApplyToSCS();
  const addToast = useUIStore((s) => s.addToast);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ApplyForm>({
    resolver: zodResolver(applySchema),
  });

  const onSubmit = async (data: ApplyForm) => {
    try {
      await mutateAsync({
        fullName: data.fullName,
        gradeSection: data.gradeSection,
        committee: data.committee as SCSCommittee,
        skills: data.skills.split(',').map((s) => s.trim()),
        interests: data.interests.split(',').map((i) => i.trim()),
      });
      addToast('Application submitted successfully!', 'success');
      reset();
    } catch {
      addToast('Submission failed. Please try again.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <p className="text-primary-500 text-sm font-medium uppercase tracking-widest mb-1">Committees</p>
        <h1 className="font-heading font-bold text-3xl text-gray-900">Sectoral Committee System</h1>
        <p className="text-gray-500 text-sm mt-2 max-w-xl">
          The SCS empowers students to serve the school through specialized committees aligned with their skills and interests.
        </p>
      </div>

      {/* Committee Cards */}
      <section className="mb-14">
        <h2 className="font-semibold text-gray-900 mb-5">Our Committees</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {COMMITTEES.map((c) => (
            <Card key={c}>
              <CardBody>
                <div className="w-2 h-2 rounded-full bg-primary-500 mb-3" />
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{c}</h3>
                <p className="text-xs text-gray-500">{COMMITTEE_DESC[c]}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section className="max-w-xl">
        <h2 className="font-semibold text-gray-900 mb-5">Apply for Membership</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" required error={errors.fullName?.message} {...register('fullName')} />
            <Input label="Grade & Section" required error={errors.gradeSection?.message} {...register('gradeSection')} />
            <Select
              label="Preferred Committee"
              required
              error={errors.committee?.message}
              options={COMMITTEES.map((c) => ({ value: c, label: c }))}
              placeholder="Choose a committee…"
              {...register('committee')}
            />
            <Input
              label="Skills"
              required
              error={errors.skills?.message}
              {...register('skills')}
              placeholder="e.g. Writing, Design, Public Speaking"
              hint="Separate multiple skills with commas"
            />
            <Input
              label="Interests"
              required
              error={errors.interests?.message}
              {...register('interests')}
              placeholder="e.g. Environment, Sports, Technology"
              hint="Separate with commas"
            />
            <Button type="submit" loading={isPending} className="w-full">
              Submit Application
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
