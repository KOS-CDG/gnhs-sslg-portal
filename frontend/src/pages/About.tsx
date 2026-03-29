import { Card, CardBody } from '@/components/ui/Card';
import { BookOpen, Shield, Users, Star } from 'lucide-react';

const PILLARS = [
  { icon: <BookOpen size={20} />, title: 'Academic Excellence', desc: 'Supporting learners through programs that foster academic achievement and intellectual growth.' },
  { icon: <Shield size={20} />, title: 'Student Welfare', desc: 'Advocating for the rights and well-being of every learner in Gumaca NHS.' },
  { icon: <Users size={20} />, title: 'Inclusive Leadership', desc: 'Building a culture of participation, representation, and collaborative decision-making.' },
  { icon: <Star size={20} />, title: 'Community Service', desc: 'Extending our mission beyond school walls through outreach and engagement.' },
];

const PPAS = [
  { label: 'Iskolar ng Bumaks', category: 'Academic' },
  { label: 'Kadluan Blueprint', category: 'Development' },
  { label: 'AI Integration Sessions', category: 'Technology' },
  { label: 'Sports Festivals', category: 'Sports & Health' },
  { label: 'Cultural Showcases', category: 'Cultural' },
  { label: 'Environmental Brigades', category: 'Environment' },
];

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="max-w-3xl mb-14">
        <p className="text-primary-500 text-sm font-medium uppercase tracking-widest mb-2">
          Who We Are
        </p>
        <h1 className="font-heading font-bold text-4xl text-gray-900 mb-4">
          About the SSLG
        </h1>
        <p className="text-2xl text-primary-500 italic font-heading mb-6">
          "Happy, Ready, and Willing to Serve"
        </p>
        <p className="text-gray-600 leading-relaxed">
          The Supreme Secondary Learner Government (SSLG) of Gumaca National High School is
          the highest student governing body, elected by the student body to represent their
          interests, facilitate school programs, and champion holistic development across all
          grade levels.
        </p>
      </div>

      {/* Role Section */}
      <section className="mb-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="font-heading font-bold text-2xl text-gray-900 mb-4">
            Our Role at Gumaca NHS
          </h2>
          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <p>
              Gumaca NHS has long been a cornerstone of secondary education in Quezon Province.
              The SSLG works hand-in-hand with school administration, teachers, and community
              stakeholders to create an environment where every learner thrives.
            </p>
            <p>
              We implement Programs, Projects, and Activities (PPAs) that address academic,
              cultural, environmental, and social dimensions of student life — ensuring that
              education extends beyond the classroom.
            </p>
            <p>
              The SSLG also serves as the official liaison between the student body and school
              governance, ensuring that student voices are heard in decisions that affect their
              education and well-being.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {PILLARS.map((p) => (
            <Card key={p.title}>
              <CardBody>
                <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500 mb-3">
                  {p.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{p.title}</h3>
                <p className="text-xs text-gray-500">{p.desc}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* PPAs */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <h2 className="font-heading font-bold text-2xl text-gray-900 mb-2">
          Programs, Projects & Activities
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Key PPAs that define our term's impact
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PPAS.map((ppa) => (
            <div
              key={ppa.label}
              className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-gray-100"
            >
              <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">{ppa.label}</p>
                <p className="text-xs text-gray-400">{ppa.category}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
