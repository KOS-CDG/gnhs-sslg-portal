export type RequestType =
  | 'financial_assistance'
  | 'event_support'
  | 'document_request'
  | 'office_usage'
  | 'feedback'
  | 'concern';

export type RequestStatus =
  | 'pending'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'resolved';

export interface LearnerRequest {
  id: string;
  type: RequestType;
  submittedBy: string;
  name?: string;
  gradeSection?: string;
  message: string;
  attachmentUrl?: string;
  status: RequestStatus;
  handledBy?: string;
  notes?: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}
