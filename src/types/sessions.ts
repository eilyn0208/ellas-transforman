// TODO: Replace mock data with Supabase queries
// Table references: sessions, bookings, roadmap_milestones, mentors

export type SessionType = "mentoring" | "cohort" | "workshop" | "office-hours";

export interface SessionEvent {
  id: string;
  type: SessionType;
  startTime: string; // "09:00"
  endTime: string;   // "10:00"
  dayOfWeek: number; // 0 = Monday … 6 = Sunday
  mentorName: string;
  mentorRole: string;
  mentorAvatar: string; // emoji (TODO: avatarUrl from Supabase Storage)
  description: string;
  zoomLink?: string;
  location?: string;
  hasMaterials?: boolean;
  // TODO: Supabase foreign keys
  mentorId?: string;  // → mentors.id
  bookingId?: string; // → bookings.id
}

export interface GoalAgendaItem {
  id: string;
  title: string;
  dueDateLabel: string; // e.g. "Vie"
  owner: string;
  progressPercent: number;
  progressNote: string;
  dayOfWeek: number;
  // TODO: Supabase FK
  milestoneId?: string; // → roadmap_milestones.id
}

export interface WeekDay {
  date: string;       // "2026-06-28"
  dayLabel: string;   // "Lun"
  dayNumber: number;  // 28
  dayOfWeek: number;  // 0–6
  isToday: boolean;
}

export interface WeekStats {
  sessionsCount: number;
  nextSessionLabel: string;   // "Mié 10:00"
  hoursTotal: number;
  hoursWeeklyTarget: number;
  activeGoalsCount: number;
  goalsDueThisWeek: number;
}
