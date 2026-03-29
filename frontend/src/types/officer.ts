export interface Officer {
  id: string;
  name: string;
  position: string;
  photoUrl: string;
  bio: string;
  history: string;
  socialLinks?: {
    facebook?: string;
    email?: string;
  };
  termYear: string;
  order: number;
}
