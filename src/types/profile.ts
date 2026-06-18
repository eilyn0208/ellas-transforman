export type UserRole = "mentee" | "mentor";

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
  emoji: string;
}

export interface ConnectedMentor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isVerified: boolean;
  specialty: string;
}

export interface CurrentMentee {
  id: string;
  name: string;
  avatar: string;
  goal: string;
  isVerified: boolean;
}

export interface ActiveGoal {
  title: string;
  progressPercent: number;
  inProgressCount: number;
  milestoneLabel: string;
}

export interface Achievement {
  id: string;
  title: string;
  emoji: string;
}

export interface ActiveProgram {
  id: string;
  title: string;
  coachInfo: string;
  currentLesson: number;
  totalLessons: number;
  emoji: string;
}

export interface CommunityStats {
  totalLabel: string;
  onlineLabel: string;
}

export interface BaseProfile {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  tags: string[];
  education: Education[];
  activeGoal: ActiveGoal;
  logros: Achievement[];
  activePrograms: ActiveProgram[];
  communityStats: CommunityStats;
  updatedLabel: string;
}

export interface MenteeProfileView extends BaseProfile {
  role: "mentee";
  connectedMentors: ConnectedMentor[];
}

export interface MentorProfileView extends BaseProfile {
  role: "mentor";
  currentMentees: CurrentMentee[];
  specialties: string[];
}

export type ProfileView = MenteeProfileView | MentorProfileView;
