export interface MenteeSummary {
  menteeId: string;
  professionalGoal: string;
  currentRoadmapTitle: string;
  progressPercent: number;
  progressNote: string;
  nextSessionFocus: string;
  availableHours: string;
  activeProgramLabels: string[];
  generatedAt: string; // ISO string
  isAiGenerated: boolean; // false until Gemini integration is live
}

export interface MentorSummary {
  mentorId: string;
  profileTitle: string;
  description: string;
  specialties: string[];
  mentoringAreas: string[];
  mentoringStyle: string;
  isAiGenerated: boolean;
  generatedAt: string;
}
