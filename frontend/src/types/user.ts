export type UserRole = 'public' | 'student' | 'officer' | 'super_admin';

export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  gradeSection?: string;
  organization?: string;
  createdAt: Date;
}
