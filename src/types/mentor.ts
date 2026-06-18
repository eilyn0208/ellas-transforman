export type MenteeStatus = "on-track" | "needs-attention" | "at-risk";

export interface MenteeNextSession {
  dateLabel: string;
  topicLabel: string;
}

export interface MenteeSummaryCard {
  id: string;
  name: string;
  avatar: string;
  professionalGoal: string;
  industry: string;
  roadmapStage: number;
  roadmapTotalStages: number;
  roadmapProgressPercent: number;
  nextSession: MenteeNextSession | null;
  sessionCount: number;
  lastContactLabel: string;
  status: MenteeStatus;
  aiPrepSummary: string;
}

export interface MentorBadge {
  id: string;
  emoji: string;
  title: string;
  description: string;
  earnedAt: string;
}

export interface MentorCertification {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  badge: string;
}

export interface MenteeAchievement {
  id: string;
  menteeId: string;
  menteeName: string;
  menteeAvatar: string;
  achievement: string;
  dateLabel: string;
}

export interface MentorLevel {
  current: string;
  currentEmoji: string;
  points: number;
  nextLevel: string;
  pointsToNext: number;
  progressPercent: number;
}

export interface MentorImpactFullData {
  totalSessions: number;
  totalHours: number;
  menteesActive: number;
  menteesGraduated: number;
  avgRating: number;
  level: MentorLevel;
  badges: MentorBadge[];
  certifications: MentorCertification[];
  menteeAchievements: MenteeAchievement[];
  growthTrend: number[];
  growthTrendLabel: string;
  aiRecommendation: string;
}
