import { useState } from 'react';
import { Facebook, Mail } from 'lucide-react';
import { useOfficers } from '@/hooks/useOfficers';
import { Modal } from '@/components/ui/Modal';
import { PageSpinner } from '@/components/ui/Spinner';
import { getInitials } from '@/lib/utils';
import type { Officer } from '@/types';

function OfficerCard({ officer, onClick }: { officer: Officer; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
    >
      <div className="relative mb-4">
        {officer.photoUrl ? (
          <img
            src={officer.photoUrl}
            alt={officer.name}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-primary-100 group-hover:ring-primary-300 transition-all"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center ring-4 ring-primary-100 group-hover:ring-primary-300 transition-all">
            <span className="text-primary-600 font-heading font-bold text-2xl">
              {getInitials(officer.name)}
            </span>
          </div>
        )}
      </div>
      <h3 className="font-heading font-bold text-gray-900 text-base">{officer.name}</h3>
      <p className="text-primary-500 text-sm mt-1">{officer.position}</p>
      <p className="text-gray-400 text-xs mt-1">S.Y. {officer.termYear}</p>
    </button>
  );
}

function OfficerModal({ officer, onClose }: { officer: Officer; onClose: () => void }) {
  return (
    <Modal open onClose={onClose} title={officer.name} size="md">
      <div className="flex flex-col items-center text-center mb-6">
        {officer.photoUrl ? (
          <img
            src={officer.photoUrl}
            alt={officer.name}
            className="w-28 h-28 rounded-full object-cover ring-4 ring-primary-100 mb-4"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-primary-100 flex items-center justify-center mb-4">
            <span className="text-primary-600 font-heading font-bold text-3xl">
              {getInitials(officer.name)}
            </span>
          </div>
        )}
        <p className="text-primary-500 font-semibold">{officer.position}</p>
        <p className="text-gray-400 text-sm">S.Y. {officer.termYear}</p>
      </div>

      <div className="space-y-4 text-left">
        <div>
          <h4 className="font-semibold text-gray-900 text-sm mb-1">About</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{officer.bio}</p>
        </div>
        {officer.history && (
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">Background</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{officer.history}</p>
          </div>
        )}
        {officer.socialLinks && (
          <div className="flex gap-3 pt-2">
            {officer.socialLinks.facebook && (
              <a
                href={officer.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                <Facebook size={15} /> Facebook
              </a>
            )}
            {officer.socialLinks.email && (
              <a
                href={`mailto:${officer.socialLinks.email}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:underline"
              >
                <Mail size={15} /> Email
              </a>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function Officers() {
  const { data: officers, isLoading } = useOfficers();
  const [selected, setSelected] = useState<Officer | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <p className="text-primary-500 text-sm font-medium uppercase tracking-widest mb-2">
          Leadership
        </p>
        <h1 className="font-heading font-bold text-3xl text-gray-900">
          Meet the Officers
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Click on an officer card to learn more about them.
        </p>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {officers?.map((officer) => (
            <OfficerCard
              key={officer.id}
              officer={officer}
              onClick={() => setSelected(officer)}
            />
          ))}
        </div>
      )}

      {selected && (
        <OfficerModal officer={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
