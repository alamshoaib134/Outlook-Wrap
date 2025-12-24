// Microsoft Graph API Types
export interface UserProfile {
  displayName: string;
  mail: string;
  jobTitle?: string;
  photo?: string;
}

export interface EmailStats {
  sent: number;
  received: number;
  topRecipients: ContactCount[];
  topSenders: ContactCount[];
  busiestDay: string;
  busiestMonth: string;
  emailsByMonth: MonthlyCount[];
  emailsByDayOfWeek: DayCount[];
}

export interface ContactCount {
  name: string;
  email: string;
  count: number;
}

export interface MonthlyCount {
  month: string;
  count: number;
}

export interface DayCount {
  day: string;
  count: number;
}

export interface CalendarStats {
  totalMeetings: number;
  totalHours: number;
  busiestDay: string;
  busiestMonth: string;
  topAttendees: ContactCount[];
  meetingsByMonth: MonthlyCount[];
  averageMeetingDuration: number;
  longestMeeting: {
    subject: string;
    duration: number;
  };
}

export interface GroupStats {
  totalGroups: number;
  groups: GroupInfo[];
}

export interface GroupInfo {
  id: string;
  displayName: string;
  description?: string;
}

export interface PeopleStats {
  topCollaborators: CollaboratorInfo[];
}

export interface CollaboratorInfo {
  displayName: string;
  jobTitle?: string;
  department?: string;
  userPrincipalName?: string;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
}

export interface WrapData {
  user: UserProfile;
  email: EmailStats;
  calendar: CalendarStats;
  groups: GroupStats;
  people: PeopleStats;
  tasks: TaskStats;
  year: number;
}

