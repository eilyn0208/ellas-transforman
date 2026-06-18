// TODO: Migrate to Supabase
// Tables: conversations, messages, mentee_summaries
// Enable Realtime on messages table for live chat

export type ConversationStatus = "active" | "archived" | "pending";
export type MessageType = "text" | "ai-summary" | "system" | "quick-response" | "canned";
export type SenderRole = "mentor" | "mentee" | "system" | "ai";

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

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: SenderRole;
  senderName: string;
  content: string;
  type: MessageType;
  createdAt: string; // ISO string
  isRead: boolean;
  // TODO: Supabase FK → conversations.id, profiles.id
}

export interface Conversation {
  id: string;
  mentorId: string;
  menteeId: string;
  // Display info for the other party
  mentorName: string;
  mentorAvatar: string;
  mentorRole: string;
  menteeName: string;
  menteeAvatar: string;
  menteeRole: string;
  menteeLocation: string;
  menteeGoal: string;
  menteeAvailability: string;
  // Match / connection context
  matchContext: string; // e.g. "Cohort: Women in Product — May"
  matchLabel: string;   // e.g. "Matched via Cohort"
  messageNumber: number;
  // State
  status: ConversationStatus;
  lastMessage: string;
  lastMessageAt: string; // ISO string
  unreadCount: number;
  // AI-generated mentee summary (lazy-loaded for mentor)
  menteeSummary?: MenteeSummary;
  // TODO: Supabase FKs
  // sessionId?: string;    // → sessions.id
  // bookingId?: string;    // → bookings.id
  // connectionId?: string; // → connections.id
}

export interface QuickResponse {
  id: string;
  label: string;
  variant: "primary" | "outline";
}

export interface CannedReply {
  id: string;
  label: string;
  variant?: "primary" | "ghost";
  hasCheckbox?: boolean;
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
