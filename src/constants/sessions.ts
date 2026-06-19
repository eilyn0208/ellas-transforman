import type { SessionEvent, GoalAgendaItem, WeekStats } from "@/types/sessions";

// TODO: Replace with Supabase queries
// sessions table: id, type, start_time, end_time, mentor_id, booking_id, description, zoom_link, location, has_materials
// roadmap_milestones table: id, title, due_date, progress_percent, progress_note

export const weekStats: WeekStats = {
  sessionsCount: 4,
  nextSessionLabel: "Mié 10:00",
  hoursTotal: 6.5,
  hoursWeeklyTarget: 8,
  activeGoalsCount: 3,
  goalsDueThisWeek: 2,
};

export const sessionEvents: SessionEvent[] = [
  {
    id: "s1",
    type: "mentoring",
    startTime: "09:00",
    endTime: "10:00",
    dayOfWeek: 2, // Miércoles
    mentorName: "Lucia Morales",
    mentorRole: "Senior PM Mentor",
    mentorAvatar: "👩‍💼",
    description: "Enfoque: Preparación para entrevistas simuladas y retroalimentación. Zoom disponible.",
    zoomLink: "https://zoom.us/j/mock",
    mentorId: "2",
  },
  {
    id: "s2",
    type: "cohort",
    startTime: "11:00",
    endTime: "12:00",
    dayOfWeek: 2,
    mentorName: "Alejandra Pérez",
    mentorRole: "Participante",
    mentorAvatar: "👩‍🎓",
    description: "Sesión: Revisión de hoja de ruta profesional. Trae enlaces de tu portafolio.",
  },
  {
    id: "s3",
    type: "workshop",
    startTime: "14:00",
    endTime: "15:30",
    dayOfWeek: 2,
    mentorName: "Sofía Ramos",
    mentorRole: "Coach de Liderazgo",
    mentorAvatar: "👩‍🏫",
    description: "Tema: Narrativa de liderazgo. Sala B - Materiales adjuntos.",
    location: "Sala B",
    hasMaterials: true,
  },
  {
    id: "s4",
    type: "office-hours",
    startTime: "16:00",
    endTime: "17:00",
    dayOfWeek: 2,
    mentorName: "Camila Torres",
    mentorRole: "Mentora",
    mentorAvatar: "👩‍💻",
    description: "Preguntas y respuestas: transiciones de carrera y estrategia de entrevista.",
    mentorId: "4",
  },
  {
    id: "s5",
    type: "mentoring",
    startTime: "10:00",
    endTime: "11:00",
    dayOfWeek: 4, // Viernes
    mentorName: "Ana Martínez",
    mentorRole: "Software Engineer Mentor",
    mentorAvatar: "👩‍💻",
    description: "Code review y pair programming. Proyecto de portafolio.",
    zoomLink: "https://zoom.us/j/mock2",
    mentorId: "1",
  },
];

export const goalAgendaItems: GoalAgendaItem[] = [
  {
    id: "g1",
    title: "Meta: Completar Curso de Liderazgo de Producto",
    dueDateLabel: "Vie",
    owner: "Tú",
    progressPercent: 60,
    progressNote: "Proyecto práctico pendiente",
    dayOfWeek: 2,
    milestoneId: "m3",
  },
  {
    id: "g2",
    title: "Goal: Completar perfil de LinkedIn",
    dueDateLabel: "Jue",
    owner: "Tú",
    progressPercent: 80,
    progressNote: "Falta sección de habilidades",
    dayOfWeek: 3, // Jueves
    milestoneId: "m5",
  },
];

export const SESSION_FILTER_TYPES = [
  { id: "mentoring", label: "1:1" },
  { id: "cohort", label: "Cohorte" },
  { id: "workshop", label: "Taller" },
  { id: "office-hours", label: "Horas de Oficina" },
  { id: "goals", label: "Metas" },
] as const;
