import type { Request, Response, NextFunction } from 'express';
import { auth, db } from '../services/firestore';
import type { AppUser, UserRole } from '../../../frontend/src/types/user';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing or invalid authorization header.' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decoded = await auth().verifyIdToken(token);

    // Fetch role from Firestore
    const userDoc = await db().collection('users').doc(decoded.uid).get();
    const role: UserRole = userDoc.exists
      ? (userDoc.data()?.role ?? 'student')
      : 'student';

    req.user = {
      uid:         decoded.uid,
      displayName: decoded.name ?? '',
      email:       decoded.email ?? '',
      photoURL:    decoded.picture,
      role,
      createdAt:   new Date(),
    } as AppUser;

    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
}
