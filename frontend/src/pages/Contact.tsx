import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Facebook, Mail, MessageSquare } from 'lucide-react';
import { contactApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { useUIStore } from '@/store/uiStore';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  gradeSection: z.string().min(2, 'Grade & section is required'),
  concernType: z.string().min(1, 'Please select a concern type'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
type ContactForm = z.infer<typeof contactSchema>;

const CONCERN_OPTIONS = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'academic', label: 'Academic Concern' },
  { value: 'event', label: 'Event Related' },
  { value: 'services', label: 'Services & Assistance' },
  { value: 'feedback', label: 'Feedback / Suggestion' },
  { value: 'other', label: 'Other' },
];

export default function Contact() {
  const addToast = useUIStore((s) => s.addToast);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactForm) => {
    try {
      await contactApi.send(data);
      addToast('Your message has been sent. We\'ll respond soon!', 'success');
      reset();
    } catch {
      addToast('Failed to send message. Please try again.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <p className="text-primary-500 text-sm font-medium uppercase tracking-widest mb-1">
          Get in Touch
        </p>
        <h1 className="font-heading font-bold text-3xl text-gray-900">Contact Us</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="font-semibold text-gray-900 mb-4">Reach the SSLG</h2>
            <div className="space-y-4">
              <a
                href="mailto:gumaca.nhs.sslg@gmail.com"
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-500 group-hover:bg-primary-200 transition-colors">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Email</p>
                  <p className="text-gray-500 text-sm">gumaca.nhs.sslg@gmail.com</p>
                </div>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 group-hover:bg-blue-200 transition-colors">
                  <Facebook size={18} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Facebook Page</p>
                  <p className="text-gray-500 text-sm">GNHS SSLG Official Page</p>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
            <div className="flex items-center gap-2 text-primary-600 font-semibold mb-2">
              <MessageSquare size={18} />
              Office Hours
            </div>
            <p className="text-sm text-gray-600">
              The SSLG Office is open during school days from <strong>7:00 AM – 5:00 PM</strong>.
              For urgent concerns, please message us on Facebook.
            </p>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Send a Message</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name & Section" required error={errors.name?.message} {...register('name')} placeholder="e.g. Juan Dela Cruz — Gr. 11 HUMSS A" />
            <Input label="Grade & Section" required error={errors.gradeSection?.message} {...register('gradeSection')} />
            <Select
              label="Concern Type"
              required
              error={errors.concernType?.message}
              options={CONCERN_OPTIONS}
              placeholder="Select concern type…"
              {...register('concernType')}
            />
            <Textarea
              label="Message"
              required
              error={errors.message?.message}
              {...register('message')}
              placeholder="Write your message here…"
              rows={5}
            />
            <Button type="submit" loading={isSubmitting} className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
