import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { AppUser, UserRole } from '@/types';

interface AuthContextValue {
  user: AppUser | null;
  firebaseUser: User | null;
  loading: boolean;
  isOfficer: boolean;
  isAdmin: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ROLE_HIERARCHY: Record<UserRole, number> = {
  public: 0,
  student: 1,
  officer: 2,
  super_admin: 3,
};

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Fetch or create the user's Firestore profile
      const userRef = doc(db, 'users', fbUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUser({
          uid: fbUser.uid,
          displayName: data.displayName ?? fbUser.displayName ?? '',
          email: data.email ?? fbUser.email ?? '',
          photoURL: data.photoURL ?? fbUser.photoURL ?? undefined,
          role: data.role ?? 'student',
          gradeSection: data.gradeSection,
          organization: data.organization,
          createdAt: (data.createdAt as Timestamp).toDate(),
        });
      } else {
        // First-time login — create a default student profile
        const newUser: Omit<AppUser, 'uid'> = {
          displayName: fbUser.displayName ?? '',
          email: fbUser.email ?? '',
          photoURL: fbUser.photoURL ?? undefined,
          role: 'student',
          createdAt: new Date(),
        };
        await setDoc(userRef, { ...newUser, createdAt: Timestamp.now() });
        setUser({ uid: fbUser.uid, ...newUser });
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const isOfficer = user ? hasRole(user.role, 'officer') : false;
  const isAdmin = user ? hasRole(user.role, 'super_admin') : false;

  return (
    <AuthContext.Provider
      value={{ user, firebaseUser, loading, isOfficer, isAdmin, loginWithEmail, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
