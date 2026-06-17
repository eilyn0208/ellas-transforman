// TODO: Replace with Supabase queries
// SELECT c.*, profiles_mentor.*, profiles_mentee.*
//   FROM conversations c
//   JOIN profiles profiles_mentor ON c.mentor_id = profiles_mentor.user_id
//   JOIN profiles profiles_mentee ON c.mentee_id = profiles_mentee.user_id
//   WHERE auth.uid() IN (c.mentor_id, c.mentee_id)
//   AND c.status != 'archived'
//   ORDER BY c.last_message_at DESC

import type {
  Conversation,
  Message,
  MenteeSummary,
  QuickResponse,
  CannedReply,
} from "@/types/messages";

export const mockMenteeSummaries: Record<string, MenteeSummary> = {
  "mentee-mt": {
    menteeId: "mentee-mt",
    professionalGoal:
      "Transicionar de QA Engineer a Product Manager en los próximos 6 meses",
    currentRoadmapTitle: "Ruta PM · Stakeholder & Roadmap Sprint",
    progressPercent: 40,
    progressNote:
      "3 hitos en progreso: comunicación con stakeholders, A/B testing y roadmapping",
    nextSessionFocus:
      "Revisar el primer borrador de roadmap de producto y alinear prioridades con el equipo",
    availableHours: "Tardes y noches (6–9 PM UTC-5)",
    activeProgramLabels: ["Product Leadership Sprint", "Women in Product Cohort"],
    generatedAt: "2026-06-16T08:00:00Z",
    isAiGenerated: false, // TODO: set true once Gemini integration is live
  },
  "mentee-lp": {
    menteeId: "mentee-lp",
    professionalGoal:
      "Consolidar habilidades en Data Science y conseguir primer rol en empresa tech",
    currentRoadmapTitle: "Ruta Data Science · Fundamentos y Proyectos",
    progressPercent: 25,
    progressNote: "2 hitos completados: Python y SQL. Próximo: Machine Learning básico",
    nextSessionFocus:
      "Definir proyecto personal de portafolio y revisar estructura del CV técnico",
    availableHours: "Fines de semana (10 AM – 2 PM UTC-5)",
    activeProgramLabels: ["Data Science Bootcamp"],
    generatedAt: "2026-06-15T10:00:00Z",
    isAiGenerated: false,
  },
};

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    mentorId: "mentor-1",
    menteeId: "mentee-mt",
    mentorName: "Ana Martínez",
    mentorAvatar: "👩‍💻",
    mentorRole: "Software Engineer · Microsoft",
    menteeName: "Maria Torres",
    menteeAvatar: "👩‍💼",
    menteeRole: "Senior Product Designer",
    menteeLocation: "Santiago, Chile",
    menteeGoal: "transition to PM",
    menteeAvailability: "Evenings",
    matchContext: "Cohort: Women in Product — May",
    matchLabel: "Matched via Cohort",
    messageNumber: 1,
    status: "active",
    lastMessage: "¡Hola Maria! Me alegra mucho conectar contigo.",
    lastMessageAt: "2026-06-16T08:00:00Z",
    unreadCount: 1,
    menteeSummary: mockMenteeSummaries["mentee-mt"],
  },
  {
    id: "conv-2",
    mentorId: "mentor-2",
    menteeId: "mentee-lp",
    mentorName: "Camila Rojas",
    mentorAvatar: "👩‍🔬",
    mentorRole: "Data Scientist · Amazon",
    menteeName: "Laura Pérez",
    menteeAvatar: "👩‍🎓",
    menteeRole: "Estudiante de Ingeniería",
    menteeLocation: "Bogotá, Colombia",
    menteeGoal: "Data Science career",
    menteeAvailability: "Weekends",
    matchContext: "Booking: Sesión 1:1",
    matchLabel: "Agendada vía",
    messageNumber: 3,
    status: "active",
    lastMessage: "Recuerda revisar el checklist antes de la sesión",
    lastMessageAt: "2026-06-15T15:30:00Z",
    unreadCount: 0,
    menteeSummary: mockMenteeSummaries["mentee-lp"],
  },
];

export const mockMessages: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "ai-summary-conv-1",
      conversationId: "conv-1",
      senderId: "ai",
      senderRole: "ai",
      senderName: "Resumen IA",
      content: "",
      type: "ai-summary",
      createdAt: "2026-06-16T07:57:00Z",
      isRead: true,
    },
    {
      id: "msg-sys-1",
      conversationId: "conv-1",
      senderId: "system",
      senderRole: "system",
      senderName: "Sistema",
      content: "Conexión establecida · Cohort: Women in Product — May",
      type: "system",
      createdAt: "2026-06-16T07:58:00Z",
      isRead: true,
    },
    {
      id: "msg-1",
      conversationId: "conv-1",
      senderId: "mentor-1",
      senderRole: "mentor",
      senderName: "Ana Martínez",
      content: "¡Hola Maria! Me alegra mucho conectar contigo.",
      type: "text",
      createdAt: "2026-06-16T08:00:00Z",
      isRead: false,
    },
  ],
  "conv-2": [
    {
      id: "ai-summary-conv-2",
      conversationId: "conv-2",
      senderId: "ai",
      senderRole: "ai",
      senderName: "Resumen IA",
      content: "",
      type: "ai-summary",
      createdAt: "2026-06-15T15:00:00Z",
      isRead: true,
    },
    {
      id: "msg-10",
      conversationId: "conv-2",
      senderId: "mentor-2",
      senderRole: "mentor",
      senderName: "Camila Rojas",
      content: "¡Hola Laura! Revisé tu perfil y estoy muy emocionada de trabajar contigo.",
      type: "text",
      createdAt: "2026-06-15T15:10:00Z",
      isRead: true,
    },
    {
      id: "msg-11",
      conversationId: "conv-2",
      senderId: "mentee-lp",
      senderRole: "mentee",
      senderName: "Laura Pérez",
      content: "¡Gracias Camila! Tengo muchas ganas de aprender.",
      type: "text",
      createdAt: "2026-06-15T15:20:00Z",
      isRead: true,
    },
    {
      id: "msg-12",
      conversationId: "conv-2",
      senderId: "mentor-2",
      senderRole: "mentor",
      senderName: "Camila Rojas",
      content: "Recuerda revisar el checklist antes de la sesión",
      type: "text",
      createdAt: "2026-06-15T15:30:00Z",
      isRead: true,
    },
  ],
};

export const QUICK_RESPONSES: QuickResponse[] = [
  {
    id: "qr-1",
    label: "Congrats! Tell me your top goal",
    variant: "primary",
  },
  { id: "qr-2", label: "Share resume", variant: "outline" },
  { id: "qr-3", label: "Schedule 20m", variant: "primary" },
  { id: "qr-4", label: "Resources", variant: "outline" },
];

export const CANNED_REPLIES: CannedReply[] = [
  { id: "cr-1", label: "Meet – 20m" },
  { id: "cr-2", label: "Send checklist" },
  { id: "cr-3", label: "Encourage" },
  { id: "cr-4", label: "Add to mentees", hasCheckbox: true },
  { id: "cr-5", label: "Create roadmap" },
  { id: "cr-6", label: "Mark read" },
  { id: "cr-7", label: "Start 3-step plan", variant: "primary" },
  { id: "cr-8", label: "Or archive later", variant: "ghost" },
];
