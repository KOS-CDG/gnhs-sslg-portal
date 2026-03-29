import type { AppUser } from '../../frontend/src/types/user';

declare global {
  namespace Express {
    interface Request {
      user?: AppUser;
    }
  }
}

export {};
