import { Link } from 'react-router-dom';
import { CalendarDays, Users, MessageSquare, Bell, Trophy, Star } from 'lucide-react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageSpinner } from '@/components/ui/Spinner';
import { formatDate, timeAgo, truncate } from '@/lib/utils';

const CTA_CARDS = [
  {
    icon: <CalendarDays size={24} />,
    label: 'Event Registration',
    desc: 'Join upcoming school events',
    to: '/events',
    color: 'bg-primary-500',
  },
  {
    icon: <Users size={24} />,
    label: 'SCS Membership',
    desc: 'Apply for a committee',
    to: '/scs',
    color: 'bg-secondary-500',
  },
  {
    icon: <MessageSquare size={24} />,
    label: 'Submit Concern',
    desc: 'Reach out to the SSLG',
    to: '/services',
    color: 'bg-primary-600',
  },
  {
    icon: <Bell size={24} />,
    label: 'Announcements',
    desc: 'Stay up to date',
    to: '/announcements',
    color: 'bg-secondary-600',
  },
];

const PROGRAMS = [
  {
    title: 'Kadluan Blueprint',
    desc: 'A comprehensive roadmap for student development initiatives aligned with school and community goals.',
  },
  {
    title: 'Iskolar ng Bumaks',
    desc: 'Academic excellence program recognizing and supporting outstanding learners across all grade levels.',
  },
  {
    title: 'AI Integration Sessions',
    desc: 'Bridging technology and education through hands-on AI literacy workshops for students and teachers.',
  },
];

const ACCOMPLISHMENTS = [
  {
    name: 'Justine',
    award: 'Learners Converge Best Project Proposal',
    detail: 'Junior Governor',
    icon: <Trophy size={20} className="text-yellow-500" />,
  },
  {
    name: 'Josh',
    award: 'Iskolar ng Bumaka 2025',
    detail: '3rd Most Outstanding SSLG Project — Quezon Province',
    icon: <Star size={20} className="text-primary-500" />,
  },
  {
    name: 'Elijah',
    award: '2022 3rd Most Outstanding SSG Student Leader',
    detail: 'Quezon Province',
    icon: <Trophy size={20} className="text-secondary-500" />,
  },
];

export default function Home() {
  const { data: announcements, isLoading } = useAnnouncements();
  const recent = announcements?.slice(0, 4) ?? [];

  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_white_0%,_transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-primary-100 text-sm font-medium uppercase tracking-widest mb-3">
              Gumaca National High School
            </p>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-5">
              Supreme Secondary<br />Learner Government
            </h1>
            <p className="text-xl text-primary-100 italic mb-8">
              "Happy, Ready, and Willing to Serve"
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/about"
                className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
              >
                Learn About SSLG
              </Link>
              <Link
                to="/officers"
                className="px-6 py-3 border border-white/50 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Meet the Officers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Access ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CTA_CARDS.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className={`${c.color} text-white rounded-xl p-5 flex flex-col gap-3 hover:opacity-90 transition-opacity shadow-md`}
            >
              <div className="bg-white/20 rounded-lg w-10 h-10 flex items-center justify-center">
                {c.icon}
              </div>
              <div>
                <p className="font-semibold text-sm">{c.label}</p>
                <p className="text-xs text-white/80 mt-0.5">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Announcements ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading font-bold text-2xl text-gray-900">Latest Announcements</h2>
            <p className="text-gray-500 text-sm mt-1">Stay informed on school updates</p>
          </div>
          <Link to="/announcements" className="text-primary-500 text-sm font-medium hover:underline">
            View all →
          </Link>
        </div>

        {isLoading ? (
          <PageSpinner />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recent.map((ann) => (
              <Card key={ann.id} hover>
                <CardBody>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="primary">{ann.category}</Badge>
                    {ann.isPinned && <Badge variant="danger">Pinned</Badge>}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                    {ann.title}
                  </h3>
                  <p className="text-gray-500 text-xs line-clamp-3 mb-3">
                    {truncate(ann.content, 120)}
                  </p>
                  <p className="text-xs text-gray-400">{timeAgo(new Date(ann.createdAt))}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ── Featured Programs ─────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading font-bold text-2xl text-gray-900 mb-2">Featured Programs</h2>
          <p className="text-gray-500 text-sm mb-8">Key initiatives of the SSLG this term</p>
          <div className="grid md:grid-cols-3 gap-6">
            {PROGRAMS.map((p) => (
              <Card key={p.title}>
                <CardBody>
                  <div className="w-2 h-2 rounded-full bg-primary-500 mb-3" />
                  <h3 className="font-heading font-bold text-gray-900 mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-600">{p.desc}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Accomplishments ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <h2 className="font-heading font-bold text-2xl text-gray-900 mb-2">
          Featured Accomplishments
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Proud achievements of our students and officers
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {ACCOMPLISHMENTS.map((a) => (
            <Card key={a.name} className="border-l-4 border-l-primary-500">
              <CardBody className="flex gap-4">
                <div className="bg-gray-50 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                  {a.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{a.name}</p>
                  <p className="text-sm text-primary-600 font-medium mt-0.5">{a.award}</p>
                  <p className="text-xs text-gray-500 mt-1">{a.detail}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
