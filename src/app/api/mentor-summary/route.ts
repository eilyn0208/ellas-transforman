import { NextRequest, NextResponse } from "next/server";
import { gemini } from "@/lib/gemini/client";
import { store } from "@/lib/message-store";
import type { MentorSummary } from "@/types/messages";

const mockMentorSummaries: Record<string, MentorSummary> = {
  "demo-mentor": {
    mentorId: "demo-mentor",
    profileTitle: "Strategic Guide",
    description:
      "Ana tiene una forma clara y estratégica de acompañar. Ayuda a tomar mejores decisiones y convertir metas en pasos concretos.",
    specialties: ["Software Engineering", "Career Clarity", "Liderazgo técnico"],
    mentoringAreas: ["Transición de carrera", "Habilidades técnicas", "Estrategia profesional"],
    mentoringStyle: "Estratégica y directa",
    isAiGenerated: false,
    generatedAt: new Date().toISOString(),
  },
};

function buildPrompt(profile: Record<string, unknown>): string {
  return `Eres un asistente especializado en mentoría profesional femenina en tecnología.

Dado el siguiente perfil de una mentora, genera un resumen estructurado en JSON para que su mentee pueda preparar mejor la sesión.

Perfil de la mentora:
${JSON.stringify(profile, null, 2)}

Responde ÚNICAMENTE con un objeto JSON válido (sin texto adicional):
{
  "profileTitle": "título del perfil de mentora en inglés (ej: Strategic Guide, Empathic Guide, Technical Guide)",
  "description": "descripción de su estilo de mentoría en 1 oración clara",
  "specialties": ["3 a 4 especialidades principales"],
  "mentoringAreas": ["3 a 4 áreas de mentoría"],
  "mentoringStyle": "estilo principal en pocas palabras"
}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { mentorId, mentorProfile: provided } = body as {
    mentorId?: string;
    mentorProfile?: Record<string, unknown>;
  };

  const storedUser = mentorId ? store.users.get(mentorId) : null;
  const profile = provided ?? storedUser?.onboardingAnswers ?? {};

  if (!process.env.GEMINI_API_KEY) {
    const fallback = mentorId ? mockMentorSummaries[mentorId] : null;
    return NextResponse.json({
      summary: fallback ?? mockMentorSummaries["demo-mentor"],
      source: "mock",
    });
  }

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.0-flash",
      contents: buildPrompt(profile),
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = match ? (JSON.parse(match[0]) as Partial<MentorSummary>) : {};

    const summary: MentorSummary = {
      mentorId: mentorId ?? "unknown",
      profileTitle: parsed.profileTitle ?? "Strategic Guide",
      description: parsed.description ?? "",
      specialties: parsed.specialties ?? [],
      mentoringAreas: parsed.mentoringAreas ?? [],
      mentoringStyle: parsed.mentoringStyle ?? "",
      isAiGenerated: true,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ summary, source: "gemini" });
  } catch {
    const fallback = mentorId ? mockMentorSummaries[mentorId] : null;
    return NextResponse.json({
      summary: fallback ?? mockMentorSummaries["demo-mentor"],
      source: "mock",
    });
  }
}
