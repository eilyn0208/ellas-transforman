import type { MenteeSummaryCard } from "@/types/mentor";

// TODO: Replace with Supabase queries:
// - SELECT profiles.*, bookings.start_time, roadmap_progress.stage
//   FROM mentor_mentee_relationships
//   JOIN profiles ON profiles.id = mentee_id
//   WHERE mentor_id = auth.uid() AND status = 'active'

export const mockMentees: MenteeSummaryCard[] = [
  {
    id: "m1",
    name: "Valeria Torres",
    avatar: "👩‍💻",
    professionalGoal: "Convertirse en Product Manager Senior en tech",
    industry: "Tecnología",
    roadmapStage: 3,
    roadmapTotalStages: 5,
    roadmapProgressPercent: 60,
    nextSession: {
      dateLabel: "Jue, Jun 26 · 10:00 AM",
      topicLabel: "Mock interview + feedback de portfolio",
    },
    sessionCount: 8,
    lastContactLabel: "Hace 2 días",
    status: "on-track",
    aiPrepSummary:
      "Valeria completó 2 casos de estudio esta semana. Recomienda reforzar métricas de impacto antes de la entrevista del lunes.",
  },
  {
    id: "m2",
    name: "Camila Ríos",
    avatar: "👩‍🎨",
    professionalGoal: "Liderar un equipo de diseño UX en startup",
    industry: "Diseño",
    roadmapStage: 2,
    roadmapTotalStages: 4,
    roadmapProgressPercent: 45,
    nextSession: {
      dateLabel: "Vie, Jun 27 · 3:00 PM",
      topicLabel: "Revisión de portfolio + pitch personal",
    },
    sessionCount: 5,
    lastContactLabel: "Hace 5 días",
    status: "needs-attention",
    aiPrepSummary:
      "Camila no ha actualizado su portfolio desde la última sesión. Puede ayudar priorizar las piezas de mayor impacto para el tiempo disponible.",
  },
  {
    id: "m3",
    name: "Lucía Mendoza",
    avatar: "👩‍🔬",
    professionalGoal: "Transición de marketing a Data Analytics",
    industry: "Datos",
    roadmapStage: 1,
    roadmapTotalStages: 5,
    roadmapProgressPercent: 18,
    nextSession: null,
    sessionCount: 2,
    lastContactLabel: "Hace 12 días",
    status: "at-risk",
    aiPrepSummary:
      "Sin actividad en 12 días. Lucía expresó dudas sobre el cambio de carrera en la última sesión. Es buen momento para un check-in de motivación.",
  },
  {
    id: "m4",
    name: "Andrea Castillo",
    avatar: "👩‍💼",
    professionalGoal: "Escalar a directora de operaciones en fintech",
    industry: "Finanzas",
    roadmapStage: 4,
    roadmapTotalStages: 5,
    roadmapProgressPercent: 82,
    nextSession: {
      dateLabel: "Lun, Jun 30 · 9:00 AM",
      topicLabel: "Estrategia de negociación salarial",
    },
    sessionCount: 14,
    lastContactLabel: "Ayer",
    status: "on-track",
    aiPrepSummary:
      "Andrea está en etapa final de proceso de selección. Preparar simulacro de negociación y revisar benchmarks de compensación para directoras en fintech.",
  },
];
