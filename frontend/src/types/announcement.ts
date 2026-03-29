export type AnnouncementCategory =
  | 'Events'
  | 'Deadlines'
  | 'Notices'
  | 'Resolutions'
  | 'Memorandums'
  | 'Activities';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  isPinned: boolean;
  attachmentUrl?: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}
