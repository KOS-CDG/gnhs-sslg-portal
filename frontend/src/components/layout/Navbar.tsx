import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Officers', to: '/officers' },
  { label: 'Announcements', to: '/announcements' },
  { label: 'Events', to: '/events' },
  {
    label: 'Programs',
    children: [
      { label: 'SCS', to: '/scs' },
      { label: 'Services', to: '/services' },
      { label: 'Organizations', to: '/organizations' },
      { label: 'Documents', to: '/documents' },
      { label: 'Evaluations', to: '/evaluations' },
    ],
  },
  { label: 'History', to: '/history' },
  { label: 'Contact', to: '/contact' },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-white font-heading font-bold text-sm">GN</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-heading font-bold text-gray-900 leading-tight text-sm">
                GNHS SSLG
              </p>
              <p className="text-xs text-gray-500 leading-tight">Student Government</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex items-center gap-1 px-3 py-2 rounded-md text-sm text-gray-700 hover:text-primary-500 hover:bg-primary-50 transition-colors"
                  >
                    {link.label}
                    <ChevronDown size={14} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50">
                      {link.children.map((child) => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          onClick={() => setDropdownOpen(false)}
                          className={({ isActive }) =>
                            cn(
                              'block px-4 py-2 text-sm transition-colors',
                              isActive
                                ? 'text-primary-500 bg-primary-50'
                                : 'text-gray-700 hover:text-primary-500 hover:bg-primary-50'
                            )
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to!}
                  className={({ isActive }) =>
                    cn(
                      'px-3 py-2 rounded-md text-sm transition-colors',
                      isActive
                        ? 'text-primary-500 font-medium bg-primary-50'
                        : 'text-gray-700 hover:text-primary-500 hover:bg-primary-50'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              )
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <RoleGuard requiredRole="officer">
                  <Link
                    to="/dashboard"
                    className="px-3 py-2 text-sm text-gray-700 hover:text-primary-500 transition-colors"
                  >
                    Dashboard
                  </Link>
                </RoleGuard>
                <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                      <User size={14} className="text-primary-600" />
                    </div>
                    <span className="text-sm text-gray-700 max-w-[120px] truncate">
                      {user.displayName}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-gray-500 hover:text-secondary-500 transition-colors"
                    title="Sign out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.flatMap((link) =>
            link.children
              ? link.children.map((c) => (
                  <NavLink
                    key={c.to}
                    to={c.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'block px-3 py-2 rounded-md text-sm',
                        isActive
                          ? 'text-primary-500 bg-primary-50 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      )
                    }
                  >
                    {link.label} › {c.label}
                  </NavLink>
                ))
              : [
                  <NavLink
                    key={link.to}
                    to={link.to!}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'block px-3 py-2 rounded-md text-sm',
                        isActive
                          ? 'text-primary-500 bg-primary-50 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      )
                    }
                  >
                    {link.label}
                  </NavLink>,
                ]
          )}
          <div className="pt-2 border-t border-gray-100">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-secondary-500"
              >
                <LogOut size={15} /> Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg text-center"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
