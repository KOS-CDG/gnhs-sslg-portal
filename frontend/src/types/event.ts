export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface SSLGEvent {
  id: string;
  title: string;
  description: string;
  dateTime: Date;
  location: string;
  status: EventStatus;
  registrationOpen: boolean;
  maxParticipants?: number;
  currentParticipants: number;
  photos?: string[];
  reportUrl?: string;
  createdAt: Date;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  name: string;
  gradeSection: string;
  contact: string;
  organization?: string;
  registeredAt: Date;
}
