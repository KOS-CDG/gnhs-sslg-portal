export interface HistoryMilestone {
  id: string;
  year: number;
  title: string;
  description: string;
  imageUrl?: string;
  category: 'founding' | 'achievement' | 'program' | 'administration';
}

export interface PastAdministration {
  id: string;
  year: string;
  officers: Array<{ name: string; position: string }>;
  accomplishments: string[];
  photoUrl?: string;
}
