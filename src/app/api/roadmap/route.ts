import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Type } from "@google/genai";
import { gemini } from "@/lib/gemini/client";
import type { Roadmap } from "@/types/roadmap";

// ─── Zod schema ────────────────────────────────────────────────────────────────

const milestoneSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["completed", "in-progress", "locked", "upcoming", "suggested"]),
  mentorName: z.string().optional(),
  sessionInfo: z.string().optional(),
  requiresInfo: z.string().optional(),
  targetInfo: z.string().optional(),
  estimatedTime: z.string().optional(),
});

const recommendedActionSchema = z.object({
  title: z.string(),
  duration: z.string(),
  ctaLabel: z.string(),
});

const roadmapSchema = z.object({
  progressPercent: z.number(),
  progressSummary: z.string(),
  completedCount: z.number(),
  totalCount: z.number(),
  updatedLabel: z.string(),
  milestones: z.array(milestoneSchema),
  recommendedActions: z.array(recommendedActionSchema),
});

// ─── Gemini response schema ─────────────────────────────────────────────────

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    progressPercent: { type: Type.NUMBER },
    progressSummary: { type: Type.STRING },
    completedCount: { type: Type.NUMBER },
    totalCount: { type: Type.NUMBER },
    updatedLabel: { type: Type.STRING },
    milestones: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          status: { type: Type.STRING },
          mentorName: { type: Type.STRING },
          sessionInfo: { type: Type.STRING },
          requiresInfo: { type: Type.STRING },
          targetInfo: { type: Type.STRING },
          estimatedTime: { type: Type.STRING },
        },
        required: ["id", "title", "description", "status"],
      },
    },
    recommendedActions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          duration: { type: Type.STRING },
          ctaLabel: { type: Type.STRING },
        },
        required: ["title", "duration", "ctaLabel"],
      },
    },
  },
  required: [
    "progressPercent",
    "progressSummary",
    "completedCount",
    "totalCount",
    "updatedLabel",
    "milestones",
    "recommendedActions",
  ],
};

// ─── System prompt ──────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Eres parte de "Ellas Transforman", una plataforma de mentoría para mujeres jóvenes en tecnología y negocios.

A partir de la meta profesional y el contexto de la mentee, genera un roadmap personalizado de crecimiento profesional.

El roadmap debe tener:
- Entre 4 y 6 milestones concretos y accionables ordenados por progresión lógica
- Asigna status realistas: los primeros 1-2 como "completed" o "in-progress", luego "upcoming", "locked" y/o "suggested"
- 3 acciones recomendadas inmediatas y específicas

Para cada milestone incluye:
- id: slug corto (ej: "portfolio-update")
- title: nombre corto del hito (máx 5 palabras)
- description: 1-2 frases concretas de lo que implica
- status: "completed" | "in-progress" | "locked" | "upcoming" | "suggested"
- mentorName (solo si completed o in-progress): nombre ficticio de mentora
- sessionInfo (solo si in-progress): próxima sesión disponible
- requiresInfo (solo si locked): qué necesita completar antes
- targetInfo (solo si upcoming): meta numérica o concreta
- estimatedTime (solo si suggested): tiempo estimado

progressSummary: frase motivadora que resuma el progreso actual
updatedLabel: "Actualizado hoy" (siempre)

Responde en español. Tono: motivador, concreto, cercano.`;

// ─── Mock para desarrollo (eliminar cuando Gemini + Supabase estén integrados) ──

function getMockRoadmap(professionalGoal: string): Roadmap {
  const isProduct = /product|producto|pm/i.test(professionalGoal);
  const isDesign = /diseño|design|ux|ui/i.test(professionalGoal);
  const isTech = /tech|programar|developer|código|data|ia|ai/i.test(professionalGoal);

  const baseTitle = isProduct
    ? "Product Manager"
    : isDesign
    ? "UX Designer"
    : isTech
    ? "Desarrolladora"
    : "profesional en tech";

  return {
    progressPercent: 35,
    progressSummary: `Vas por buen camino hacia tu meta como ${baseTitle}. Sigue el momentum esta semana.`,
    completedCount: 2,
    totalCount: 5,
    updatedLabel: "Actualizado hoy",
    milestones: [
      {
        id: "portfolio-update",
        title: "Actualizar tu portafolio",
        description: `Agrega casos de estudio relevantes para ${baseTitle} con métricas de impacto.`,
        status: "completed",
        mentorName: "Mariana Álvarez",
      },
      {
        id: "mock-interviews",
        title: "Entrevistas de práctica",
        description: "Completa 3 entrevistas simuladas con retroalimentación estructurada.",
        status: "in-progress",
        sessionInfo: "Próx. sesión: Vie · 45 min",
        mentorName: "Ana García",
      },
      {
        id: "networking",
        title: "Construir tu red",
        description: "Conecta con 5 profesionales del área y asiste a un evento del sector.",
        status: "locked",
        requiresInfo: "Requiere: completar portafolio + 1 entrevista",
      },
      {
        id: "job-applications",
        title: `Aplicar a roles de ${baseTitle}`,
        description: "Envía aplicaciones con CV y carta de presentación personalizados.",
        status: "upcoming",
        targetInfo: "Meta: 3 aplicaciones este mes",
      },
      {
        id: "case-study",
        title: "Caso de estudio real",
        description: "Desarrolla un experimento de 4 semanas y documenta resultados.",
        status: "suggested",
        estimatedTime: "Est. tiempo: 4 semanas",
      },
    ],
    recommendedActions: [
      {
        title: "Revisar métricas de tu portafolio",
        duration: "15–30 min",
        ctaLabel: "Empezar",
      },
      {
        title: "Agendar entrevista de práctica",
        duration: "45 min",
        ctaLabel: "Agendar",
      },
      {
        title: "Sesión de planificación grupal",
        duration: "1 hr · Mar",
        ctaLabel: "RSVP",
      },
    ],
  };
}

// ─── Handler ────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: { professionalGoal?: string; useMock?: boolean };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { professionalGoal, useMock } = body;

  if (!professionalGoal || typeof professionalGoal !== "string") {
    return NextResponse.json({ error: "Meta profesional requerida" }, { status: 400 });
  }

  // TODO(supabase): recuperar respuestas de onboarding del usuario autenticado
  // const supabase = createSupabaseServerClient();
  // const { data: session } = await supabase.auth.getSession();
  // const { data: onboardingAnswers } = await supabase
  //   .from("mentee_onboarding")
  //   .select("answers")
  //   .eq("user_id", session.user.id)
  //   .single();

  if (useMock || process.env.USE_MOCK_ROADMAP === "true") {
    return NextResponse.json(getMockRoadmap(professionalGoal));
  }

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `La mentee quiere: ${professionalGoal}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const texto = response.text;

    if (!texto) {
      console.error("Gemini devolvió respuesta vacía:", JSON.stringify(response.candidates));
      return NextResponse.json(getMockRoadmap(professionalGoal));
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(texto);
    } catch {
      console.error("JSON inválido de Gemini:", texto);
      return NextResponse.json(getMockRoadmap(professionalGoal));
    }

    const result = roadmapSchema.safeParse(parsed);

    if (!result.success) {
      console.error("Validación fallida:", result.error);
      return NextResponse.json(getMockRoadmap(professionalGoal));
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error generando roadmap con IA:", error);
    return NextResponse.json(getMockRoadmap(professionalGoal));
  }
}
