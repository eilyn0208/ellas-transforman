import { NextRequest, NextResponse } from "next/server";
import { gemini } from "@/lib/gemini/client";
import type { MenteeSummary } from "@/types/messages";
import { mockMenteeSummaries } from "@/constants/messages";

// TODO: Replace body with Supabase profile query once auth is live
// const { data: profile } = await supabase
//   .from('profiles')
//   .select(`
//     *,
//     roadmap_milestones(*),
//     enrollments(*, programs(*)),
//     connections(*, mentors(*))
//   `)
//   .eq('id', menteeId)
//   .single()

function buildPrompt(menteeProfile: Record<string, unknown>): string {
  return `Eres un asistente especializado en mentoría profesional femenina en tecnología.

Dado el siguiente perfil de una mentee, genera un resumen estructurado en JSON para que su mentora pueda preparar la sesión de mentoría de forma efectiva.

Perfil de la mentee:
${JSON.stringify(menteeProfile, null, 2)}

Responde ÚNICAMENTE con un objeto JSON válido con estos campos (sin texto adicional):
{
  "professionalGoal": "objetivo profesional principal en 1 oración clara",
  "currentRoadmapTitle": "nombre del roadmap o ruta de aprendizaje activa",
  "progressPercent": número entre 0 y 100,
  "progressNote": "descripción del progreso actual en 1 oración",
  "nextSessionFocus": "qué debe cubrirse en la próxima sesión en 1 oración accionable",
  "availableHours": "disponibilidad horaria de la mentee",
  "activeProgramLabels": ["lista de programas o cohortes activas"]
}`;
}

function parseSummaryText(text: string): Partial<MenteeSummary> {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return {};
  try {
    return JSON.parse(match[0]) as Partial<MenteeSummary>;
  } catch {
    return {};
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { menteeId, menteeProfile } = body as {
    menteeId?: string;
    menteeProfile?: Record<string, unknown>;
  };

  // Return mock if no API key configured yet
  if (!process.env.GEMINI_API_KEY) {
    const fallback = menteeId ? mockMenteeSummaries[menteeId] : null;
    return NextResponse.json({
      summary: fallback ?? mockMenteeSummaries["mentee-mt"],
      source: "mock",
    });
  }

  try {
    const profile = menteeProfile ?? {};
    const response = await gemini.models.generateContent({
      model: "gemini-2.0-flash",
      contents: buildPrompt(profile),
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const parsed = parseSummaryText(text);

    const summary: MenteeSummary = {
      menteeId: menteeId ?? "unknown",
      professionalGoal: parsed.professionalGoal ?? "",
      currentRoadmapTitle: parsed.currentRoadmapTitle ?? "",
      progressPercent: parsed.progressPercent ?? 0,
      progressNote: parsed.progressNote ?? "",
      nextSessionFocus: parsed.nextSessionFocus ?? "",
      availableHours: parsed.availableHours ?? "",
      activeProgramLabels: parsed.activeProgramLabels ?? [],
      generatedAt: new Date().toISOString(),
      isAiGenerated: true,
    };

    return NextResponse.json({ summary, source: "gemini" });
  } catch {
    const fallback = menteeId ? mockMenteeSummaries[menteeId] : null;
    return NextResponse.json({
      summary: fallback ?? mockMenteeSummaries["mentee-mt"],
      source: "mock",
    });
  }
}
