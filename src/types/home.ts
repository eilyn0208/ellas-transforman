// ─── Shared ────────────────────────────────────────────────────────────────

export interface AINextAction {
  suggestion: string;
  ctaLabel: string;
  ctaRoute: string;
}

// ─── Mentee ────────────────────────────────────────────────────────────────

export interface UpcomingBookingSession {
  id: string;
  title: string;
  mentorName: string;
  mentorRole: string;
  mentorAvatar: string;
  dateLabel: string;   // "Mar, Jun 23"
  startTime: string;   // "10:00 AM"
  endTime: string;     // "11:00 AM"
  locationType: string; // "Online · 1:1"
  mentorId: string;
}

export interface ActiveGoalCard {
  id: string;
  title: string;
  description: string;
  progressPercent: number;
  icon: string;        // emoji
  iconBg: string;      // tailwind bg class
}

export interface MenteeGrowthStats {
  sessionsThisMonth: number;
  skillsGained: string[];
  chartDataByWeek: number[]; // 6 data points 0–100
  chartLabel: string;
}

export interface RoadmapSummary {
  pathTitle: string;
  currentStage: number;
  totalStages: number;
  completedItems: string[];
  inProgressItem: string;
}

export interface MenteeDashboardData {
  role: "mentee";
  userName: string;
  sessionMilestoneCount: number;
  motivationalQuote: string;
  upcomingSession: UpcomingBookingSession | null;
  activeGoals: ActiveGoalCard[];
  growthStats: MenteeGrowthStats;
  roadmapSummary: RoadmapSummary;
  aiAction: AINextAction;
}

// ─── Mentor ────────────────────────────────────────────────────────────────

export interface UpcomingMenteeSession {
  id: string;
  title: string;
  menteeName: string;
  menteeAvatar: string;
  menteeGoal: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  locationType: string;
  menteeId: string;
}

export interface MenteeProgressCard {
  id: string;
  name: string;
  avatar: string;
  goal: string;
  progressPercent: number;
  lastActivityLabel: string;
  needsAttention: boolean;
}

export interface MentorImpactStats {
  sessionsGiven: number;
  totalHours: number;
  menteesActive: number;
  chartDataByWeek: number[];
  chartLabel: string;
}

export interface MentorProgramCard {
  title: string;
  currentStage: number;
  totalStages: number;
  nextMilestone: string;
  menteesEnrolled: number;
}

export interface MentorDashboardData {
  role: "mentor";
  userName: string;
  sessionMilestoneCount: number;
  upcomingSession: UpcomingMenteeSession | null;
  activeMentees: MenteeProgressCard[];
  impactStats: MentorImpactStats;
  programProgress: MentorProgramCard;
  aiAction: AINextAction;
}

export type HomeDashboardData = MenteeDashboardData | MentorDashboardData;
