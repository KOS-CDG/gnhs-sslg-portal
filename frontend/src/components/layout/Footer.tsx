import { Link } from 'react-router-dom';
import { Facebook, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-white font-heading font-bold text-sm">GN</span>
              </div>
              <div>
                <p className="font-heading font-bold text-white text-sm leading-tight">
                  GNHS SSLG
                </p>
                <p className="text-xs text-gray-400 leading-tight">
                  Gumaca National High School
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 italic">
              "Happy, Ready, and Willing to Serve"
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-800 hover:bg-primary-500 transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href="mailto:gumaca.nhs.sslg@gmail.com"
                className="p-2 rounded-full bg-gray-800 hover:bg-primary-500 transition-colors"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                ['About SSLG', '/about'],
                ['Officers', '/officers'],
                ['Announcements', '/announcements'],
                ['Events', '/events'],
                ['Documents', '/documents'],
                ['Contact', '/contact'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-primary-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="text-primary-400 mt-0.5 shrink-0" />
                <span>Gumaca, Quezon Province, Philippines</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-primary-400 shrink-0" />
                <a
                  href="mailto:gumaca.nhs.sslg@gmail.com"
                  className="hover:text-primary-400 transition-colors"
                >
                  gumaca.nhs.sslg@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© {year} GNHS SSLG. All rights reserved.</p>
          <p>Supreme Secondary Learner Government</p>
        </div>
      </div>
    </footer>
  );
}
