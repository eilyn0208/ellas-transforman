import type { Conversation, Message } from "@/types/messages";

export interface StoredUser {
  userId: string;
  role: "mentor" | "mentee";
  name: string;
  avatar: string;
  onboardingAnswers?: Record<string, unknown>;
}

type StoredConversation = Omit<Conversation, "unreadCount"> & {
  participantIds: string[];
  unreadForMentor: number;
  unreadForMentee: number;
};

interface MessageStore {
  users: Map<string, StoredUser>;
  conversations: Map<string, StoredConversation>;
  messages: Map<string, Message[]>;
}

declare global {
  // eslint-disable-next-line no-var
  var __ellas_store: MessageStore | undefined;
}

function initStore(): MessageStore {
  const users = new Map<string, StoredUser>();
  const conversations = new Map<string, StoredConversation>();
  const messages = new Map<string, Message[]>();

  users.set("demo-mentor", {
    userId: "demo-mentor",
    role: "mentor",
    name: "Ana Martínez",
    avatar: "👩‍💻",
    onboardingAnswers: {
      current_area: "Software Engineering",
      mentoring_topics: ["Career Clarity", "Habilidades técnicas", "Liderazgo"],
      mentoring_style: "Estratégica y directa",
      preferred_mentees: ["Early Career", "Mujeres en tecnología"],
      mentor_reason: "Quiero devolver lo que aprendí y apoyar a más mujeres en tech",
    },
  });

  users.set("demo-mentee", {
    userId: "demo-mentee",
    role: "mentee",
    name: "Maria Torres",
    avatar: "👩‍🎓",
    onboardingAnswers: {
      current_role: "Product Designer",
      goal: "Transicionar a Product Management",
      experience_years: "3",
      challenges: ["Falta de red profesional", "Habilidades técnicas para PM"],
      availability: "Tardes y noches (6-9 PM UTC-5)",
      learning_style: "Práctica y orientada a proyectos",
    },
  });

  const convId = "conv-demo";
  const now = Date.now();

  conversations.set(convId, {
    id: convId,
    mentorId: "demo-mentor",
    menteeId: "demo-mentee",
    mentorName: "Ana Martínez",
    mentorAvatar: "👩‍💻",
    mentorRole: "Software Engineer · Microsoft",
    menteeName: "Maria Torres",
    menteeAvatar: "👩‍🎓",
    menteeRole: "Product Designer",
    menteeLocation: "Santiago, Chile",
    menteeGoal: "Transicionar a PM",
    menteeAvailability: "Tardes",
    matchContext: "Demo · Sesión inicial",
    matchLabel: "Conectadas vía",
    messageNumber: 1,
    status: "active",
    lastMessage: "¡Hola! Me alegra conectar contigo.",
    lastMessageAt: new Date(now - 3600000).toISOString(),
    participantIds: ["demo-mentor", "demo-mentee"],
    unreadForMentor: 0,
    unreadForMentee: 1,
  });

  messages.set(convId, [
    {
      id: "sys-demo-1",
      conversationId: convId,
      senderId: "system",
      senderRole: "system",
      senderName: "Sistema",
      content: "Conexión establecida · Sesión de mentoría iniciada",
      type: "system",
      createdAt: new Date(now - 7200000).toISOString(),
      isRead: true,
    },
    {
      id: "msg-demo-1",
      conversationId: convId,
      senderId: "demo-mentor",
      senderRole: "mentor",
      senderName: "Ana Martínez",
      content:
        "¡Hola Maria! Me alegra mucho conectar contigo. ¿En qué área quieres enfocarte este mes?",
      type: "text",
      createdAt: new Date(now - 3600000).toISOString(),
      isRead: true,
    },
  ]);

  return { users, conversations, messages };
}

if (!global.__ellas_store) {
  global.__ellas_store = initStore();
}

export const store = global.__ellas_store;

export function getConvForUser(conv: StoredConversation, userId: string): Conversation {
  const isMentor = userId === conv.mentorId;
  return {
    ...conv,
    unreadCount: isMentor ? conv.unreadForMentor : conv.unreadForMentee,
  };
}
