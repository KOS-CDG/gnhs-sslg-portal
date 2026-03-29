import { useAuth } from '@/context/AuthContext';
import { hasRole } from '@/context/AuthContext';
import type { UserRole } from '@/types';

interface RoleGuardProps {
  requiredRole: UserRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Conditionally renders children based on the user's role.
 * Does NOT redirect — use ProtectedRoute for that.
 */
export function RoleGuard({ requiredRole, children, fallback = null }: RoleGuardProps) {
  const { user } = useAuth();
  if (!user || !hasRole(user.role, requiredRole)) return <>{fallback}</>;
  return <>{children}</>;
}
