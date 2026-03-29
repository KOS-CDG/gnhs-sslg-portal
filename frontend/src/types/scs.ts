export type SCSCommittee =
  | 'Academic Affairs'
  | 'Student Welfare'
  | 'Cultural and Arts'
  | 'Sports and Health'
  | 'Environment'
  | 'Finance'
  | 'Communications';

export type SCSMemberStatus = 'active' | 'inactive' | 'probationary';

export interface AttendanceRecord {
  date: Date;
  present: boolean;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  assignedAt: Date;
}

export interface SCSMember {
  id: string;
  uid: string;
  fullName: string;
  gradeSection: string;
  committee: SCSCommittee;
  skills: string[];
  interests: string[];
  attendance: AttendanceRecord[];
  tasks: Task[];
  status: SCSMemberStatus;
  joinedAt: Date;
}
