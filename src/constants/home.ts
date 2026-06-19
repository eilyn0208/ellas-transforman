import type { MenteeDashboardData, MentorDashboardData } from "@/types/home";

// TODO: Replace with Supabase + Gemini queries:
// - userName:            SELECT name FROM profiles WHERE user_id = auth.uid()
// - upcomingSession:     SELECT * FROM bookings WHERE mentee_id = auth.uid() AND start_time > now() ORDER BY start_time LIMIT 1
// - activeGoals:         SELECT * FROM roadmap_milestones WHERE user_id = auth.uid() AND status = 'in-progress' LIMIT 3
// - growthStats:         SELECT COUNT(*), skills FROM sessions WHERE user_id = auth.uid() AND created_at > now() - interval '30 days'
// - roadmapSummary:      SELECT * FROM roadmaps WHERE user_id = auth.uid() ORDER BY updated_at DESC LIMIT 1
// - aiAction:            POST /api/home-ai-action  { userId, role, context } → Gemini

export const mockMenteeDashboard: MenteeDashboardData = {
  role: "mentee",
  userName: "Valeria",
  sessionMilestoneCount: 5,
  motivationalQuote: "Pequeños pasos constantes llevan a grandes saltos en tu carrera.",
  upcomingSession: {
    id: "b1",
    title: "Sesión de Mentoría: Taller de Cambio de Carrera",
    mentorName: "Sofía Rivera",
    mentorRole: "Mentora de Diseño de Producto",
    mentorAvatar: "👩‍🎨",
    dateLabel: "Mar, Jun 23",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    locationType: "Online · 1:1",
    mentorId: "3",
  },
  activeGoals: [
    {
      id: "g1",
      title: "Actualización de Portafolio",
      description: "Presentar mi trabajo de producto",
      progressPercent: 60,
      icon: "🚀",
      iconBg: "bg-purple-100",
    },
    {
      id: "g2",
      title: "Sprint de Networking",
      description: "Conectar con mentoras",
      progressPercent: 35,
      icon: "💬",
      iconBg: "bg-blue-100",
    },
    {
      id: "g3",
      title: "Preparación para Entrevista Técnica",
      description: "Algoritmos y diseño de sistemas",
      progressPercent: 20,
      icon: "📊",
      iconBg: "bg-green-100",
    },
  ],
  growthStats: {
    sessionsThisMonth: 5,
    skillsGained: ["Investigación de usuarios", "Métricas"],
    chartDataByWeek: [20, 35, 45, 52, 65, 78],
    chartLabel: "Últimas 4 semanas",
  },
  roadmapSummary: {
    pathTitle: "Product Manager · Mid → Senior",
    currentStage: 3,
    totalStages: 5,
    completedItems: [
      "Completar caso de estudio del portafolio",
      "Entregar proyecto basado en métricas",
    ],
    inProgressItem: "Entrevistas simuladas con mentora",
  },
  aiAction: {
    suggestion: "Agenda una entrevista simulada con Sofía",
    ctaLabel: "Agendar",
    ctaRoute: "/booking/3/schedule",
  },
};

export const mockMentorDashboard: MentorDashboardData = {
  role: "mentor",
  userName: "María",
  sessionMilestoneCount: 12,
  upcomingSession: {
    id: "ms1",
    title: "Sesión 1:1 — Revisión de portafolio",
    menteeName: "Laura Pérez",
    menteeAvatar: "👩‍💻",
    menteeGoal: "Entrar a Product Management",
    dateLabel: "Lun, Jun 22",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    locationType: "Online · 1:1",
    menteeId: "m2",
  },
  activeMentees: [
    {
      id: "m1",
      name: "Sofia Cruz",
      avatar: "👩‍🎓",
      goal: "Entrar a PM",
      progressPercent: 72,
      lastActivityLabel: "Completó caso de estudio",
      needsAttention: false,
    },
    {
      id: "m2",
      name: "Laura Pérez",
      avatar: "👩‍💻",
      goal: "Data Science",
      progressPercent: 45,
      lastActivityLabel: "Sin actividad hace 5 días",
      needsAttention: true,
    },
    {
      id: "m3",
      name: "Camila Díaz",
      avatar: "👩‍🎤",
      goal: "UX Research",
      progressPercent: 88,
      lastActivityLabel: "Envió entregable de roadmap",
      needsAttention: false,
    },
  ],
  impactStats: {
    sessionsGiven: 12,
    totalHours: 18,
    menteesActive: 3,
    chartDataByWeek: [2, 3, 4, 3, 5, 4],
    chartLabel: "Últimas 6 semanas",
  },
  programProgress: {
    title: "Sprint de Liderazgo de Producto",
    currentStage: 5,
    totalStages: 8,
    nextMilestone: "Revisión de avances con mentees",
    menteesEnrolled: 3,
  },
  aiAction: {
    suggestion: "Laura lleva 5 días sin actividad — envíale un mensaje de seguimiento",
    ctaLabel: "Escribir",
    ctaRoute: "/messages",
  },
};
