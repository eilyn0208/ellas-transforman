import { NextRequest, NextResponse } from "next/server";
import type { Roadmap, Milestone, RecommendedAction } from "@/types/roadmap";
import type { MilestoneStatus } from "@/types/roadmap";

// ─── Goal → Milestone mapping ────────────────────────────────────────────────

interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  action: RecommendedAction;
}

const GOAL_MAP: Record<string, GoalTemplate> = {
  "Conseguir internship": {
    id: "conseguir-internship",
    title: "Aplicar a internships",
    description: "Identifica 3 programas de internship relevantes y prepara tu aplicación completa con CV y carta.",
    action: { title: "Buscar convocatorias abiertas", duration: "20 min", ctaLabel: "Buscar" },
  },
  "Mejorar LinkedIn": {
    id: "mejorar-linkedin",
    title: "Optimizar perfil LinkedIn",
    description: "Actualiza tu headline, foto, resumen y experiencias con palabras clave del sector.",
    action: { title: "Revisar headline y foto de perfil", duration: "15 min", ctaLabel: "Abrir" },
  },
  "Prepararme para entrevistas": {
    id: "prep-entrevistas",
    title: "Entrevistas de práctica",
    description: "Completa 3 entrevistas simuladas con retroalimentación estructurada.",
    action: { title: "Agendar mock interview con mentora", duration: "30 min", ctaLabel: "Agendar" },
  },
  "Mejorar mi CV": {
    id: "mejorar-cv",
    title: "Actualizar tu CV",
    description: "Reformatea tu CV con logros cuantificables y palabras clave ATS para el sector.",
    action: { title: "Pedir feedback de CV a mentora", duration: "30 min", ctaLabel: "Empezar" },
  },
  "Construir networking": {
    id: "construir-networking",
    title: "Construir tu red",
    description: "Conecta con 5 profesionales del área y asiste a un evento del sector.",
    action: { title: "Ir a evento de networking", duration: "2 hrs", ctaLabel: "Ver eventos" },
  },
  "Entrar a tecnología": {
    id: "entrar-tech",
    title: "Primer proyecto técnico",
    description: "Completa un proyecto básico en tu área de interés para incluir en tu portafolio.",
    action: { title: "Elegir un curso de introducción", duration: "1–2 sem", ctaLabel: "Explorar" },
  },
  "Ganar claridad profesional": {
    id: "claridad-profesional",
    title: "Sesión de claridad",
    description: "Trabaja con una mentora para definir tus fortalezas y el camino más alineado contigo.",
    action: { title: "Agendar sesión de claridad", duration: "30 min", ctaLabel: "Agendar" },
  },
  "Sentirme más segura": {
    id: "confianza-personal",
    title: "Desarrollar confianza",
    description: "Participa en un workshop de autoconfianza y habla en al menos un espacio grupal.",
    action: { title: "Unirse a workshop de confianza", duration: "1 hr", ctaLabel: "RSVP" },
  },
  "Crear un plan profesional": {
    id: "plan-profesional",
    title: "Plan de carrera 6 meses",
    description: "Define tus metas, recursos y próximos pasos concretos para los próximos 6 meses.",
    action: { title: "Sesión de planificación con mentora", duration: "1 hr", ctaLabel: "Agendar" },
  },
  "Desarrollar liderazgo": {
    id: "liderazgo",
    title: "Liderazgo personal",
    description: "Lidera un proyecto o iniciativa pequeña para desarrollar habilidades de impacto.",
    action: { title: "Explorar programa de liderazgo", duration: "2 hrs/sem", ctaLabel: "Explorar" },
  },
  "Aprender de mujeres con experiencia": {
    id: "primera-mentoria",
    title: "Primera sesión de mentoría",
    description: "Agenda tu primera sesión con una mentora y establece tus expectativas de crecimiento.",
    action: { title: "Conocer mentoras disponibles", duration: "10 min", ctaLabel: "Descubrir" },
  },
  "Descubrir qué estudiar": {
    id: "explorar-opciones",
    title: "Explorar opciones académicas",
    description: "Haz un test de intereses y habla con profesionales de 2–3 carreras distintas.",
    action: { title: "Sesión de orientación vocacional", duration: "30 min", ctaLabel: "Agendar" },
  },
};

const FALLBACK_TEMPLATE: GoalTemplate = {
  id: "claridad-inicio",
  title: "Definir tu punto de partida",
  description: "Identifica tus fortalezas actuales y establece una meta concreta para los próximos 3 meses.",
  action: { title: "Primera sesión con mentora", duration: "30 min", ctaLabel: "Agendar" },
};

// ─── Builder determinístico ─────────────────────────────────────────────────

function buildRoadmapFromAnswers(
  goals: string[],
  interests: string[],
  stage: string,
  bookingCount: number
): Roadmap {
  const activeGoals = goals.length > 0 ? goals.slice(0, 4) : ["Ganar claridad profesional"];

  // Status progression depends on whether user has bookings
  const statusSequence: MilestoneStatus[] = bookingCount > 0
    ? ["completed", "in-progress", "upcoming", "locked"]
    : ["in-progress", "upcoming", "locked", "suggested"];

  const milestones: Milestone[] = [];
  const recommendedActions: RecommendedAction[] = [];

  activeGoals.forEach((goal, index) => {
    const template = GOAL_MAP[goal] ?? { ...FALLBACK_TEMPLATE, id: `goal-${index}` };
    const status = statusSequence[index] ?? "suggested";

    const milestone: Milestone = {
      id: template.id,
      title: template.title,
      description: template.description,
      status,
    };

    if (status === "completed") {
      milestone.mentorName = "Mentora Ellas Transforman";
    }
    if (status === "in-progress") {
      milestone.mentorName = "Mentora disponible";
      milestone.sessionInfo = "Próx. sesión disponible · 30 min";
    }
    if (status === "locked") {
      const prev = activeGoals[index - 1];
      milestone.requiresInfo = `Requiere completar: ${GOAL_MAP[prev]?.title ?? "hito anterior"}`;
    }
    if (status === "upcoming") {
      milestone.targetInfo = "Meta: completar este mes";
    }
    if (status === "suggested") {
      milestone.estimatedTime = "Est. tiempo: 2–4 semanas";
    }

    milestones.push(milestone);

    if (recommendedActions.length < 3) {
      recommendedActions.push(template.action);
    }
  });

  const completedCount = milestones.filter((m) => m.status === "completed").length;
  const totalCount = milestones.length;
  const rawPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const progressPercent = Math.max(rawPercent, bookingCount > 0 ? 20 : 10);

  const interestLabel =
    interests.length > 0 ? interests.slice(0, 2).join(" y ") : "tecnología y negocios";
  const stageLabel = stage ? ` · Etapa: ${stage}` : "";

  return {
    progressPercent,
    progressSummary: `Vas bien en tu camino hacia ${interestLabel}${stageLabel}. Sigue el momentum esta semana.`,
    completedCount,
    totalCount,
    updatedLabel: "Actualizado hoy",
    milestones,
    recommendedActions,
  };
}

// ─── Handler ────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: {
    goals?: string[];
    interests?: string[];
    stage?: string;
    bookingCount?: number;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const goals = Array.isArray(body.goals) ? body.goals : [];
  const interests = Array.isArray(body.interests) ? body.interests : [];
  const stage = typeof body.stage === "string" ? body.stage : "";
  const bookingCount = typeof body.bookingCount === "number" ? body.bookingCount : 0;

  return NextResponse.json(
    buildRoadmapFromAnswers(goals, interests, stage, bookingCount)
  );
}
