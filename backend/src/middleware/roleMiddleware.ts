import type { Request, Response, NextFunction } from 'express';
import type { UserRole } from '../../../frontend/src/types/user';

const ROLE_HIERARCHY: Record<UserRole, number> = {
  public:      0,
  student:     1,
  officer:     2,
  super_admin: 3,
};

export function requireRole(minRole: UserRole) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    if (ROLE_HIERARCHY[user.role] < ROLE_HIERARCHY[minRole]) {
      res.status(403).json({ message: 'Insufficient permissions.' });
      return;
    }

    next();
  };
}
