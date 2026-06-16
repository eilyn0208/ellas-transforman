export type MilestoneStatus =
  | "completed"
  | "in-progress"
  | "locked"
  | "upcoming"
  | "suggested";

export interface RecommendedAction {
  title: string;
  duration: string;
  ctaLabel: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  mentorName?: string;
  sessionInfo?: string;
  requiresInfo?: string;
  targetInfo?: string;
  estimatedTime?: string;
}

export interface Roadmap {
  progressPercent: number;
  progressSummary: string;
  completedCount: number;
  totalCount: number;
  updatedLabel: string;
  milestones: Milestone[];
  recommendedActions: RecommendedAction[];
}
