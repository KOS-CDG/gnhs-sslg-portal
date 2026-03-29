export type DocumentCategory =
  | 'Resolution'
  | 'Excuse Letter'
  | 'Approval'
  | 'Activity Design'
  | 'Accomplishment Report'
  | 'Financial Report'
  | 'Publication';

export interface SSLGDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  isPublic: boolean;
  createdAt: Date;
}
