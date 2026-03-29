import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useSubmitEvaluation, useEvaluationInsights } from '@/hooks/useEvaluations';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { PageSpinner } from '@/components/ui/Spinner';
import { useUIStore } from '@/store/uiStore';

const evalSchema = z.object({
  type: z.enum(['event', 'organization']),
  targetName: z.string().min(2, 'Target name is required'),
  comments: z.string().min(10, 'Please provide at least 10 characters'),
  overallRating: z.coerce.number().min(1).max(5),
  organizationRating: z.coerce.number().min(1).max(5),
  relevanceRating: z.coerce.number().min(1).max(5),
});
type EvalForm = z.infer<typeof evalSchema>;

const COLORS = ['#E91E8C', '#C0392B', '#f59e0b', '#10b981', '#3b82f6'];

export default function Evaluations() {
  const { mutateAsync, isPending } = useSubmitEvaluation();
  const { data: insights, isLoading: loadingInsights } = useEvaluationInsights();
  const addToast = useUIStore((s) => s.addToast);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EvalForm>({
    resolver: zodResolver(evalSchema),
    defaultValues: { type: 'event' },
  });

  const onSubmit = async (data: EvalForm) => {
    try {
      await mutateAsync({
        type: data.type,
        targetId: data.targetName.toLowerCase().replace(/\s+/g, '-'),
        targetName: data.targetName,
        submittedBy: 'current-user',
        ratings: {
          overall: data.overallRating,
          organization: data.organizationRating,
          relevance: data.relevanceRating,
        },
        comments: data.comments,
      });
      addToast('Evaluation submitted. Thank you!', 'success');
      reset();
    } catch {
      addToast('Submission failed. Please try again.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <p className="text-primary-500 text-sm font-medium uppercase tracking-widest mb-1">Feedback</p>
        <h1 className="font-heading font-bold text-3xl text-gray-900">Evaluations</h1>
        <p className="text-gray-500 text-sm mt-2">Rate events and organizations to help improve SSLG programs.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-5">Submit an Evaluation</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Select
                label="Evaluation Type"
                required
                options={[{ value: 'event', label: 'Event' }, { value: 'organization', label: 'Organization' }]}
                {...register('type')}
              />
              <Input label="Event / Organization Name" required error={errors.targetName?.message} {...register('targetName')} />

              <div className="grid grid-cols-3 gap-3">
                <Input label="Overall (1-5)" type="number" min={1} max={5} required error={errors.overallRating?.message} {...register('overallRating')} />
                <Input label="Organization (1-5)" type="number" min={1} max={5} required error={errors.organizationRating?.message} {...register('organizationRating')} />
                <Input label="Relevance (1-5)" type="number" min={1} max={5} required error={errors.relevanceRating?.message} {...register('relevanceRating')} />
              </div>

              <Textarea label="Comments" required error={errors.comments?.message} {...register('comments')} placeholder="Share your feedback…" />
              <Button type="submit" loading={isPending} className="w-full">Submit Evaluation</Button>
            </form>
          </div>
        </div>

        {/* Insights — officer only */}
        <RoleGuard requiredRole="officer">
          <div>
            <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <BarChart2 size={18} className="text-primary-500" /> Data Insights
            </h2>
            {loadingInsights ? (
              <PageSpinner />
            ) : insights ? (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-sm font-medium text-gray-700 mb-4">Average Ratings by Category</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={insights.averages ?? []}>
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#E91E8C" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-sm font-medium text-gray-700 mb-4">Submissions by Type</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={insights.byType ?? []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                        {(insights.byType ?? []).map((_: unknown, i: number) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No evaluation data yet.</p>
            )}
          </div>
        </RoleGuard>
      </div>
    </div>
  );
}
