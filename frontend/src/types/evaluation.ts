export type EvaluationType = 'event' | 'organization';

export interface Evaluation {
  id: string;
  type: EvaluationType;
  targetId: string;
  targetName: string;
  submittedBy: string;
  ratings: Record<string, number>;
  comments: string;
  attachmentUrl?: string;
  submittedAt: Date;
}
